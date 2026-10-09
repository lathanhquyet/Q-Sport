-- Migration: 20261009000002_add_short_codes.sql
-- Description: Add 5-character category_code (CATxx) and product_code (PRDxx) with sequences, triggers, and UNIQUE constraints (PRD v2.0)

-- 1. ADD COLUMNS
ALTER TABLE qsport.categories ADD COLUMN IF NOT EXISTS category_code VARCHAR(5);
ALTER TABLE qsport.products ADD COLUMN IF NOT EXISTS product_code VARCHAR(5);

-- 2. CREATE SEQUENCES FOR AUTO-GENERATION (1..99)
CREATE SEQUENCE IF NOT EXISTS qsport.category_code_seq START WITH 1 INCREMENT BY 1 MINVALUE 1 MAXVALUE 99;
CREATE SEQUENCE IF NOT EXISTS qsport.product_code_seq START WITH 1 INCREMENT BY 1 MINVALUE 1 MAXVALUE 99;

-- 3. TRIGGER FUNCTION FOR CATEGORIES (CATxx)
CREATE OR REPLACE FUNCTION qsport.assign_category_code()
RETURNS TRIGGER AS $$
DECLARE
    v_next_val INT;
BEGIN
    -- Protect code from being mutated on UPDATE
    IF TG_OP = 'UPDATE' THEN
        NEW.category_code := OLD.category_code;
        RETURN NEW;
    END IF;

    -- Auto-generate if code is null or whitespace
    IF NEW.category_code IS NULL OR trim(NEW.category_code) = '' THEN
        v_next_val := nextval('qsport.category_code_seq');
        IF v_next_val > 99 THEN
            RAISE EXCEPTION 'Đã hết không gian mã danh mục khả dụng (tối đa 99 danh mục)';
        END IF;
        NEW.category_code := 'CAT' || lpad(v_next_val::text, 2, '0');
    ELSE
        -- Validate format for custom input (e.g. during CSV import)
        IF NOT (NEW.category_code ~ '^CAT[0-9]{2}$') THEN
            RAISE EXCEPTION 'Mã danh mục không đúng định dạng CATxx (ví dụ: CAT01)';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. TRIGGER FUNCTION FOR PRODUCTS (PRDxx)
CREATE OR REPLACE FUNCTION qsport.assign_product_code()
RETURNS TRIGGER AS $$
DECLARE
    v_next_val INT;
BEGIN
    -- Protect code from being mutated on UPDATE
    IF TG_OP = 'UPDATE' THEN
        NEW.product_code := OLD.product_code;
        RETURN NEW;
    END IF;

    -- Auto-generate if code is null or whitespace
    IF NEW.product_code IS NULL OR trim(NEW.product_code) = '' THEN
        v_next_val := nextval('qsport.product_code_seq');
        IF v_next_val > 99 THEN
            RAISE EXCEPTION 'Đã hết không gian mã sản phẩm khả dụng (tối đa 99 sản phẩm)';
        END IF;
        NEW.product_code := 'PRD' || lpad(v_next_val::text, 2, '0');
    ELSE
        -- Validate format for custom input (e.g. during CSV import)
        IF NOT (NEW.product_code ~ '^PRD[0-9]{2}$') THEN
            RAISE EXCEPTION 'Mã sản phẩm không đúng định dạng PRDxx (ví dụ: PRD01)';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 5. ATTACH TRIGGERS
DROP TRIGGER IF EXISTS trg_assign_category_code ON qsport.categories;
CREATE TRIGGER trg_assign_category_code
    BEFORE INSERT OR UPDATE ON qsport.categories
    FOR EACH ROW EXECUTE FUNCTION qsport.assign_category_code();

DROP TRIGGER IF EXISTS trg_assign_product_code ON qsport.products;
CREATE TRIGGER trg_assign_product_code
    BEFORE INSERT OR UPDATE ON qsport.products
    FOR EACH ROW EXECUTE FUNCTION qsport.assign_product_code();

-- 6. POPULATE EXISTING RECORDS IF ANY
UPDATE qsport.categories SET category_code = 'CAT' || lpad(sort_order::text, 2, '0') WHERE category_code IS NULL;
UPDATE qsport.products SET product_code = 'PRD' || lpad(substring(sku from 8 for 3), 2, '0') WHERE product_code IS NULL AND sku LIKE 'QS-%-0%';

-- 7. CONSTRAINTS
ALTER TABLE qsport.categories DROP CONSTRAINT IF EXISTS uq_categories_category_code;
ALTER TABLE qsport.categories ADD CONSTRAINT uq_categories_category_code UNIQUE (category_code);
ALTER TABLE qsport.categories ALTER COLUMN category_code SET NOT NULL;

ALTER TABLE qsport.products DROP CONSTRAINT IF EXISTS uq_products_product_code;
ALTER TABLE qsport.products ADD CONSTRAINT uq_products_product_code UNIQUE (product_code);
ALTER TABLE qsport.products ALTER COLUMN product_code SET NOT NULL;
