export interface CartItem {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  image_url?: string | null;
  stock_quantity?: number;
  slug?: string;
}

const CART_STORAGE_KEY = 'qsport_cart';
type CartChangeListener = () => void;
const listeners: CartChangeListener[] = [];

export function onCartChange(callback: CartChangeListener): void {
  listeners.push(callback);
}

function notifyListeners(): void {
  listeners.forEach(cb => {
    try {
      cb();
    } catch {
      // Ignore listener error
    }
  });
}

export function getCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(item => item && typeof item.product_id === 'string' && typeof item.quantity === 'number' && item.quantity > 0);
  } catch {
    return [];
  }
}

export function saveCart(cart: CartItem[]): void {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch {
    // Fail-safe if localStorage disabled/full
  }
  notifyListeners();
}

export function addToCart(
  product: { id: string; name: string; price: number; image_url?: string | null; stock_quantity?: number; slug?: string },
  quantity: number = 1
): { success: boolean; message: string } {
  if (!product || !product.id) {
    return { success: false, message: 'Sản phẩm không hợp lệ' };
  }

  const addQty = Math.max(1, Math.floor(quantity));
  const cart = getCart();
  const existingIndex = cart.findIndex(item => item.product_id === product.id);

  const maxStock = product.stock_quantity ?? 99;

  if (existingIndex >= 0) {
    const newQty = cart[existingIndex].quantity + addQty;
    if (newQty > maxStock) {
      cart[existingIndex].quantity = maxStock;
      saveCart(cart);
      return { success: true, message: `Số lượng đã đạt giới hạn tồn kho (${maxStock})` };
    }
    cart[existingIndex].quantity = newQty;
  } else {
    const initialQty = Math.min(addQty, maxStock);
    cart.push({
      product_id: product.id,
      name: product.name,
      price: product.price,
      quantity: initialQty,
      image_url: product.image_url,
      stock_quantity: maxStock,
      slug: product.slug,
    });
  }

  saveCart(cart);
  return { success: true, message: `Đã thêm ${addQty} sản phẩm vào giỏ hàng` };
}

export function updateCartQuantity(productId: string, quantity: number): CartItem[] {
  const cart = getCart();
  const index = cart.findIndex(item => item.product_id === productId);

  if (index >= 0) {
    const targetQty = Math.floor(quantity);
    if (targetQty <= 0) {
      cart.splice(index, 1);
    } else {
      const maxStock = cart[index].stock_quantity ?? 99;
      cart[index].quantity = Math.min(targetQty, maxStock);
    }
    saveCart(cart);
  }

  return cart;
}

export function removeFromCart(productId: string): CartItem[] {
  const cart = getCart();
  const filtered = cart.filter(item => item.product_id !== productId);
  saveCart(filtered);
  return filtered;
}

export function clearCart(): void {
  try {
    localStorage.removeItem(CART_STORAGE_KEY);
  } catch {
    // Fail-safe
  }
  notifyListeners();
}

export function getCartSubtotal(): number {
  const cart = getCart();
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function getCartTotalCount(): number {
  const cart = getCart();
  return cart.reduce((count, item) => count + item.quantity, 0);
}
