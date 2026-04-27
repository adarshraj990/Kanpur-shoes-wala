import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkProducts() {
  const { data, error, count } = await supabase
    .from('shoes')
    .select('*', { count: 'exact' });

  if (error) {
    console.error('Error fetching products:', error);
    return;
  }

  console.log(`Total Products found: ${count}`);
  if (data) {
    data.forEach(p => console.log(`- ${p.name} (₹${p.price})`));
  }
}

checkProducts();
