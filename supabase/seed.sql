-- Seed File: supabase/seed.sql
-- Description: Seed data for 6 default categories and 12 demo products in 'qsport' schema (PRD v2.0)

-- ============================================================================
-- 1. SEED CATEGORIES
-- ============================================================================

INSERT INTO qsport.categories (id, category_code, name, slug, description, sort_order, is_active)
VALUES
    ('c0000000-0000-0000-0000-000000000001', 'CAT01', 'Giày', 'giay', 'Giày cầu lông chuyên dụng bám sân, chống lật cổ chân', 1, true),
    ('c0000000-0000-0000-0000-000000000002', 'CAT02', 'Vợt', 'vot', 'Vợt cầu lông công thủ toàn diện, chính hãng Q-Sport', 2, true),
    ('c0000000-0000-0000-0000-000000000003', 'CAT03', 'Quần', 'quan', 'Quần thể thao thoáng khí, co giãn 4 chiều', 3, true),
    ('c0000000-0000-0000-0000-000000000004', 'CAT04', 'Áo', 'ao', 'Áo thi đấu và tập luyện cầu lông công nghệ thấm hút', 4, true),
    ('c0000000-0000-0000-0000-000000000005', 'CAT05', 'Balo', 'balo', 'Balo và túi xách đựng vợt cầu lông chuyên nghiệp', 5, true),
    ('c0000000-0000-0000-0000-000000000006', 'CAT06', 'Phụ kiện', 'phu-kien', 'Quấn cán, dây cước, tất và phụ kiện thi đấu', 6, true)
ON CONFLICT (slug) DO UPDATE SET
    category_code = EXCLUDED.category_code,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    sort_order = EXCLUDED.sort_order,
    is_active = EXCLUDED.is_active;

-- ============================================================================
-- 2. SEED DEMO PRODUCTS
-- ============================================================================

INSERT INTO qsport.products (
    id, product_code, category_id, name, slug, sku, short_description, description, price, stock_quantity, image_url, is_active, is_featured
) VALUES
    -- Vợt Cầu Lông
    (
        'a0000000-0000-0000-0000-000000000001', 'PRD01',
        'c0000000-0000-0000-0000-000000000002',
        'Vợt Cầu Lông Q-Sport Pro Attack 100',
        'vot-cau-long-qsport-pro-attack-100',
        'QS-RKT-001',
        'Thích hợp cho người chơi thiên công, đập cầu uy lực',
        'Vợt Cầu Lông Q-Sport Pro Attack 100 được làm từ chất liệu Carbon High Modulus cao cấp, khung vợt vát hàng không giúp tối ưu hóa tốc độ vung vợt.',
        1450000, 15, '/assets/products/racket-attack.svg', true, true
    ),
    (
        'a0000000-0000-0000-0000-000000000002', 'PRD02',
        'c0000000-0000-0000-0000-000000000002',
        'Vợt Cầu Lông Q-Sport Speed Control 200',
        'vot-cau-long-qsport-speed-control-200',
        'QS-RKT-002',
        'Công thủ toàn diện, điều cầu phản tạt nhanh nhạy',
        'Vợt Q-Sport Speed Control 200 với thân vợt dẻo vừa phải, cân bằng tốt giúp người chơi linh hoạt chuyển đổi trạng thái tấn công và phòng thủ.',
        1290000, 20, '/assets/products/racket-speed.svg', true, true
    ),

    -- Giày Cầu Lông
    (
        'a0000000-0000-0000-0000-000000000003', 'PRD03',
        'c0000000-0000-0000-0000-000000000001',
        'Giày Cầu Lông Q-Sport GripMaster Green',
        'giay-cau-long-qsport-gripmaster-green',
        'QS-SH-001',
        'Đế cao su tổ ong chống trượt, bám sân cực tốt',
        'Giày Q-Sport GripMaster Green sở hữu lớp đệm giảm chấn êm ái, bảo vệ gót chân và khớp gối khi bật nhảy di chuyển liên tục trên sân.',
        1150000, 12, '/assets/products/shoe-green.svg', true, true
    ),
    (
        'a0000000-0000-0000-0000-000000000004', 'PRD04',
        'c0000000-0000-0000-0000-000000000001',
        'Giày Cầu Lông Q-Sport AirFlex Pastel',
        'giay-cau-long-qsport-airflex-pastel',
        'QS-SH-002',
        'Thiết kế pastel xanh thanh lịch, siêu nhẹ và êm ái',
        'Giày AirFlex Pastel kết hợp chất liệu lưới thoáng khí cao cấp và da nhân tạo bền bỉ, đem lại sự thoải mái trong các trận đấu kéo dài.',
        980000, 18, '/assets/products/shoe-pastel.svg', true, false
    ),

    -- Áo Thể Thao
    (
        'a0000000-0000-0000-0000-000000000005', 'PRD05',
        'c0000000-0000-0000-0000-000000000004',
        'Áo Thi Đấu Cầu Lông Q-Sport Pro Dry Green',
        'ao-thi-dau-qsport-pro-dry-green',
        'QS-TSH-001',
        'Vải mè cao cấp, thoát mồ hôi siêu tốc',
        'Áo thi đấu Q-Sport Pro Dry Green thiết kế form thể thao vừa vặn, màu xanh lá pastel chuẩn nhận diện Q-Sport.',
        290000, 30, '/assets/products/shirt-green.svg', true, true
    ),
    (
        'a0000000-0000-0000-0000-000000000006', 'PRD06',
        'c0000000-0000-0000-0000-000000000004',
        'Áo T-Shirt Thể Thao Q-Sport Basic White',
        'ao-t-shirt-the-thao-qsport-basic-white',
        'QS-TSH-002',
        'Áo tập luyện cổ tròn trắng năng động, co giãn 4 chiều',
        'Chất liệu thun lạnh mềm mịn, mang lại cảm giác dễ chịu tối đa khi di chuyển vung tay dứt điểm.',
        220000, 25, '/assets/products/shirt-white.svg', true, false
    ),

    -- Quần Thể Thao
    (
        'a0000000-0000-0000-0000-000000000007', 'PRD07',
        'c0000000-0000-0000-0000-000000000003',
        'Quần Short Cầu Lông Q-Sport Active Black',
        'quan-short-qsport-active-black',
        'QS-SHT-001',
        'Quần short có túi dây kéo an toàn, chất vải co giãn',
        'Quần Short Active Black tích hợp xẻ tà bên hông cho bước di chuyển cứu cầu linh hoạt.',
        195000, 40, '/assets/products/short-black.svg', true, false
    ),
    (
        'a0000000-0000-0000-0000-000000000008', 'PRD08',
        'c0000000-0000-0000-0000-000000000003',
        'Quần Short Cầu Lông Q-Sport Pro Match Green',
        'quan-short-qsport-pro-match-green',
        'QS-SHT-002',
        'Quần thi đấu chuyên nghiệp phối viền trắng nổi bật',
        'Vải poly mè thông thoáng, kháng khuẩn và không bị co rút khi giặt.',
        210000, 35, '/assets/products/short-green.svg', true, false
    ),

    -- Balo & Túi
    (
        'a0000000-0000-0000-0000-000000000009', 'PRD09',
        'c0000000-0000-0000-0000-000000000005',
        'Balo Cầu Lông Q-Sport Tour 6 Rackets',
        'balo-cau-long-qsport-tour-6-rackets',
        'QS-BAG-001',
        'Ngăn cách nhiệt đựng vợt và ngăn để giày riêng biệt',
        'Balo Q-Sport Tour có dung tích lớn chứa đến 6 cây vợt, quần áo, phụ kiện và trang bị cá nhân.',
        680000, 10, '/assets/products/bag-tour.svg', true, true
    ),
    (
        'a0000000-0000-0000-0000-000000000010', 'PRD10',
        'c0000000-0000-0000-0000-000000000005',
        'Túi Xách Vợt Cầu Lông Q-Sport Compact Bag',
        'tui-xach-vot-qsport-compact-bag',
        'QS-BAG-002',
        'Thiết kế gọn nhẹ, chống nước nhẹ',
        'Túi xách chuyên dụng mang đi tập luyện hàng ngày, chống trầy xước khung vợt.',
        450000, 14, '/assets/products/bag-compact.svg', true, false
    ),

    -- Phụ Kiện
    (
        'a0000000-0000-0000-0000-000000000011', 'PRD11',
        'c0000000-0000-0000-0000-000000000006',
        'Quấn Cán Vợt Q-Sport Super Grip (Bộ 3 cái)',
        'quan-can-vot-qsport-super-grip-3-pcs',
        'QS-ACC-001',
        'Độ bám cao, thấm mồ hôi tay cực tốt',
        'Quấn cán vợt chất liệu PU có độ bám dính tự nhiên, chống trượt cán vợt tuyệt đối khi thi đấu.',
        75000, 50, '/assets/products/grip-3pcs.svg', true, true
    ),
    (
        'a0000000-0000-0000-0000-000000000012', 'PRD12',
        'c0000000-0000-0000-0000-000000000006',
        'Dây Cước Vợt Q-Sport Repulsion 66',
        'day-cuoc-vot-qsport-repulsion-66',
        'QS-ACC-002',
        'Trợ lực cao, nổ cầu vang và bền bỉ',
        'Cước cầu lông đường kính 0.66mm mang lại lực nẩy tối đa và âm thanh giòn giã mỗi cú đập.',
        110000, 60, '/assets/products/string-66.svg', true, false
    )
ON CONFLICT (slug) DO UPDATE SET
    product_code = EXCLUDED.product_code,
    name = EXCLUDED.name,
    category_id = EXCLUDED.category_id,
    sku = EXCLUDED.sku,
    short_description = EXCLUDED.short_description,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    image_url = EXCLUDED.image_url,
    is_active = EXCLUDED.is_active,
    is_featured = EXCLUDED.is_featured;
