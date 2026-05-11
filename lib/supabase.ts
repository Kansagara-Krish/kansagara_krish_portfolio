import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.STORAGE_URL;
const supabaseAnonKey = process.env.STORAGE_KEY;

if (!supabaseUrl) {
  throw new Error("Missing environment variable: STORAGE_URL (Supabase URL)");
}
if (!supabaseAnonKey) {
  throw new Error("Missing environment variable: STORAGE_KEY (Supabase Anon Key)");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const BUCKET_NAME = 'portfolio-uploads';
