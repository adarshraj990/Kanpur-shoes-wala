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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#050505]/80 backdrop-blur-md z-[100]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-[#0a0a0a] border border-white/10 p-8 sm:p-10 rounded-[2rem] shadow-[0_0_50px_rgba(0,0,0,0.8)] z-[110]"
          >
            <div className="flex justify-between items-center mb-10">
              <div>
                <h2 className="text-2xl font-black uppercase tracking-tighter text-white">
                  {isSignUp ? "Create Account" : "Access Account"}
                </h2>
                <p className="text-[#FDE68A] text-xs font-bold uppercase tracking-[0.2em] mt-2">
                  {isSignUp ? "Join the Atelier." : "Welcome back."}
                </p>
              </div>
              <button onClick={onClose} className="p-2 text-zinc-500 hover:text-white hover:bg-white/10 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAuth} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-8 pr-4 py-3 bg-transparent border-b-2 border-white/10 focus:outline-none focus:border-[#FDE68A] transition-all font-bold text-sm text-white placeholder:text-zinc-600 placeholder:font-medium"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Password</label>
                <div className="relative">
                  <Lock className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-8 pr-4 py-3 bg-transparent border-b-2 border-white/10 focus:outline-none focus:border-[#FDE68A] transition-all font-bold text-sm text-white placeholder:text-zinc-600 placeholder:font-medium"
                    placeholder="••••••••"
                  />
                </div>
                {!isSignUp && (
                  <div className="flex justify-end pt-2">
                    <a 
                      href="/forgot-password" 
                      className="text-[9px] font-bold text-zinc-500 hover:text-[#FDE68A] transition-colors uppercase tracking-[0.2em]"
                      onClick={onClose}
                    >
                      Forgot Password?
                    </a>
                  </div>
                )}
              </div>

              {error && (
                <p className="text-red-400 text-xs font-bold uppercase tracking-widest">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 mt-4 bg-[#FDE68A] text-black rounded-full font-bold text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-[#D97706] hover:scale-[1.02] transition-all disabled:opacity-50 shadow-[0_0_15px_rgba(253,230,138,0.2)]"
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

            <div className="mt-8 pt-6 border-t border-white/5 text-center">
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em] hover:text-[#FDE68A] transition-colors"
              >
                {isSignUp ? "Already a member? Sign In" : "New here? Create Account"}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
