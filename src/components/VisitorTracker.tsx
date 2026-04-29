/* MASTER_LOG - APRIL 27, 2026 
- Project Status: Advanced Business Intelligence.
- Last Action: Integrated Visitor Tracking Logic into Layout.
*/

"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { usePathname } from "next/navigation";

export function VisitorTracker() {
  const pathname = usePathname();

  useEffect(() => {
    const trackVisit = async () => {
      try {
        await supabase.from("site_analytics").insert([
          {
            page_path: pathname,
            visited_at: new Date().toISOString(),
          },
        ]);
      } catch (err) {
        console.error("Tracking Error:", err);
      }
    };

    trackVisit();
  }, [pathname]);

  return null;
}
