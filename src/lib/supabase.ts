/* MASTER_LOG - APRIL 26, 2026 
- Project Status: Migrated to @supabase/ssr.
- Last Action: Updated lib/supabase.ts to use the new SSR browser client.
- Pending Tasks: Update AuthContext and components.
*/

import { createClient } from '@/utils/supabase/client';

export const supabase = createClient();
