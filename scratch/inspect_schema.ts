import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkSchema() {
  console.log("Fetching sample row from orders to check columns...")
  // We try to fetch any one row to see columns
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .limit(1)

  if (error) {
    console.error("Error fetching schema:", error)
  } else {
    console.log("Columns found in orders table:", Object.keys(data[0] || {}))
  }
}

checkSchema()
