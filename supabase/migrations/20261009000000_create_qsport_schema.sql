-- Migration: 20261009000000_create_qsport_schema.sql
-- Description: Create Q-Sport Online Store database schema in 'qsport' schema, indexes, constraints, helper functions, and RLS policies (PRD v2.0)

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create mandatory schema qsport
CREATE SCHEMA IF NOT EXISTS qsport;

-- ============================================================================
-- 1. TABLES CREATION (qsport schema)
-- ============================================================================

CREATE TABLE IF NOT EXISTS qsport.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS qsport.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES qsport.categories(id) ON DELETE RESTRICT,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    sku TEXT UNIQUE,
    short_description TEXT,
    description TEXT,
    price BIGINT NOT NULL CHECK (price >= 0),
    stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    image_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS qsport.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_code TEXT NOT NULL UNIQUE,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    shipping_address TEXT NOT NULL,
    customer_note TEXT,
    payment_method TEXT NOT NULL DEFAULT 'COD' CHECK (payment_method IN ('COD')),
    payment_status TEXT NOT NULL DEFAULT 'COD_PENDING' CHECK (payment_status IN ('UNPAID', 'PENDING_CONFIRMATION', 'PAID', 'COD_PENDING', 'COD_COLLECTED')),
    order_status TEXT NOT NULL DEFAULT 'NEW' CHECK (order_status IN ('NEW', 'PROCESSING', 'OUT_OF_STOCK', 'SHIPPED', 'CANCELLED')),
    total_amount BIGINT NOT NULL CHECK (total_amount >= 0),
    cancel_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS qsport.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES qsport.orders(id) ON DELETE RESTRICT,
    product_id UUID REFERENCES qsport.products(id) ON DELETE SET NULL,
    product_name_snapshot TEXT NOT NULL,
    unit_price BIGINT NOT NULL CHECK (unit_price >= 0),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    line_total BIGINT NOT NULL CHECK (line_total >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS qsport.product_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES qsport.products(id) ON DELETE CASCADE,
    display_name TEXT NOT NULL,
    content TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'HIDDEN')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS qsport.admin_users (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- 2. INDEXES CREATION
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_products_category_id ON qsport.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON qsport.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON qsport.products(is_active) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON qsport.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_order_code ON qsport.orders(order_code);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON qsport.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_comments_product_status ON qsport.product_comments(product_id, status);

-- ============================================================================
-- 3. HELPER FUNCTION (Avoid Recursive RLS on admin_users)
-- ============================================================================

CREATE OR REPLACE FUNCTION qsport.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = qsport, public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM qsport.admin_users
    WHERE user_id = auth.uid()
  );
$$;

GRANT USAGE ON SCHEMA qsport TO anon, authenticated;
GRANT EXECUTE ON FUNCTION qsport.is_admin() TO anon, authenticated;

-- ============================================================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

ALTER TABLE qsport.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE qsport.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE qsport.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE qsport.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE qsport.product_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE qsport.admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY categories_select_public ON qsport.categories
    FOR SELECT TO anon, authenticated
    USING (is_active = true OR qsport.is_admin());

CREATE POLICY categories_admin_all ON qsport.categories
    FOR ALL TO authenticated
    USING (qsport.is_admin())
    WITH CHECK (qsport.is_admin());

CREATE POLICY products_select_public ON qsport.products
    FOR SELECT TO anon, authenticated
    USING ((is_active = true AND deleted_at IS NULL) OR qsport.is_admin());

CREATE POLICY products_admin_all ON qsport.products
    FOR ALL TO authenticated
    USING (qsport.is_admin())
    WITH CHECK (qsport.is_admin());

CREATE POLICY orders_admin_select ON qsport.orders
    FOR SELECT TO authenticated
    USING (qsport.is_admin());

CREATE POLICY orders_admin_update ON qsport.orders
    FOR UPDATE TO authenticated
    USING (qsport.is_admin())
    WITH CHECK (qsport.is_admin());

CREATE POLICY order_items_admin_select ON qsport.order_items
    FOR SELECT TO authenticated
    USING (qsport.is_admin());

CREATE POLICY comments_select_public ON qsport.product_comments
    FOR SELECT TO anon, authenticated
    USING (status = 'APPROVED' OR qsport.is_admin());

CREATE POLICY comments_insert_public ON qsport.product_comments
    FOR INSERT TO anon, authenticated
    WITH CHECK (status = 'PENDING');

CREATE POLICY comments_admin_all ON qsport.product_comments
    FOR ALL TO authenticated
    USING (qsport.is_admin())
    WITH CHECK (qsport.is_admin());

CREATE POLICY admin_users_select ON qsport.admin_users
    FOR SELECT TO authenticated
    USING (user_id = auth.uid());

-- ============================================================================
-- 5. GRANTS
-- ============================================================================

GRANT SELECT ON qsport.categories TO anon, authenticated;
GRANT SELECT ON qsport.products TO anon, authenticated;
GRANT SELECT, INSERT ON qsport.product_comments TO anon, authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE ON qsport.categories TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON qsport.products TO authenticated;
GRANT SELECT, UPDATE ON qsport.orders TO authenticated;
GRANT SELECT ON qsport.order_items TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON qsport.product_comments TO authenticated;
GRANT SELECT ON qsport.admin_users TO authenticated;
