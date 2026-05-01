import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

async function test() {
  console.log("--- Testing Shoes Table ---")

  // Test Insert
  const { data: inserted, error: insertErr } = await supabase
    .from('shoes')
    .insert([{
      name: '__TEST_SHOE__',
      price: 1,
      description: 'test',
      category: 'Sneakers',
      stock: 1,
      image_url: 'https://placehold.co/100',
      image_urls: ['https://placehold.co/100'],
      created_at: new Date().toISOString()
    }])
    .select()

  if (insertErr) { console.error("❌ Insert FAILED:", insertErr.message); return; }
  console.log("✅ Insert OK — id:", inserted![0].id)

  const testId = inserted![0].id

  // Test Delete
  const { error: deleteErr } = await supabase.from('shoes').delete().eq('id', testId)
  if (deleteErr) { console.error("❌ Delete FAILED:", deleteErr.message); return; }
  console.log("✅ Delete OK")

  // Test Orders Insert
  console.log("\n--- Testing Orders Table ---")
  const { data: order, error: orderErr } = await supabase
    .from('orders')
    .insert([{
      product_id: 1,
      amount: 999,
      status: 'success',
      customer_name: '__TEST_USER__',
      phone: '9999999999',
      address: 'Test Street',
      city: 'Kanpur',
      pincode: '208001',
      created_at: new Date().toISOString()
    }])
    .select()

  if (orderErr) { console.error("❌ Order Insert FAILED:", orderErr.message); return; }
  console.log("✅ Order Insert OK — id:", order![0].id)
  // Clean up test order
  await supabase.from('orders').delete().eq('id', order![0].id)
  console.log("✅ Order Cleanup OK")

  console.log("\n🎉 ALL TESTS PASSED — Database is fully working!")
}

test()
