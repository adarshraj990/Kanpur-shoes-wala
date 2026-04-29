import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function findAddressColumn() {
  const columnsToTest = ['id', 'created_at', 'product_id', 'amount', 'status', 'customer_name', 'phone', 'user_id'];
  
  for (const col of columnsToTest) {
    console.log(`Testing column: ${col}...`);
    const { error } = await supabase
      .from('orders')
      .select(col)
      .limit(1);
    
    if (error) {
      console.log(`❌ Column '${col}' error: ${error.message}`);
    } else {
      console.log(`✅ Column '${col}' EXISTS.`);
    }
  }
}

findAddressColumn()
