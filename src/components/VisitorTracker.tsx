"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { usePathname } from "next/navigation";

// This component is placed in layout.tsx.
// It does TWO things:
// 1. Logs a page visit to 'site_analytics' table (for historical data).
// 2. Joins a Supabase Realtime Presence channel so the dashboard
//    can count how many browsers are currently open on the site.
export function VisitorTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // ── 1. Log historical page visit ─────────────────────────────
    const trackVisit = async () => {
      try {
        await supabase.from("site_analytics").insert([
          { page_path: pathname, visited_at: new Date().toISOString() },
        ]);
      } catch (err) {
        console.error("Tracking Error:", err);
      }
    };
    trackVisit();
  }, [pathname]);

  useEffect(() => {
    // ── 2. Join Supabase Realtime Presence channel ─────────────────
    // Each browser tab that opens the site joins this channel.
    // The dashboard subscribes to the same channel and counts members.
    const channel = supabase.channel("live_visitors", {
      config: { presence: { key: crypto.randomUUID() } },
    });

    channel
      .on("presence", { event: "sync" }, () => {
        // Presence state is read by the dashboard, not here.
        // This component's job is just to JOIN the channel.
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          // Track this user's session in presence
          await channel.track({
            online_at: new Date().toISOString(),
            page: window.location.pathname,
          });
        }
      });

    // Leave the channel when the tab is closed / navigated away
    return () => {
      channel.unsubscribe();
    };
  }, []); // Only run once on mount

  return null;
}
