"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { Lock, Loader2, CheckCircle, Eye, EyeOff, ShieldCheck, Zap } from "lucide-react";
import { useRouter } from "next/navigation";

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const router = useRouter();

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match." });
      return;
    }

    if (password.length < 6) {
      setMessage({ type: "error", text: "Password must be at least 6 characters." });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;

      setMessage({
        type: "success",
        text: "Security check complete! Password updated. Redirecting...",
      });

      setTimeout(() => {
        router.push("/"); 
      }, 3000);
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 selection:bg-black selection:text-white">
      <motion.div 
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="max-w-[420px] w-full bg-white p-10 rounded-[40px] shadow-2xl border border-[#f0f0f0] relative"
      >
        <div className="flex flex-col items-center mb-10 pt-4">
          <span className="text-[18px] font-black tracking-tighter text-[#111] leading-none uppercase flex flex-col items-center mb-2">
            <span>Kanpur Shoes</span>
            <span className="text-[9px] tracking-[0.4em] text-[#999] -mt-0.5">Wala</span>
          </span>
          <div className="h-1 w-8 bg-black rounded-full mt-4" />
        </div>

        <div className="text-center mb-10">
          <h1 className="text-[28px] font-black tracking-tight text-black leading-tight">New Password</h1>
          <p className="text-[#888] text-[14px] mt-2 font-medium">Please set a secure new password for your account.</p>
        </div>

        <form onSubmit={handleUpdatePassword} className="space-y-6">
          <div className="space-y-4">
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#bbb] group-focus-within:text-black transition-colors" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-12 py-4 bg-[#f9f9f9] border border-transparent rounded-[18px] focus:bg-white focus:border-[#eee] transition-all text-[14px] text-black placeholder:text-[#bbb] outline-none font-bold"
                placeholder="New password"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#ccc] hover:text-black transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#bbb] group-focus-within:text-black transition-colors" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-4 bg-[#f9f9f9] border border-transparent rounded-[18px] focus:bg-white focus:border-[#eee] transition-all text-[14px] text-black placeholder:text-[#bbb] outline-none font-bold"
                placeholder="Confirm password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-black text-white rounded-[20px] font-bold text-[14px] tracking-tight hover:bg-zinc-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-black/5"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Update Password"}
          </button>
        </form>

        {message && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`mt-8 p-5 rounded-2xl flex items-start gap-3 border ${
              message.type === "success" 
                ? "bg-green-50 border-green-100 text-green-700" 
                : "bg-red-50 border-red-100 text-red-700"
            }`}
          >
            {message.type === "success" ? <CheckCircle className="w-5 h-5 shrink-0" /> : <ShieldCheck className="w-5 h-5 shrink-0" />}
            <p className="text-[13px] font-bold leading-relaxed">{message.text}</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
