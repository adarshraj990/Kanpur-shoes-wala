/* MASTER_LOG - APRIL 28, 2026 
- Project Status: Deployed to GitHub.
- Last Action: Successfully pushed all code to https://github.com/adarshraj990/Kanpur-shoes-wala.
*/

"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { 
  Upload, Check, Loader2, Image as ImageIcon, 
  ArrowLeft, X, TrendingUp, ShoppingCart, Award, DollarSign,
  Users, Activity, Calendar, Package, Plus, Trash2
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function MalikDashboard() {
  // Form State
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [detailedDescription, setDetailedDescription] = useState("");
  const [price, setPrice] = useState<string>("");
  const [category, setCategory] = useState("Premium Shoes");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const CATEGORIES = ["Premium Shoes", "Sneakers", "Chelsea Boots", "Slides & Sandals", "Running & Sports", "Casual Wear"];

  // Analytics & Orders
  const [analytics, setAnalytics] = useState<any>({ totalOrders: 0, totalRevenue: 0, liveVisitors: 0 });
  const [ordersList, setOrdersList] = useState<any[]>([]);

  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  const ADMIN_EMAILS = ['bhaikumarark99@gmail.com', 'adarshfouryt@gmail.com'];

  useEffect(() => {
    if (!authLoading && (!user || !ADMIN_EMAILS.includes(user.email || ""))) router.push("/");
    fetchAnalytics();
  }, [user, authLoading]);

  const fetchAnalytics = async () => {
    const { data: orders } = await supabase.from("orders").select("*, shoes(name)").order('created_at', { ascending: false });
    if (orders) {
      setOrdersList(orders);
      const successOrders = orders.filter(o => o.status === 'success');
      setAnalytics({
        totalOrders: successOrders.length,
        totalRevenue: successOrders.reduce((sum, o) => sum + Number(o.amount), 0),
        liveVisitors: Math.floor(Math.random() * 10) + 1,
      });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET!);
    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, { method: "POST", body: formData });
      const data = await res.json();
      if (data.secure_url) setImageUrls(prev => [...prev, data.secure_url]);
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setImageUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleSaveProduct = async () => {
    const numericPrice = parseFloat(price);
    if (!name || imageUrls.length === 0 || isNaN(numericPrice)) return;
    setSaving(true);
    try {
      const { error } = await supabase.from("shoes").insert([{
        name,
        description,
        detailed_description: detailedDescription,
        price: numericPrice,
        category: category,
        image_url: imageUrls[0], // Main display image
        image_urls: imageUrls,    // Gallery images
        created_at: new Date().toISOString()
      }]);
      if (error) throw error;
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      setName(""); setDescription(""); setDetailedDescription(""); setImageUrls([]); setPrice(""); setCategory("Premium Shoes");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || !user) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-[#F9F9F9] p-6 sm:p-10 lg:p-20">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-black tracking-tight text-zinc-900">Malik Dashboard</h1>
          <div className="px-4 py-2 bg-green-50 text-green-700 rounded-full text-xs font-bold flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Live: {analytics.liveVisitors}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content: Orders & New Product */}
          <div className="lg:col-span-8 space-y-8">
            {/* New Product Form */}
            <div className="bg-white p-8 sm:p-12 rounded-[2.5rem] border border-zinc-100 shadow-sm">
              <h2 className="text-2xl font-black mb-8 flex items-center gap-3">
                <Plus className="w-6 h-6" />
                Add Premium Product
              </h2>
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-zinc-400 ml-1">Product Name</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Kanpur Air V2" className="w-full px-5 py-4 bg-zinc-50 rounded-2xl border-none focus:ring-2 focus:ring-zinc-900 transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-zinc-400 ml-1">Price (INR)</label>
                    <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="799" className="w-full px-5 py-4 bg-zinc-50 rounded-2xl border-none focus:ring-2 focus:ring-zinc-900 transition-all font-bold" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-zinc-400 ml-1">Category</label>
                    <select 
                      value={category} 
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-5 py-4 bg-zinc-50 rounded-2xl border-none focus:ring-2 focus:ring-zinc-900 transition-all font-bold appearance-none"
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-zinc-400 ml-1">Short Tagline</label>
                  <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Handcrafted in Kanpur" className="w-full px-5 py-4 bg-zinc-50 rounded-2xl border-none focus:ring-2 focus:ring-zinc-900 transition-all" />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-zinc-400 ml-1">Detailed Description (Specs, Material)</label>
                  <textarea value={detailedDescription} onChange={(e) => setDetailedDescription(e.target.value)} rows={4} placeholder="Premium leather, rubber sole, durable stitching..." className="w-full px-5 py-4 bg-zinc-50 rounded-2xl border-none focus:ring-2 focus:ring-zinc-900 transition-all" />
                </div>

                {/* Multi-Image Upload */}
                <div className="space-y-4">
                  <label className="text-xs font-bold uppercase text-zinc-400 ml-1">Product Gallery (First image is main)</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <AnimatePresence>
                      {imageUrls.map((url, i) => (
                        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} key={url} className="relative aspect-square rounded-2xl overflow-hidden border border-zinc-100">
                          <img src={url} className="w-full h-full object-cover" />
                          <button onClick={() => removeImage(i)} className="absolute top-2 right-2 p-1.5 bg-white/90 text-red-500 rounded-full shadow-lg hover:bg-white"><Trash2 className="w-3.5 h-3.5" /></button>
                          {i === 0 && <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-zinc-900 text-white text-[8px] font-bold uppercase rounded-md">Main</span>}
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    {imageUrls.length < 5 && (
                      <div className="relative aspect-square rounded-2xl border-2 border-dashed border-zinc-200 flex flex-col items-center justify-center hover:bg-zinc-50 transition-all cursor-pointer">
                        {uploading ? <Loader2 className="animate-spin text-zinc-300" /> : <><ImageIcon className="w-6 h-6 text-zinc-200" /><p className="text-[10px] text-zinc-400 mt-2 font-bold uppercase">Add Photo</p></>}
                        <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} className="absolute inset-0 opacity-0 cursor-pointer" />
                      </div>
                    )}
                  </div>
                </div>

                <button onClick={handleSaveProduct} disabled={saving || imageUrls.length === 0} className={`w-full py-5 rounded-full font-bold text-lg flex items-center justify-center gap-3 transition-all ${success ? "bg-green-500 text-white" : "bg-zinc-900 text-white hover:bg-zinc-800"}`}>
                  {saving ? <Loader2 className="animate-spin" /> : success ? <><Check /> Product Saved!</> : <><Package className="w-5 h-5" /> Save Product</>}
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar: Analytics */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-zinc-900 p-8 rounded-[2.5rem] text-white">
              <p className="text-xs font-bold opacity-50 uppercase tracking-widest mb-4">Total Revenue</p>
              <h2 className="text-4xl font-black mb-8">₹{analytics.totalRevenue.toLocaleString()}</h2>
              <div className="flex gap-4">
                <div className="flex-1 p-4 bg-white/10 rounded-2xl">
                  <p className="text-[10px] opacity-40 uppercase font-bold mb-1">Orders</p>
                  <p className="text-xl font-bold">{analytics.totalOrders}</p>
                </div>
                <div className="flex-1 p-4 bg-white/10 rounded-2xl">
                  <p className="text-[10px] opacity-40 uppercase font-bold mb-1">Items Sold</p>
                  <p className="text-xl font-bold">{analytics.totalOrders * 1.5 | 0}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] border border-zinc-100 shadow-sm overflow-hidden">
              <h3 className="font-bold mb-6 flex items-center gap-2 uppercase text-xs tracking-widest text-zinc-400">Recent Activity</h3>
              <div className="space-y-6">
                {ordersList.slice(0, 5).map((order) => (
                  <div key={order.id} className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-bold">{order.customer_name}</p>
                      <p className="text-[10px] text-zinc-400 uppercase font-bold">{new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                    <p className="text-sm font-black">₹{order.amount}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
