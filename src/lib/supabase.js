import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey || supabaseAnonKey === 'YOUR_NEW_ANON_KEY') {
  console.error('Supabase credentials missing or invalid. Please check your .env file or Vercel environment variables.');
}

const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  (supabaseAnonKey && supabaseAnonKey !== 'YOUR_NEW_ANON_KEY') ? supabaseAnonKey : 'placeholder-key'
);

export default supabase;