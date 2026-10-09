-- Migration: 20261009000001_create_rpc_create_order.sql
-- Description: Create Postgres RPC Function `qsport.create_order` for atomic checkout & server-side price calculation (PRD v2.0)

CREATE OR REPLACE FUNCTION qsport.create_order(
    p_customer_name TEXT,
    p_customer_phone TEXT,
    p_shipping_address TEXT,
    p_customer_note TEXT DEFAULT NULL,
    p_items JSONB DEFAULT '[]'::jsonb
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = qsport, public
AS $$
DECLARE
    v_order_id UUID;
    v_order_code TEXT;
    v_total_amount BIGINT := 0;
    v_item RECORD;
    v_product_id UUID;
    v_quantity INT;
    v_product_name TEXT;
    v_product_price BIGINT;
    v_stock_qty INT;
    v_is_active BOOLEAN;
    v_deleted_at TIMESTAMPTZ;
    v_line_total BIGINT;
BEGIN
    -- 1. Input Validation
    IF trim(COALESCE(p_customer_name, '')) = '' THEN
        RAISE EXCEPTION 'Họ tên khách hàng không được để trống';
    END IF;

    IF trim(COALESCE(p_customer_phone, '')) = '' THEN
        RAISE EXCEPTION 'Số điện thoại không được để trống';
    END IF;

    IF trim(COALESCE(p_shipping_address, '')) = '' THEN
        RAISE EXCEPTION 'Địa chỉ nhận hàng không được để trống';
    END IF;

    IF p_items IS NULL OR jsonb_array_length(p_items) = 0 THEN
        RAISE EXCEPTION 'Giỏ hàng không được để trống';
    END IF;

    -- 2. Generate Unique Order Code (e.g., QS-X8A9B2)
    v_order_code := 'QS-' || upper(substring(md5(random()::text || clock_timestamp()::text) from 1 for 6));
    v_order_id := gen_random_uuid();

    -- 3. Verify products and calculate server-side totals
    FOR v_item IN SELECT * FROM jsonb_to_recordset(p_items) AS x(product_id UUID, quantity INT)
    LOOP
        v_product_id := v_item.product_id;
        v_quantity := v_item.quantity;

        IF v_product_id IS NULL OR v_quantity IS NULL OR v_quantity <= 0 THEN
            RAISE EXCEPTION 'Sản phẩm hoặc số lượng không hợp lệ';
        END IF;

        -- Query actual product info from qsport.products
        SELECT name, price, stock_quantity, is_active, deleted_at
        INTO v_product_name, v_product_price, v_stock_qty, v_is_active, v_deleted_at
        FROM qsport.products
        WHERE id = v_product_id;

        IF NOT FOUND OR v_is_active = false OR v_deleted_at IS NOT NULL THEN
            RAISE EXCEPTION 'Sản phẩm không còn hoạt động hoặc không tồn tại';
        END IF;

        IF v_stock_qty < v_quantity THEN
            RAISE EXCEPTION 'Sản phẩm % không đủ số lượng tồn kho', v_product_name;
        END IF;

        v_line_total := v_product_price * v_quantity;
        v_total_amount := v_total_amount + v_line_total;
    END LOOP;

    -- 4. Create Order Header
    INSERT INTO qsport.orders (
        id,
        order_code,
        customer_name,
        customer_phone,
        shipping_address,
        customer_note,
        payment_method,
        payment_status,
        order_status,
        total_amount
    ) VALUES (
        v_order_id,
        v_order_code,
        p_customer_name,
        p_customer_phone,
        p_shipping_address,
        p_customer_note,
        'COD',
        'COD_PENDING',
        'NEW',
        v_total_amount
    );

    -- 5. Create Order Items Snapshots
    FOR v_item IN SELECT * FROM jsonb_to_recordset(p_items) AS x(product_id UUID, quantity INT)
    LOOP
        v_product_id := v_item.product_id;
        v_quantity := v_item.quantity;

        SELECT name, price
        INTO v_product_name, v_product_price
        FROM qsport.products
        WHERE id = v_product_id;

        v_line_total := v_product_price * v_quantity;

        INSERT INTO qsport.order_items (
            order_id,
            product_id,
            product_name_snapshot,
            unit_price,
            quantity,
            line_total
        ) VALUES (
            v_order_id,
            v_product_id,
            v_product_name,
            v_product_price,
            v_quantity,
            v_line_total
        );
    END LOOP;

    -- Return JSON response
    RETURN jsonb_build_object(
        'success', true,
        'order_id', v_order_id,
        'order_code', v_order_code,
        'total_amount', v_total_amount
    );
END;
$$;

-- Grant execution permission
GRANT EXECUTE ON FUNCTION qsport.create_order TO anon, authenticated;
