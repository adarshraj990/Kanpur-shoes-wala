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
    <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center p-6 sm:p-10">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-[#111] p-10 sm:p-12 rounded-[3rem] border border-[#1A1A1A] shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden"
      >
        {/* Glow effect */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#FF4F00]/10 blur-[80px] rounded-full" />
        
        <div className="relative space-y-8">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 bg-[#FF4F00]/10 rounded-2xl flex items-center justify-center border border-[#FF4F00]/20">
              <ShieldCheck className="w-8 h-8 text-[#FF4F00]" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight leading-tight">Secure Your<br /><span className="text-[#FF4F00]">Account</span></h1>
              <p className="text-zinc-500 text-sm mt-3 font-medium">Define a new premium password below.</p>
            </div>
          </div>

          <form onSubmit={handleUpdatePassword} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">New Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600 group-focus-within:text-[#FF4F00] transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl focus:outline-none focus:border-[#FF4F00] transition-all font-bold text-white placeholder:text-zinc-800"
                  placeholder="••••••••"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">Confirm Identity</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600 group-focus-within:text-[#FF4F00] transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-12 pr-6 py-4 bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl focus:outline-none focus:border-[#FF4F00] transition-all font-bold text-white placeholder:text-zinc-800"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-[#FF4F00] text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-[#E64600] transition-all shadow-[0_15px_30px_rgba(255,79,0,0.2)] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Zap className="w-4 h-4 fill-white" /> Update Password</>}
            </button>
          </form>

          {message && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-5 rounded-2xl flex items-start gap-4 border ${
                message.type === "success" 
                ? "bg-green-500/5 border-green-500/20 text-green-400" 
                : "bg-red-500/5 border-red-500/20 text-red-400"
              }`}
            >
              {message.type === "success" ? <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" /> : <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5" />}
              <p className="text-sm font-bold leading-relaxed">{message.text}</p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
