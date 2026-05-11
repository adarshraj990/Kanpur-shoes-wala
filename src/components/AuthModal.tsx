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
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[400px] bg-white border border-[#e5e5e5] p-8 rounded-[24px] shadow-xl z-[110]"
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-[22px] font-black tracking-tight text-black">
                  {isSignUp ? "Create Account" : "Sign In"}
                </h2>
                <p className="text-[12px] text-[#999] mt-1">
                  {isSignUp ? "Join the KSW community." : "Welcome back."}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-[#999] hover:text-black hover:bg-[#f7f7f7] rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleAuth} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#999]">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#aaa]" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[#f7f7f7] border border-[#e5e5e5] rounded-[12px] focus:outline-none focus:border-black transition-all text-[13px] text-black placeholder:text-[#bbb]"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#999]">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#aaa]" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[#f7f7f7] border border-[#e5e5e5] rounded-[12px] focus:outline-none focus:border-black transition-all text-[13px] text-black placeholder:text-[#bbb]"
                    placeholder="••••••••"
                  />
                </div>
                {!isSignUp && (
                  <div className="flex justify-end">
                    <a
                      href="/forgot-password"
                      className="text-[11px] font-bold text-[#999] hover:text-black transition-colors underline underline-offset-2"
                      onClick={onClose}
                    >
                      Forgot Password?
                    </a>
                  </div>
                )}
              </div>

              {error && (
                <p className="text-red-500 text-[12px] font-medium bg-red-50 px-4 py-2.5 rounded-xl">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-pill btn-pill-dark py-4 flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    {isSignUp ? "Get Started" : "Sign In"}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-[#efefef] text-center">
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-[12px] text-[#777] hover:text-black transition-colors"
              >
                {isSignUp ? "Already have an account? " : "Don't have an account? "}
                <span className="font-bold underline underline-offset-2">
                  {isSignUp ? "Sign In" : "Create Account"}
                </span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
