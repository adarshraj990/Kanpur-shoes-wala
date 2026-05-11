"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, Loader2, ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          }
        });
        if (error) throw error;
        alert("Check your email for confirmation!");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      onClose();
    } catch (err: any) {
      console.error("Supabase Auth Error:", err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/25 backdrop-blur-sm z-[100]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 10 }}
            transition={{ type: "spring", damping: 30, stiffness: 400 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[420px] bg-white p-10 rounded-[32px] shadow-2xl z-[110] border border-[#f0f0f0]"
          >
            {/* Logo area - Simplified for safety */}
            <div className="flex flex-col items-center mb-12">
              <div className="text-center">
                <div className="text-[18px] font-black tracking-tighter text-[#111] uppercase leading-snug">
                  Kanpur Shoes
                </div>
                <div className="text-[9px] font-bold tracking-[0.4em] text-[#999] uppercase mt-0.5">
                  Wala
                </div>
              </div>
              <div className="h-1 w-8 bg-black rounded-full mt-5" />
            </div>

            {/* Header - No overlapping possible here */}
            <div className="text-center mb-10">
              <h2 className="text-[24px] font-black tracking-tight text-black mb-3 block">
                {isSignUp ? "Create an account" : "Welcome back"}
              </h2>
              <p className="text-[14px] text-[#888] font-medium block">
                {isSignUp ? "Join our community of shoe enthusiasts." : "Sign in to continue your journey."}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleAuth} className="space-y-6">
              <div className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#bbb]" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-[#f9f9f9] border border-transparent rounded-[18px] focus:bg-white focus:border-[#eee] transition-all text-[14px] text-black placeholder:text-[#bbb] outline-none"
                    placeholder="Email address"
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#bbb]" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-[#f9f9f9] border border-transparent rounded-[18px] focus:bg-white focus:border-[#eee] transition-all text-[14px] text-black placeholder:text-[#bbb] outline-none"
                    placeholder="Password"
                  />
                </div>
              </div>

              {!isSignUp && (
                <div className="flex justify-end pt-1">
                  <a
                    href="/forgot-password"
                    className="text-[11px] font-bold text-[#aaa] hover:text-black transition-colors uppercase tracking-widest"
                    onClick={onClose}
                  >
                    Forgot Password?
                  </a>
                </div>
              )}

              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-[12px] font-bold bg-red-50 px-4 py-3 rounded-xl border border-red-100"
                >
                  {error}
                </motion.div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-black text-white rounded-[20px] font-bold text-[14px] tracking-tight hover:bg-zinc-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-black/5"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    {isSignUp ? "Create account" : "Sign in"}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-10 pt-8 border-t border-[#f0f0f0] text-center">
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-[13px] text-[#999] hover:text-black transition-colors"
              >
                {isSignUp ? "Already a member? " : "New to the family? "}
                <span className="font-bold text-black hover:underline underline-offset-4">
                  {isSignUp ? "Sign In" : "Join Now"}
                </span>
              </button>
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-8 right-8 p-2 text-[#ccc] hover:text-black hover:bg-[#f7f7f7] rounded-full transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
