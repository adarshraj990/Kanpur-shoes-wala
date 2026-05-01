import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testJoin() {
  console.log("Testing join between orders and shoes...")
  const { data, error } = await supabase
    .from('orders')
    .select('*, shoes(*)')
    .limit(1)

  if (error) {
    console.error("Join failed:", error.message)
    console.log("This usually means there is no foreign key relationship between orders.product_id and shoes.id")
  } else {
    console.log("Join successful! Sample data:", JSON.stringify(data, null, 2))
  }
}

testJoin()
