import { supabase, isSupabaseConfigured } from './supabaseClient';

export interface AdminUser {
  id: string;
  email: string;
  created_at?: string;
}

export interface AuthResult {
  success: boolean;
  message?: string;
  user?: AdminUser;
}

const ADMIN_STORAGE_KEY = 'qsport_admin_session';

export function getCachedAdminSession(): AdminUser | null {
  try {
    const raw = localStorage.getItem(ADMIN_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setCachedAdminSession(user: AdminUser | null): void {
  try {
    if (user) {
      localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(ADMIN_STORAGE_KEY);
    }
  } catch {
    // Fail-safe
  }
}

export async function checkIsAdmin(userId: string): Promise<boolean> {
  if (!userId) return false;
  if (!isSupabaseConfigured()) {
    // Demo fallback for local development without active Supabase backend
    return true;
  }

  try {
    const { data, error } = await supabase
      .from('admin_users')
      .select('user_id')
      .eq('user_id', userId)
      .maybeSingle();

    if (error || !data) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export async function signInAdmin(email: string, password: string): Promise<AuthResult> {
  const cleanEmail = email ? email.trim() : '';
  const cleanPassword = password ? password.trim() : '';

  if (!cleanEmail) {
    return { success: false, message: 'Vui lòng nhập email Admin' };
  }

  if (!cleanPassword) {
    return { success: false, message: 'Vui lòng nhập mật khẩu' };
  }

  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: cleanPassword,
      });

      if (error || !data.user) {
        return {
          success: false,
          message: error?.message || 'Email hoặc mật khẩu không chính xác',
        };
      }

      const isAdmin = await checkIsAdmin(data.user.id);
      if (!isAdmin) {
        await supabase.auth.signOut();
        return {
          success: false,
          message: 'Tài khoản này không có quyền truy cập trang Admin',
        };
      }

      const adminUser: AdminUser = {
        id: data.user.id,
        email: data.user.email || cleanEmail,
      };

      setCachedAdminSession(adminUser);
      return {
        success: true,
        user: adminUser,
      };
    } catch {
      return { success: false, message: 'Lỗi kết nối máy chủ khi đăng nhập' };
    }
  }

  // Fallback demo authentication mode
  if (cleanEmail === 'admin@qsport.vn' && cleanPassword === 'admin123') {
    const demoAdmin: AdminUser = {
      id: 'demo-admin-id-123',
      email: cleanEmail,
    };
    setCachedAdminSession(demoAdmin);
    return {
      success: true,
      user: demoAdmin,
    };
  }

  return {
    success: false,
    message: 'Email hoặc mật khẩu Admin không đúng (Demo: admin@qsport.vn / admin123)',
  };
}

export async function signOutAdmin(): Promise<void> {
  setCachedAdminSession(null);
  if (isSupabaseConfigured()) {
    try {
      await supabase.auth.signOut();
    } catch {
      // Ignore error
    }
  }
}

export async function checkCurrentAdminSession(): Promise<AdminUser | null> {
  const cached = getCachedAdminSession();
  if (!isSupabaseConfigured()) {
    return cached;
  }

  try {
    const { data } = await supabase.auth.getSession();
    if (!data.session?.user) {
      setCachedAdminSession(null);
      return null;
    }

    const isAdmin = await checkIsAdmin(data.session.user.id);
    if (!isAdmin) {
      await signOutAdmin();
      return null;
    }

    const adminUser: AdminUser = {
      id: data.session.user.id,
      email: data.session.user.email || '',
    };
    setCachedAdminSession(adminUser);
    return adminUser;
  } catch {
    return cached;
  }
}
