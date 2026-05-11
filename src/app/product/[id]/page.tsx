"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag, ShieldCheck, Truck, RotateCcw,
  ChevronRight, ChevronLeft, Star, Heart, Share2, Check
} from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import AuthModal from "@/components/AuthModal";
import ReviewSection from "@/components/ReviewSection";
import SuggestedProducts from "@/components/SuggestedProducts";

const DETAIL_TABS = ["Description", "Details", "Reviews", "Shipping & Returns"];

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const [shoe, setShoe] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [sizeError, setSizeError] = useState(false);
  const [wishlist, setWishlist] = useState(false);
  const [activeTab, setActiveTab] = useState("Description");
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    const fetchShoe = async () => {
      try {
        const { data, error } = await supabase
          .from("shoes")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        setShoe(data);
      } catch (err) {
        console.error("Error fetching product:", err);
        router.push("/");
      } finally {
        setLoading(false);
      }
    };

    fetchShoe();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-8 h-8 bg-black animate-pulse rounded-sm" />
      </div>
    );
  }

  if (!shoe) return null;

  const gallery = shoe.image_urls && shoe.image_urls.length > 0
    ? shoe.image_urls
    : [shoe.image_url];

  const availableSizes = shoe.sizes && shoe.sizes.length > 0
    ? shoe.sizes
    : ["6", "7", "8", "9", "10", "11"];

  // Static display rating
  const rating = 4.2;
  const reviewCount = 42;

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError(true);
      setTimeout(() => setSizeError(false), 2000);
      return;
    }
    addToCart({ ...shoe, selectedSize });
    setAddedToCart(true);
    setIsCartOpen(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <main className="min-h-screen bg-white text-black selection:bg-black selection:text-white">
      <Navbar onCartClick={() => setIsCartOpen(true)} onAuthClick={() => setIsAuthOpen(true)} />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

      <div className="pt-[100px] md:pt-[116px] pb-20 px-5 sm:px-10 max-w-[1400px] mx-auto">

        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-[11px] font-medium text-[#999] mb-10">
          <Link href="/" className="hover:text-black transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <a href="#gallery" className="hover:text-black transition-colors">Shoes</a>
          <ChevronRight className="w-3 h-3" />
          {shoe.category && (
            <>
              <span className="hover:text-black transition-colors cursor-pointer">{shoe.category}</span>
              <ChevronRight className="w-3 h-3" />
            </>
          )}
          <span className="text-black font-semibold truncate max-w-[180px]">{shoe.name}</span>
        </nav>

        {/* Main product layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 mb-16">

          {/* ── LEFT: Image Gallery ── */}
          <div className="lg:col-span-7 space-y-4">

            {/* Main image */}
            <div className="relative aspect-[4/5] bg-[#f7f7f7] rounded-[20px] overflow-hidden group">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImage}
                  src={gallery[activeImage]}
                  alt={shoe.name}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>

              {/* Nav arrows */}
              {gallery.length > 1 && (
                <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setActiveImage((prev) => (prev > 0 ? prev - 1 : gallery.length - 1))}
                    className="p-3 bg-white rounded-full shadow-md hover:shadow-lg transition-all"
                  >
                    <ChevronLeft className="w-5 h-5 text-black" />
                  </button>
                  <button
                    onClick={() => setActiveImage((prev) => (prev < gallery.length - 1 ? prev + 1 : 0))}
                    className="p-3 bg-white rounded-full shadow-md hover:shadow-lg transition-all"
                  >
                    <ChevronRight className="w-5 h-5 text-black" />
                  </button>
                </div>
              )}

              {/* Wishlist overlay */}
              <button
                onClick={() => setWishlist(!wishlist)}
                className="absolute top-4 right-4 p-2.5 bg-white rounded-full shadow-sm hover:shadow-md transition-all"
              >
                <Heart className={`w-4 h-4 ${wishlist ? "fill-red-500 text-red-500" : "text-[#999]"}`} />
              </button>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-3 overflow-x-auto no-scrollbar">
              {gallery.map((url: string, i: number) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`relative w-[72px] aspect-square rounded-[12px] overflow-hidden bg-[#f7f7f7] border-2 transition-all shrink-0 ${
                    activeImage === i ? "border-black" : "border-transparent hover:border-[#ccc]"
                  }`}
                >
                  <img src={url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
              {gallery.length > 4 && (
                <div className="relative w-[72px] aspect-square rounded-[12px] overflow-hidden bg-[#f7f7f7] border-2 border-transparent shrink-0 flex items-center justify-center">
                  <span className="text-[11px] font-bold text-[#555]">+{gallery.length - 4}</span>
                </div>
              )}
            </div>

            {/* Tabs */}
            <div className="border-t border-[#efefef] pt-8 mt-8">
              <div className="flex gap-6 mb-6 border-b border-[#efefef]">
                {DETAIL_TABS.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-3 text-[12px] font-bold uppercase tracking-wider transition-all ${
                      activeTab === tab
                        ? "text-black border-b-2 border-black -mb-px"
                        : "text-[#999] hover:text-black"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <div className="text-[13px] text-[#666] leading-relaxed">
                {activeTab === "Description" && (
                  <div className="space-y-4">
                    <p>{shoe.description}</p>
                    {shoe.detailed_description && <p>{shoe.detailed_description}</p>}
                    <ul className="space-y-2 mt-4">
                      {[
                        "Premium quality upper material for lightweight support",
                        "Cushioned insole for all-day comfort",
                        "Rubber outsole for superior traction",
                        "Handcrafted in Kanpur with genuine leather",
                      ].map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <span className="mt-1.5 w-3 h-3 rounded-full bg-[#111] shrink-0 flex items-center justify-center">
                            <Check className="w-2 h-2 text-white" strokeWidth={3} />
                          </span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {activeTab === "Details" && (
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      ["Material", "Premium Leather"],
                      ["Origin", "Kanpur, India"],
                      ["Sole", "Rubber Composite"],
                      ["Closure", "Lace-up"],
                      ["Lining", "Textile"],
                      ["Weight", "~320g per pair"],
                    ].map(([k, v]) => (
                      <div key={k} className="flex flex-col gap-1 bg-[#f7f7f7] p-4 rounded-xl">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#999]">{k}</span>
                        <span className="text-[13px] font-semibold text-black">{v}</span>
                      </div>
                    ))}
                  </div>
                )}
                {activeTab === "Reviews" && (
                  <p className="text-[#999]">See the reviews section below.</p>
                )}
                {activeTab === "Shipping & Returns" && (
                  <div className="space-y-3">
                    <p>Free delivery on orders over ₹500. Standard delivery in 3–5 business days.</p>
                    <p>Easy 30-day returns. Items must be unworn and in original condition.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── RIGHT: Product Info ── */}
          <div className="lg:col-span-5 flex flex-col space-y-7 lg:pt-2">

            {/* Brand & title */}
            <div className="space-y-3">
              {shoe.category && (
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#999]">{shoe.category}</span>
                </div>
              )}
              <h1 className="text-[32px] sm:text-[38px] font-black tracking-tight leading-[1.05] text-black">
                {shoe.name}
              </h1>
              <p className="text-[13px] text-[#777] font-medium">
                Model: {shoe.category || "Premium Footwear"} — Kanpur Edition
              </p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-4 h-4 ${rating >= s ? "star-filled" : rating > s - 1 ? "star-filled opacity-50" : "star-empty"}`}
                  />
                ))}
              </div>
              <span className="text-[13px] font-bold text-black">{rating}</span>
              <span className="text-[12px] text-[#999] underline underline-offset-2 cursor-pointer hover:text-black">
                {reviewCount} reviews
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-[32px] font-black text-black">₹{shoe.price.toLocaleString()}</span>
              <span className="text-[14px] text-[#999] line-through">₹{Math.round(shoe.price * 1.2).toLocaleString()}</span>
              <span className="text-[11px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Save 17%</span>
            </div>

            {/* Free delivery note */}
            <div className="flex items-center gap-2 text-[12px] text-[#555]">
              <Truck className="w-4 h-4 text-[#111]" strokeWidth={1.75} />
              <span>Free delivery on orders over ₹500</span>
            </div>

            <div className="ksw-divider" />

            <div className="ksw-divider" />

            {/* Size selection */}
            <motion.div
              animate={sizeError ? { x: [-8, 8, -8, 8, 0] } : {}}
              transition={{ duration: 0.35 }}
              className={`space-y-3 p-5 rounded-[16px] transition-colors ${
                sizeError ? "bg-red-50 border border-red-200" : "bg-[#f7f7f7] border border-transparent"
              }`}
            >
              <div className="flex justify-between items-center">
                <span className={`text-[11px] font-bold uppercase tracking-wider ${sizeError ? "text-red-500" : "text-[#111]"}`}>
                  {sizeError ? "Please Select a Size" : "Size (UK)"}
                </span>
                <button className="text-[10px] font-bold text-[#555] underline underline-offset-2 hover:text-black transition-colors uppercase tracking-wider">
                  Size Guide
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {availableSizes.map((size: string) => (
                  <button
                    key={size}
                    onClick={() => { setSelectedSize(size); setSizeError(false); }}
                    className={`size-box ${selectedSize === size ? "active" : ""}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Add to cart + wishlist */}
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                className={`flex-1 btn-pill flex items-center justify-center gap-2.5 py-4 ${
                  addedToCart
                    ? "bg-green-600 text-white"
                    : sizeError
                    ? "bg-red-500 text-white"
                    : "btn-pill-dark"
                }`}
              >
                {addedToCart ? (
                  <><Check className="w-4 h-4" /> Added!</>
                ) : (
                  <><ShoppingBag className="w-4 h-4" /> Add to Cart</>
                )}
              </button>
              <button
                onClick={() => setWishlist(!wishlist)}
                className={`p-4 rounded-full border-2 transition-all ${
                  wishlist
                    ? "border-red-300 text-red-500 bg-red-50"
                    : "border-[#e5e5e5] text-[#999] hover:border-black hover:text-black"
                }`}
              >
                <Heart className={`w-5 h-5 ${wishlist ? "fill-red-500" : ""}`} />
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              {[
                { icon: Truck, label: "Free Shipping" },
                { icon: RotateCcw, label: "7 Days Return" },
                { icon: ShieldCheck, label: "Authentic" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-2 p-4 bg-[#f7f7f7] rounded-[14px] text-center">
                  <Icon className="w-4 h-4 text-black" strokeWidth={1.75} />
                  <span className="text-[9px] font-bold uppercase tracking-wider text-[#555]">{label}</span>
                </div>
              ))}
            </div>

            {/* Share */}
            <button className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#999] hover:text-black transition-colors pt-1">
              <Share2 className="w-3.5 h-3.5" />
              Share this product
            </button>
          </div>
        </div>

        {/* Reviews Section */}
        <ReviewSection productId={id as string} />

        {/* Suggested Products */}
        <SuggestedProducts currentId={id as string} category={shoe.category} />
      </div>
    </main>
  );
}
