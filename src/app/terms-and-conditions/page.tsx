"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";

export default function TermsAndConditions() {
  const sections = [
    {
      title: "1. Agreement to Terms",
      content: "By accessing or using the Kanpur Shoes Wala website, you agree to be bound by these Terms and Conditions and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site."
    },
    {
      title: "2. Use License",
      content: "Permission is granted to temporarily download one copy of the materials (information or software) on KSW's website for personal, non-commercial transitory viewing only."
    },
    {
      title: "3. Product Accuracy",
      content: "We strive to display our products as accurately as possible. However, we do not warrant that product descriptions or other content are accurate, complete, reliable, current, or error-free. Colors may vary depending on your monitor settings."
    },
    {
      title: "4. Pricing and Availability",
      content: "All prices are subject to change without notice. We reserve the right to modify or discontinue any product at any time. We are not liable for any price changes or product discontinuations."
    },
    {
      title: "5. Limitations of Liability",
      content: "In no event shall Kanpur Shoes Wala or its suppliers be liable for any damages arising out of the use or inability to use the materials on our website, even if we have been notified of the possibility of such damage."
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
            <h1 className="text-[2.5rem] font-black tracking-tight mb-4">Terms & Conditions</h1>
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

          <div className="mt-20 pt-12 border-t border-[#efefef]">
            <p className="text-[14px] text-[#999]">
              By continuing to use our site, you acknowledge that you have read and understood these terms.
            </p>
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
