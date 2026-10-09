import { supabase, isSupabaseConfigured } from './supabaseClient';
import { Product } from '../types';

export const DEMO_PRODUCTS: Product[] = [
  {
    id: 'p0000000-0000-0000-0000-000000000001',
    category_id: 'c0000000-0000-0000-0000-000000000002',
    name: 'Vợt Cầu Lông Q-Sport Pro Attack 100',
    slug: 'vot-cau-long-qsport-pro-attack-100',
    sku: 'QS-RKT-001',
    short_description: 'Thích hợp cho người chơi thiên công, đập cầu uy lực',
    description: 'Vợt Cầu Lông Q-Sport Pro Attack 100 được làm từ chất liệu Carbon High Modulus cao cấp, khung vợt vát hàng không giúp tối ưu hóa tốc độ vung vợt.',
    price: 1450000,
    stock_quantity: 15,
    image_url: '/assets/products/racket-attack.jpg',
    is_active: true,
    is_featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'p0000000-0000-0000-0000-000000000002',
    category_id: 'c0000000-0000-0000-0000-000000000002',
    name: 'Vợt Cầu Lông Q-Sport Speed Control 200',
    slug: 'vot-cau-long-qsport-speed-control-200',
    sku: 'QS-RKT-002',
    short_description: 'Công thủ toàn diện, điều cầu phản tạt nhanh nhạy',
    description: 'Vợt Q-Sport Speed Control 200 với thân vợt dẻo vừa phải, cân bằng tốt giúp người chơi linh hoạt chuyển đổi trạng thái tấn công và phòng thủ.',
    price: 1290000,
    stock_quantity: 20,
    image_url: '/assets/products/racket-speed.jpg',
    is_active: true,
    is_featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'p0000000-0000-0000-0000-000000000003',
    category_id: 'c0000000-0000-0000-0000-000000000001',
    name: 'Giày Cầu Lông Q-Sport GripMaster Green',
    slug: 'giay-cau-long-qsport-gripmaster-green',
    sku: 'QS-SH-001',
    short_description: 'Đế cao su tổ ong chống trượt, bám sân cực tốt',
    description: 'Giày Q-Sport GripMaster Green sở hữu lớp đệm giảm chấn êm ái, bảo vệ gót chân và khớp gối khi bật nhảy di chuyển liên tục trên sân.',
    price: 1150000,
    stock_quantity: 12,
    image_url: '/assets/products/shoe-green.jpg',
    is_active: true,
    is_featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'p0000000-0000-0000-0000-000000000004',
    category_id: 'c0000000-0000-0000-0000-000000000001',
    name: 'Giày Cầu Lông Q-Sport AirFlex Pastel',
    slug: 'giay-cau-long-qsport-airflex-pastel',
    sku: 'QS-SH-002',
    short_description: 'Thiết kế pastel xanh thanh lịch, siêu nhẹ và êm ái',
    description: 'Giày AirFlex Pastel kết hợp chất liệu lưới thoáng khí cao cấp và da nhân tạo bền bỉ, đem lại sự thoải mái trong các trận đấu kéo dài.',
    price: 980000,
    stock_quantity: 18,
    image_url: '/assets/products/shoe-pastel.jpg',
    is_active: true,
    is_featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'p0000000-0000-0000-0000-000000000005',
    category_id: 'c0000000-0000-0000-0000-000000000004',
    name: 'Áo Thi Đấu Cầu Lông Q-Sport Pro Dry Green',
    slug: 'ao-thi-dau-qsport-pro-dry-green',
    sku: 'QS-TSH-001',
    short_description: 'Vải mè cao cấp, thoát mồ hôi siêu tốc',
    description: 'Áo thi đấu Q-Sport Pro Dry Green thiết kế form thể thao vừa vặn, màu xanh lá pastel chuẩn nhận diện Q-Sport.',
    price: 290000,
    stock_quantity: 30,
    image_url: '/assets/products/shirt-green.jpg',
    is_active: true,
    is_featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'p0000000-0000-0000-0000-000000000006',
    category_id: 'c0000000-0000-0000-0000-000000000004',
    name: 'Áo T-Shirt Thể Thao Q-Sport Basic White',
    slug: 'ao-t-shirt-the-thao-qsport-basic-white',
    sku: 'QS-TSH-002',
    short_description: 'Áo tập luyện cổ tròn trắng năng động, co giãn 4 chiều',
    description: 'Chất liệu thun lạnh mềm mịn, mang lại cảm giác dễ chịu tối đa khi di chuyển vung tay dứt điểm.',
    price: 220000,
    stock_quantity: 25,
    image_url: '/assets/products/shirt-white.jpg',
    is_active: true,
    is_featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'p0000000-0000-0000-0000-000000000007',
    category_id: 'c0000000-0000-0000-0000-000000000003',
    name: 'Quần Short Cầu Lông Q-Sport Active Black',
    slug: 'quan-short-qsport-active-black',
    sku: 'QS-SHT-001',
    short_description: 'Quần short có túi dây kéo an toàn, chất vải co giãn',
    description: 'Quần Short Active Black tích hợp xẻ tà bên hông cho bước di chuyển cứu cầu linh hoạt.',
    price: 195000,
    stock_quantity: 40,
    image_url: '/assets/products/short-black.jpg',
    is_active: true,
    is_featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'p0000000-0000-0000-0000-000000000008',
    category_id: 'c0000000-0000-0000-0000-000000000003',
    name: 'Quần Short Cầu Lông Q-Sport Pro Match Green',
    slug: 'quan-short-qsport-pro-match-green',
    sku: 'QS-SHT-002',
    short_description: 'Quần thi đấu chuyên nghiệp phối viền trắng nổi bật',
    description: 'Vải poly mè thông thoáng, kháng khuẩn và không bị co rút khi giặt.',
    price: 210000,
    stock_quantity: 35,
    image_url: '/assets/products/short-green.jpg',
    is_active: true,
    is_featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'p0000000-0000-0000-0000-000000000009',
    category_id: 'c0000000-0000-0000-0000-000000000005',
    name: 'Balo Cầu Lông Q-Sport Tour 6 Rackets',
    slug: 'balo-cau-long-qsport-tour-6-rackets',
    sku: 'QS-BAG-001',
    short_description: 'Ngăn cách nhiệt đựng vợt và ngăn để giày riêng biệt',
    description: 'Balo Q-Sport Tour có dung tích lớn chứa đến 6 cây vợt, quần áo, phụ kiện và trang bị cá nhân.',
    price: 680000,
    stock_quantity: 10,
    image_url: '/assets/products/bag-tour.jpg',
    is_active: true,
    is_featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'p0000000-0000-0000-0000-000000000010',
    category_id: 'c0000000-0000-0000-0000-000000000005',
    name: 'Túi Xách Vợt Cầu Lông Q-Sport Compact Bag',
    slug: 'tui-xach-vot-qsport-compact-bag',
    sku: 'QS-BAG-002',
    short_description: 'Thiết kế gọn nhẹ, chống nước nhẹ',
    description: 'Túi xách chuyên dụng mang đi tập luyện hàng ngày, chống trầy xước khung vợt.',
    price: 450000,
    stock_quantity: 14,
    image_url: '/assets/products/bag-compact.jpg',
    is_active: true,
    is_featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'p0000000-0000-0000-0000-000000000011',
    category_id: 'c0000000-0000-0000-0000-000000000006',
    name: 'Quấn Cán Vợt Q-Sport Super Grip (Bộ 3 cái)',
    slug: 'quan-can-vot-qsport-super-grip-3-pcs',
    sku: 'QS-ACC-001',
    short_description: 'Độ bám cao, thấm mồ hôi tay cực tốt',
    description: 'Quấn cán vợt chất liệu PU có độ bám dính tự nhiên, chống trượt cán vợt tuyệt đối khi thi đấu.',
    price: 75000,
    stock_quantity: 50,
    image_url: '/assets/products/grip-3pcs.jpg',
    is_active: true,
    is_featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'p0000000-0000-0000-0000-000000000012',
    category_id: 'c0000000-0000-0000-0000-000000000006',
    name: 'Dây Cước Vợt Q-Sport Repulsion 66',
    slug: 'day-cuoc-vot-qsport-repulsion-66',
    sku: 'QS-ACC-002',
    short_description: 'Trợ lực cao, nổ cầu vang và bền bỉ',
    description: 'Cước cầu lông đường kính 0.66mm mang lại lực nẩy tối đa và âm thanh giòn giã mỗi cú đập.',
    price: 110000,
    stock_quantity: 60,
    image_url: '/assets/products/string-66.jpg',
    is_active: true,
    is_featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];

export interface FetchProductsOptions {
  categorySlug?: string;
  search?: string;
  sort?: 'newest' | 'price-asc' | 'price-desc';
}

export async function getProducts(options: FetchProductsOptions = {}): Promise<Product[]> {
  if (isSupabaseConfigured()) {
    try {
      let query = supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .is('deleted_at', null);

      if (options.search && options.search.trim() !== '') {
        query = query.ilike('name', `%${options.search.trim()}%`);
      }

      if (options.sort === 'price-asc') {
        query = query.order('price', { ascending: true });
      } else if (options.sort === 'price-desc') {
        query = query.order('price', { ascending: false });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query;

      if (!error && data && data.length > 0) {
        let result = data as Product[];
        if (options.categorySlug && options.categorySlug !== 'all') {
          // Join or filter category
          const { data: catData } = await supabase
            .from('categories')
            .select('id')
            .eq('slug', options.categorySlug)
            .single();
          if (catData) {
            result = result.filter(p => p.category_id === catData.id);
          }
        }
        return result;
      }
    } catch {
      // Fallback below
    }
  }

  // Fallback memory filtering
  let list = [...DEMO_PRODUCTS];

  if (options.categorySlug && options.categorySlug !== 'all') {
    const categoryIdMap: Record<string, string> = {
      'giay': 'c0000000-0000-0000-0000-000000000001',
      'vot': 'c0000000-0000-0000-0000-000000000002',
      'quan': 'c0000000-0000-0000-0000-000000000003',
      'ao': 'c0000000-0000-0000-0000-000000000004',
      'balo': 'c0000000-0000-0000-0000-000000000005',
      'phu-kien': 'c0000000-0000-0000-0000-000000000006'
    };
    const catId = categoryIdMap[options.categorySlug];
    if (catId) {
      list = list.filter(p => p.category_id === catId);
    }
  }

  if (options.search && options.search.trim() !== '') {
    const term = options.search.trim().toLowerCase();
    list = list.filter(p => p.name.toLowerCase().includes(term) || (p.short_description && p.short_description.toLowerCase().includes(term)));
  }

  if (options.sort === 'price-asc') {
    list.sort((a, b) => a.price - b.price);
  } else if (options.sort === 'price-desc') {
    list.sort((a, b) => b.price - a.price);
  } else {
    list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  return list;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .is('deleted_at', null)
        .single();
      if (!error && data) {
        return data as Product;
      }
    } catch {
      // Fallback
    }
  }

  const found = DEMO_PRODUCTS.find(p => p.slug === slug);
  return found || null;
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const all = await getProducts();
  return all.filter(p => p.is_featured);
}
