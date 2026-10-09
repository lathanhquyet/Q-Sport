import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://wcddiwvpmkztwewdmszb.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'placeholder-anon-key';

export const isSupabaseConfigured = (): boolean => {
  return (
    Boolean(import.meta.env.VITE_SUPABASE_URL) &&
    Boolean(import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY) &&
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY !== 'placeholder-anon-key'
  );
};

// Create client configured for 'qsport' schema
export const supabase = createClient(supabaseUrl, supabaseKey, {
  db: {
    schema: 'qsport',
  },
});
