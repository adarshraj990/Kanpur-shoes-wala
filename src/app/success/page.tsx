/* MASTER_LOG - APRIL 27, 2026 
- Project Status: Payment Gateway Implementation.
- Last Action: Created beautiful Order Success page.
- Pending Tasks: Add Order Tracking functionality.
*/

"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, ArrowRight, ShoppingBag, Truck } from "lucide-react";
import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 sm:p-10">
      <div className="max-w-md w-full text-center space-y-10">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", damping: 12, stiffness: 200 }}
          className="w-24 h-24 bg-green-50 text-green-600 rounded-[2.5rem] flex items-center justify-center mx-auto"
        >
          <CheckCircle className="w-12 h-12" />
        </motion.div>

        <div className="space-y-4">
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-bold tracking-tighter text-zinc-900"
          >
            Order Successful!
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-zinc-500 leading-relaxed"
          >
            Thank you for shopping with Kanpur Shoes Wala. We've received your order and are preparing it for shipment.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 gap-4 pt-4">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="p-6 bg-zinc-50 rounded-3xl flex items-center gap-4 text-left border border-zinc-100"
          >
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
              <Truck className="w-5 h-5 text-zinc-900" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">Delivery Status</p>
              <h4 className="font-bold text-sm">Dispatched within 24hrs</h4>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="pt-6"
        >
          <Link 
            href="/"
            className="group w-full py-5 bg-zinc-900 text-white rounded-full font-bold flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-200"
          >
            <ShoppingBag className="w-5 h-5" />
            Continue Shopping
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
