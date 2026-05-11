"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";

export default function ShippingPolicy() {
  const sections = [
    {
      title: "1. Order Processing",
      content: "All orders are processed within 2-3 business days. Orders are not shipped or delivered on weekends or holidays. If we are experiencing a high volume of orders, shipments may be delayed by a few days."
    },
    {
      title: "2. Shipping Rates & Delivery Estimates",
      content: "Shipping charges for your order will be calculated and displayed at checkout. Standard delivery typically takes 5-7 business days across India. Express shipping is available for select locations."
    },
    {
      title: "3. Shipment Confirmation & Order Tracking",
      content: "You will receive a Shipment Confirmation email once your order has shipped containing your tracking number(s). The tracking number will be active within 24 hours."
    },
    {
      title: "4. Customs, Duties, and Taxes",
      content: "Kanpur Shoes Wala is not responsible for any customs and taxes applied to your order. All fees imposed during or after shipping are the responsibility of the customer (tariffs, taxes, etc.)."
    },
    {
      title: "5. Damages",
      content: "If you received your order damaged, please contact the shipment carrier to file a claim. Please save all packaging materials and damaged goods before filing a claim."
    }
  ];

  return (
    <main className="min-h-screen bg-white text-[#111] font-inter">
      <Navbar onCartClick={() => {}} onAuthClick={() => {}} />

      <section className="pt-[140px] pb-24">
        <div className="max-w-[800px] mx-auto px-5">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16"
          >
            <h1 className="text-[2.5rem] font-black tracking-tight mb-4">Shipping Policy</h1>
            <p className="text-[14px] text-[#999] font-medium uppercase tracking-widest">Last Updated: May 2026</p>
          </motion.div>

          <div className="space-y-12">
            {sections.map((section, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <h2 className="text-[18px] font-black tracking-tight mb-4">{section.title}</h2>
                <p className="text-[15px] text-[#666] leading-relaxed">{section.content}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-[#efefef] bg-white py-12 text-center">
        <p className="text-[11px] text-[#aaa] font-medium uppercase tracking-widest">
          © 2026 Kanpur Shoes Wala.
        </p>
      </footer>
    </main>
  );
}
