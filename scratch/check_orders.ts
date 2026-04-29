import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkOrders() {
  console.log("Attempting minimal valid insert into orders table...")
  const testOrder = {
    product_id: 1,
    amount: 100,
    status: "success",
    customer_name: "Test User"
  }

  const { data, error: insertError } = await supabase.from('orders').insert([testOrder]).select()
  
  if (insertError) {
    console.error("Minimal valid insert failed:", insertError)
  } else {
    console.log("Insert successful! Columns found:", Object.keys(data[0]))
  }

  console.log("Checking orders table...")
  const { data: fetchResult, error: fetchError } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5)

  if (fetchError) {
    console.error("Error fetching orders:", fetchError)
  } else {
    console.log("Latest 5 orders:", JSON.stringify(fetchResult, null, 2))
    console.log("Total orders count:", fetchResult?.length)
  }
}

checkOrders()
