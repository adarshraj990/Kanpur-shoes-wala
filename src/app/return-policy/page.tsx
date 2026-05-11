"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";

export default function ReturnPolicy() {
  const sections = [
    {
      title: "1. Return Eligibility",
      content: "We offer a 30-day return policy. To be eligible for a return, your item must be in the same condition that you received it, unworn or unused, with tags, and in its original packaging. You'll also need the receipt or proof of purchase."
    },
    {
      title: "2. Return Process",
      content: "To start a return, you can contact us at returns@ksw.in. If your return is accepted, we'll send you a return shipping label, as well as instructions on how and where to send your package. Items sent back to us without first requesting a return will not be accepted."
    },
    {
      title: "3. Exchanges",
      content: "The fastest way to ensure you get what you want is to return the item you have, and once the return is accepted, make a separate purchase for the new item."
    },
    {
      title: "4. Refunds",
      content: "We will notify you once we've received and inspected your return, and let you know if the refund was approved or not. If approved, you'll be automatically refunded on your original payment method within 10 business days."
    },
    {
      title: "5. Non-returnable items",
      content: "Certain types of items cannot be returned, like custom products (such as special orders or personalized items). Please get in touch if you have questions or concerns about your specific item."
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
            <h1 className="text-[2.5rem] font-black tracking-tight mb-4">Return Policy</h1>
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
