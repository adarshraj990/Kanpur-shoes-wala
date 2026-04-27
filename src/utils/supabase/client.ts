import { createBrowserClient } from "@supabase/ssr";

export const createClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error("CRITICAL: Supabase environment variables are missing! Check .env.local");
    // Return a dummy client or handle gracefully to prevent crash if possible, 
    // but @supabase/ssr requires them.
  }

  return createBrowserClient(
    supabaseUrl!,
    supabaseKey!,
  );
};
