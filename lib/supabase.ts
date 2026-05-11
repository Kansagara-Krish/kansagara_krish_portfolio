import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.STORAGE_URL;
const supabaseAnonKey = process.env.STORAGE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL or Anon Key is not configured. File upload functionality will be disabled.');
}

export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
);

export const BUCKET_NAME = 'portfolio-uploads';
