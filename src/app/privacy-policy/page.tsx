"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";

export default function PrivacyPolicy() {
  const sections = [
    {
      title: "1. Information We Collect",
      content: "We collect information you provide directly to us, such as when you create an account, make a purchase, or contact our support team. This may include your name, email address, phone number, shipping address, and payment information."
    },
    {
      title: "2. How We Use Your Information",
      content: "We use the information we collect to process your orders, communicate with you about products and promotions, improve our services, and protect against fraudulent transactions."
    },
    {
      title: "3. Information Sharing",
      content: "We do not sell your personal information to third parties. We may share your information with service providers who perform services on our behalf, such as shipping companies and payment processors."
    },
    {
      title: "4. Data Security",
      content: "We implement appropriate technical and organizational measures to protect the security of your personal information. However, please note that no method of transmission over the internet is 100% secure."
    },
    {
      title: "5. Your Choices",
      content: "You can access and update your account information at any time by logging into your account. You may also opt-out of receiving promotional communications from us by following the instructions in those communications."
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
            <h1 className="text-[2.5rem] font-black tracking-tight mb-4">Privacy Policy</h1>
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
              If you have any questions about this Privacy Policy, please contact us at <span className="text-black font-bold">hello@ksw.in</span>.
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
