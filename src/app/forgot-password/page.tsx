/* MASTER_LOG - APRIL 27, 2026 
- Project Status: User Management.
- Last Action: Forgot Password flow implemented.
- Pending Tasks: Email templates customization in Supabase dashboard.
*/

"use client";

import React, { useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { ArrowLeft, Mail, Loader2, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });

      if (error) throw error;

      setMessage({
        type: "success",
        text: "Reset link sent! Please check your email inbox (and spam folder).",
      });
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 selection:bg-black selection:text-white">
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-[420px] w-full bg-white p-10 rounded-[40px] shadow-2xl border border-[#f0f0f0] relative"
      >
        <Link href="/" className="absolute top-10 left-10 p-2 text-[#ccc] hover:text-black hover:bg-[#f7f7f7] rounded-full transition-all">
          <ArrowLeft className="w-5 h-5" />
        </Link>

        <div className="flex flex-col items-center mb-10 pt-4">
          <span className="text-[18px] font-black tracking-tighter text-[#111] leading-none uppercase flex flex-col items-center mb-2">
            <span>Kanpur Shoes</span>
            <span className="text-[9px] tracking-[0.4em] text-[#999] -mt-0.5">Wala</span>
          </span>
          <div className="h-1 w-8 bg-black rounded-full mt-4" />
        </div>

        <div className="text-center mb-10">
          <h1 className="text-[28px] font-black tracking-tight text-black leading-tight">Recover Access</h1>
          <p className="text-[#888] text-[14px] mt-2 font-medium">We'll send you a link to reset your password.</p>
        </div>

        <form onSubmit={handleResetRequest} className="space-y-6">
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#bbb] group-focus-within:text-black transition-colors" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-11 pr-4 py-4 bg-[#f9f9f9] border border-transparent rounded-[18px] focus:bg-white focus:border-[#eee] transition-all text-[14px] text-black placeholder:text-[#bbb] outline-none"
              placeholder="Email address"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-black text-white rounded-[20px] font-bold text-[14px] tracking-tight hover:bg-zinc-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-black/5"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Send Reset Link"}
          </button>
        </form>

        {message && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`mt-8 p-4 rounded-2xl flex items-start gap-3 border ${
              message.type === "success" 
                ? "bg-green-50 border-green-100 text-green-700" 
                : "bg-red-50 border-red-100 text-red-700"
            }`}
          >
            {message.type === "success" && <CheckCircle className="w-5 h-5 shrink-0" />}
            <p className="text-[13px] font-bold leading-relaxed">{message.text}</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
