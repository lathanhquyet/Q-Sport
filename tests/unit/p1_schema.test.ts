import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Phase 1 (P1) Database Schema & RLS Audit Tests (qsport Schema)', () => {
  const migrationsDir = path.resolve(__dirname, '../../supabase/migrations');
  const seedFilePath = path.resolve(__dirname, '../../supabase/seed.sql');

  const schemaSqlFile = path.join(migrationsDir, '20261009000000_create_qsport_schema.sql');
  const rpcSqlFile = path.join(migrationsDir, '20261009000001_create_rpc_create_order.sql');

  it('should verify migration files exist in supabase/migrations/', () => {
    expect(fs.existsSync(schemaSqlFile)).toBe(true);
    expect(fs.existsSync(rpcSqlFile)).toBe(true);
    expect(fs.existsSync(seedFilePath)).toBe(true);
  });

  describe('Schema SQL Verification (20261009000000_create_qsport_schema.sql)', () => {
    const sqlContent = fs.readFileSync(schemaSqlFile, 'utf-8');

    it('should create mandatory qsport schema', () => {
      expect(sqlContent).toContain('CREATE SCHEMA IF NOT EXISTS qsport;');
    });

    it('should define all 6 mandatory tables in qsport schema', () => {
      expect(sqlContent).toContain('CREATE TABLE IF NOT EXISTS qsport.categories');
      expect(sqlContent).toContain('CREATE TABLE IF NOT EXISTS qsport.products');
      expect(sqlContent).toContain('CREATE TABLE IF NOT EXISTS qsport.orders');
      expect(sqlContent).toContain('CREATE TABLE IF NOT EXISTS qsport.order_items');
      expect(sqlContent).toContain('CREATE TABLE IF NOT EXISTS qsport.product_comments');
      expect(sqlContent).toContain('CREATE TABLE IF NOT EXISTS qsport.admin_users');
    });

    it('should enforce BIGINT and non-negative constraints for money & quantities', () => {
      expect(sqlContent).toContain('price BIGINT NOT NULL CHECK (price >= 0)');
      expect(sqlContent).toContain('stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0)');
      expect(sqlContent).toContain('total_amount BIGINT NOT NULL CHECK (total_amount >= 0)');
      expect(sqlContent).toContain('unit_price BIGINT NOT NULL CHECK (unit_price >= 0)');
      expect(sqlContent).toContain('quantity INTEGER NOT NULL CHECK (quantity > 0)');
      expect(sqlContent).toContain('line_total BIGINT NOT NULL CHECK (line_total >= 0)');
    });

    it('should include helper is_admin() function with SECURITY DEFINER in qsport schema', () => {
      expect(sqlContent).toContain('CREATE OR REPLACE FUNCTION qsport.is_admin()');
      expect(sqlContent).toContain('SECURITY DEFINER');
      expect(sqlContent).toContain('SELECT 1 FROM qsport.admin_users');
    });

    it('should enable Row Level Security (RLS) on all 6 qsport tables', () => {
      expect(sqlContent).toContain('ALTER TABLE qsport.categories ENABLE ROW LEVEL SECURITY;');
      expect(sqlContent).toContain('ALTER TABLE qsport.products ENABLE ROW LEVEL SECURITY;');
      expect(sqlContent).toContain('ALTER TABLE qsport.orders ENABLE ROW LEVEL SECURITY;');
      expect(sqlContent).toContain('ALTER TABLE qsport.order_items ENABLE ROW LEVEL SECURITY;');
      expect(sqlContent).toContain('ALTER TABLE qsport.product_comments ENABLE ROW LEVEL SECURITY;');
      expect(sqlContent).toContain('ALTER TABLE qsport.admin_users ENABLE ROW LEVEL SECURITY;');
    });

    it('should restrict anon from reading orders or order_items directly', () => {
      expect(sqlContent).not.toContain('CREATE POLICY orders_select_public');
      expect(sqlContent).not.toContain('CREATE POLICY order_items_select_public');
      expect(sqlContent).toContain('CREATE POLICY orders_admin_select ON qsport.orders');
    });

    it('should enforce PENDING status for new public comments', () => {
      expect(sqlContent).toContain("WITH CHECK (status = 'PENDING')");
    });
  });

  describe('Postgres RPC create_order Verification (20261009000001_create_rpc_create_order.sql)', () => {
    const rpcContent = fs.readFileSync(rpcSqlFile, 'utf-8');

    it('should define qsport.create_order RPC function with SECURITY DEFINER', () => {
      expect(rpcContent).toContain('CREATE OR REPLACE FUNCTION qsport.create_order(');
      expect(rpcContent).toContain('SECURITY DEFINER');
    });

    it('should validate customer parameters and non-empty cart items', () => {
      expect(rpcContent).toContain("Họ tên khách hàng không được để trống");
      expect(rpcContent).toContain("Số điện thoại không được để trống");
      expect(rpcContent).toContain("Địa chỉ nhận hàng không được để trống");
      expect(rpcContent).toContain("Giỏ hàng không được để trống");
    });

    it('should compute server-side totals from qsport.products prices', () => {
      expect(rpcContent).toContain('FROM qsport.products');
      expect(rpcContent).toContain('v_line_total := v_product_price * v_quantity;');
      expect(rpcContent).toContain('v_total_amount := v_total_amount + v_line_total;');
    });

    it('should grant execute permission to anon and authenticated', () => {
      expect(rpcContent).toContain('GRANT EXECUTE ON FUNCTION qsport.create_order TO anon, authenticated;');
    });
  });

  describe('Seed File Verification (supabase/seed.sql)', () => {
    const seedContent = fs.readFileSync(seedFilePath, 'utf-8');

    it('should seed 6 default categories in qsport schema', () => {
      expect(seedContent).toContain('INSERT INTO qsport.categories');
      expect(seedContent).toContain("'giay'");
      expect(seedContent).toContain("'vot'");
      expect(seedContent).toContain("'quan'");
      expect(seedContent).toContain("'ao'");
      expect(seedContent).toContain("'balo'");
      expect(seedContent).toContain("'phu-kien'");
    });

    it('should seed 12 demo products in qsport schema', () => {
      expect(seedContent).toContain('INSERT INTO qsport.products');
      expect(seedContent).toContain('Vợt Cầu Lông Q-Sport Pro Attack 100');
      expect(seedContent).toContain('Vợt Cầu Lông Q-Sport Speed Control 200');
    });

    it('should use ON CONFLICT to ensure idempotent re-runs', () => {
      expect(seedContent).toContain('ON CONFLICT (slug) DO UPDATE SET');
    });
  });
});
