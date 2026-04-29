"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { 
  Check, Loader2, Image as ImageIcon, 
  Trash2, Plus, Minus, Package, LayoutGrid,
  TrendingUp, ShoppingCart, DollarSign, Activity,
  Printer, Tag, FileText, User, MapPin, Phone,
  LogOut, BarChart3, ArrowUpRight, Search, 
  ChevronRight, Settings, Bell
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { jsPDF } from "jspdf";

const ADMIN_EMAILS = ["bhaikumarark99@gmail.com", "adarshfouryt@gmail.com"];
const CATEGORIES = ["Premium Shoes", "Sneakers", "Chelsea Boots", "Slides & Sandals", "Running & Sports", "Casual Wear"];

type Tab = "overview" | "products" | "inventory" | "orders" | "settings";

export default function MalikDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [loading, setLoading] = useState(true);
  
  // Product Form State
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [detailedDescription, setDetailedDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Premium Shoes");
  const [stock, setStock] = useState(10);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  // Data State
  const [shoesList, setShoesList] = useState<any[]>([]);
  const [ordersList, setOrdersList] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState({ 
    totalOrders: 0, 
    totalRevenue: 0, 
    totalProducts: 0,
    averageOrder: 0
  });
  
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const { user, loading: authLoading, signOut } = useAuth();
  const router = useRouter();

  const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  useEffect(() => {
    if (!authLoading) {
      if (!user || !ADMIN_EMAILS.includes(user.email || "")) {
        router.push("/");
      } else {
        refreshData();
      }
    }
  }, [user, authLoading]);

  const refreshData = async () => {
    setLoading(true);
    await Promise.all([fetchShoes(), fetchOrders()]);
    setLoading(false);
  };

  const fetchShoes = async () => {
    const { data } = await supabase.from("shoes").select("*").order("created_at", { ascending: false });
    if (data) setShoesList(data);
  };

  const fetchOrders = async () => {
    const { data: orders } = await supabase.from("orders").select("*, shoes(name)").order("created_at", { ascending: false });
    if (orders) {
      setOrdersList(orders);
      const successOrders = orders.filter(o => o.status === "success");
      const rev = successOrders.reduce((a, o) => a + Number(o.amount), 0);
      setAnalytics({
        totalOrders: successOrders.length,
        totalRevenue: rev,
        totalProducts: shoesList.length,
        averageOrder: successOrders.length > 0 ? rev / successOrders.length : 0
      });
    }
  };

  const handleUpdateStock = async (id: number, cur: number, delta: number) => {
    const ns = Math.max(0, cur + delta);
    await supabase.from("shoes").update({ stock: ns }).eq("id", id);
    setShoesList(p => p.map(s => s.id === id ? { ...s, stock: ns } : s));
  };

  const handleDeleteProduct = async (id: number) => {
    const { error } = await supabase.from("shoes").delete().eq("id", id);
    if (!error) {
      setShoesList(p => p.filter(s => s.id !== id));
      setDeleteId(null);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    try {
      const urls = await Promise.all(files.map(async f => {
        const fd = new FormData();
        fd.append("file", f);
        fd.append("upload_preset", UPLOAD_PRESET!);
        const r = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, { method: "POST", body: fd });
        const d = await r.json();
        return d.secure_url;
      }));
      setImageUrls(p => [...p, ...urls.filter(Boolean)]);
    } finally {
      setUploading(false);
    }
  };

  const handleSaveProduct = async () => {
    const np = parseFloat(price);
    if (!name || !imageUrls.length || isNaN(np)) return;
    setSaving(true);
    try {
      const { error } = await supabase.from("shoes").insert([{
        name, description, detailed_description: detailedDescription,
        price: np, category, stock, image_url: imageUrls[0], image_urls: imageUrls,
        created_at: new Date().toISOString()
      }]);
      if (error) throw error;
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      setName(""); setDescription(""); setDetailedDescription(""); setImageUrls([]); setPrice(""); setCategory("Premium Shoes"); setStock(10);
      fetchShoes();
    } finally {
      setSaving(false);
    }
  };

  const generateShippingLabel = (order: any) => {
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a6" });
    doc.setLineWidth(1); doc.rect(5, 5, 95, 138);
    doc.setFontSize(16); doc.setFont("helvetica", "bold");
    doc.text("KANPUR SHOES WALA", 52.5, 15, { align: "center" });
    doc.setLineWidth(0.5); doc.line(10, 20, 95, 20);
    doc.setFontSize(10); doc.text("SHIP TO:", 10, 30);
    doc.setFontSize(12); doc.text(order.customer_name?.toUpperCase() || "CUSTOMER", 10, 38);
    doc.setFontSize(9); doc.setFont("helvetica", "normal");
    const al = doc.splitTextToSize(`${order.address || ""}, ${order.city || ""} - ${order.pincode || ""}`, 80);
    doc.text(al, 10, 45);
    doc.setFont("helvetica", "bold"); doc.text(`PHONE: ${order.phone || "N/A"}`, 10, 45 + al.length * 5 + 5);
    doc.line(10, 80, 95, 80);
    doc.setFontSize(8); doc.text("SENDER: KANPUR SHOES WALA, CIVIL LINES, KANPUR (UP)", 10, 88);
    doc.setFontSize(14); doc.text(`ORDER ID: #${order.id.toString().slice(-6).toUpperCase()}`, 10, 110);
    doc.setFontSize(10); doc.text(`ITEM: ${order.shoes?.name || "PREMIUM SHOE"}`, 10, 120);
    doc.save(`label_${order.id}.pdf`);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center gap-6">
        <div className="w-16 h-16 rounded-2xl bg-[#FF4F00] flex items-center justify-center animate-pulse shadow-[0_0_40px_rgba(255,79,0,0.3)]">
          <Zap className="w-8 h-8 text-white fill-white" />
        </div>
        <div className="flex flex-col items-center gap-2">
          <p className="text-white font-black uppercase tracking-[0.3em] text-xs">Authenticating</p>
          <div className="w-32 h-1 bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              className="w-full h-full bg-[#FF4F00]" 
            />
          </div>
        </div>
      </div>
    );
  }

  const NAV: { id: Tab; label: string; icon: any }[] = [
    { id: "overview", label: "Insights", icon: BarChart3 },
    { id: "products", label: "Catalog", icon: Plus },
    { id: "inventory", label: "Inventory", icon: LayoutGrid },
    { id: "orders", label: "Logistics", icon: ShoppingCart },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex selection:bg-[#FF4F00]/30">
      
      {/* ─────────────────────── LUXURY SIDEBAR ─────────────────────── */}
      <aside className="hidden lg:flex flex-col w-72 border-r border-white/5 p-8 fixed h-full bg-[#0A0A0A]/80 backdrop-blur-3xl z-50">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#FF4F00] flex items-center justify-center shadow-lg shadow-orange-900/20">
              <Package className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-black tracking-tighter uppercase leading-none">Malik<br /><span className="text-[#FF4F00]">Panel.</span></h1>
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Active Admin</p>
            <p className="text-xs font-bold truncate text-zinc-300">{user?.email}</p>
          </div>
        </div>

        <nav className="flex flex-col gap-2 flex-1">
          {NAV.map(n => (
            <button 
              key={n.id} 
              onClick={() => setActiveTab(n.id)} 
              className={`flex items-center justify-between px-5 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-500 group ${
                activeTab === n.id 
                  ? "bg-[#FF4F00] text-white shadow-xl shadow-orange-900/20" 
                  : "text-zinc-500 hover:text-white hover:bg-white/5"
              }`}
            >
              <div className="flex items-center gap-4">
                <n.icon className={`w-4 h-4 ${activeTab === n.id ? "text-white" : "group-hover:text-[#FF4F00]"} transition-colors`} />
                {n.label}
              </div>
              {activeTab === n.id && <ChevronRight className="w-3 h-3" />}
            </button>
          ))}
        </nav>

        <div className="mt-auto space-y-4">
          <button onClick={refreshData} className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-[#FF4F00] hover:bg-orange-500/5 transition-all">
            <Activity className="w-4 h-4" /> Sync Data
          </button>
          <button onClick={signOut} className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-red-400 hover:bg-red-400/5 transition-all">
            <LogOut className="w-4 h-4" /> Terminate Session
          </button>
        </div>
      </aside>

      {/* ─────────────────────── MAIN CONTENT ─────────────────────── */}
      <main className="flex-1 lg:ml-72 p-6 lg:p-12">
        
        {/* Header Strip */}
        <header className="flex justify-between items-center mb-16">
          <div>
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#FF4F00] mb-2">Workspace / {activeTab}</h2>
            <h3 className="text-3xl font-black tracking-tighter text-white">
              {activeTab === "overview" && "Executive Insights"}
              {activeTab === "products" && "Curate Collection"}
              {activeTab === "inventory" && "Stock Matrix"}
              {activeTab === "orders" && "Global Logistics"}
            </h3>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-3 rounded-xl bg-white/5 border border-white/5 text-zinc-400 hover:text-white transition-all">
              <Bell className="w-5 h-5" />
            </button>
            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-[#FF4F00] to-orange-400 border-2 border-white/10 shadow-lg" />
          </div>
        </header>

        {/* TAB: OVERVIEW */}
        {activeTab === "overview" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
            
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: "Gross Revenue", value: `₹${analytics.totalRevenue.toLocaleString()}`, icon: DollarSign, color: "#FF4F00", trend: "+12.5%" },
                { label: "Successful Orders", value: analytics.totalOrders, icon: ShoppingCart, color: "#22C55E", trend: "+8.2%" },
                { label: "Active SKUs", value: shoesList.length, icon: Package, color: "#3B82F6", trend: "Stable" },
                { label: "Avg. Order Value", value: `₹${Math.round(analytics.averageOrder).toLocaleString()}`, icon: TrendingUp, color: "#A855F7", trend: "+4.1%" },
              ].map(s => (
                <div key={s.label} className="group relative bg-white/[0.02] border border-white/5 rounded-[2rem] p-8 hover:bg-white/[0.04] transition-all duration-500 overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <s.icon className="w-24 h-24" />
                  </div>
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-3 rounded-2xl bg-white/5 text-zinc-400">
                      <s.icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-black text-green-500 bg-green-500/10 px-2 py-1 rounded-lg">{s.trend}</span>
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-2">{s.label}</p>
                  <p className="text-4xl font-black tracking-tighter" style={{ color: s.color }}>{s.value}</p>
                </div>
              ))}
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-10">
                <div className="flex justify-between items-center mb-10">
                  <h4 className="text-sm font-black uppercase tracking-widest text-zinc-300">Logistics Velocity</h4>
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#FF4F00]" />
                    <div className="w-3 h-3 rounded-full bg-white/10" />
                  </div>
                </div>
                <div className="h-[240px] flex items-end gap-3 justify-between">
                  {[40, 70, 45, 90, 65, 80, 55, 95, 75, 60, 85, 100].map((h, i) => (
                    <motion.div 
                      key={i}
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ delay: i * 0.05, duration: 1 }}
                      className="flex-1 bg-gradient-to-t from-[#FF4F00]/20 to-[#FF4F00] rounded-t-lg relative group cursor-pointer"
                    >
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-black text-[9px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        {h}k
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-4 bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8">
                <h4 className="text-sm font-black uppercase tracking-widest text-zinc-300 mb-8">Recent Activity</h4>
                <div className="space-y-6">
                  {ordersList.slice(0, 5).map((o, i) => (
                    <div key={o.id} className="flex items-center gap-4 group">
                      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-[#FF4F00]/10 transition-colors">
                        <ShoppingCart className="w-5 h-5 text-zinc-500 group-hover:text-[#FF4F00]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-zinc-200 truncate">{o.customer_name || "New Client"}</p>
                        <p className="text-[10px] text-zinc-600 font-bold tracking-widest">#{o.id.toString().slice(-6).toUpperCase()}</p>
                      </div>
                      <p className="text-xs font-black text-[#FF4F00]">₹{o.amount}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB: PRODUCTS (CURATE) */}
        {activeTab === "products" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div className="space-y-6 bg-white/[0.02] border border-white/5 p-8 rounded-[2.5rem]">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Essential Data</h4>
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black uppercase tracking-widest text-zinc-600 ml-2">Shoe Name</label>
                      <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Kanpur Air Elite" className="w-full px-6 py-4 bg-white/5 border border-white/5 rounded-2xl text-sm font-bold focus:border-[#FF4F00] transition-all outline-none" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black uppercase tracking-widest text-zinc-600 ml-2">Market Price (₹)</label>
                        <input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="1499" className="w-full px-6 py-4 bg-white/5 border border-white/5 rounded-2xl text-sm font-black text-[#FF4F00] focus:border-[#FF4F00] transition-all outline-none" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black uppercase tracking-widest text-zinc-600 ml-2">Inventory Stock</label>
                        <input type="number" value={stock} onChange={e => setStock(parseInt(e.target.value))} className="w-full px-6 py-4 bg-white/5 border border-white/5 rounded-2xl text-sm font-bold focus:border-[#FF4F00] transition-all outline-none" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black uppercase tracking-widest text-zinc-600 ml-2">Collection Category</label>
                      <select value={category} onChange={e => setCategory(e.target.value)} className="w-full px-6 py-4 bg-white/5 border border-white/5 rounded-2xl text-sm font-bold focus:border-[#FF4F00] transition-all outline-none appearance-none">
                        {CATEGORIES.map(c => <option key={c} value={c} className="bg-zinc-900">{c}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-6 bg-white/[0.02] border border-white/5 p-8 rounded-[2.5rem]">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Narrative & Story</h4>
                  <div className="space-y-4">
                    <input value={description} onChange={e => setDescription(e.target.value)} placeholder="Short Tagline (e.g. Kanpur Heritage Leather)" className="w-full px-6 py-4 bg-white/5 border border-white/5 rounded-2xl text-xs font-medium focus:border-[#FF4F00] transition-all outline-none" />
                    <textarea value={detailedDescription} onChange={e => setDetailedDescription(e.target.value)} rows={4} placeholder="Full product story and materials detail..." className="w-full px-6 py-4 bg-white/5 border border-white/5 rounded-2xl text-xs font-medium leading-relaxed focus:border-[#FF4F00] transition-all outline-none resize-none" />
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[2.5rem] h-full flex flex-col">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-6">Gallery Asset Management</h4>
                  
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    {imageUrls.map((url, i) => (
                      <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} key={url} className="relative aspect-square rounded-[2rem] overflow-hidden border border-white/10 group">
                        <img src={url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        <button onClick={() => setImageUrls(p => p.filter((_, j) => j !== i))} className="absolute top-3 right-3 p-2 bg-black/60 backdrop-blur-md text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-lg">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </motion.div>
                    ))}
                    {imageUrls.length < 4 && (
                      <label className="relative aspect-square rounded-[2rem] border-2 border-dashed border-white/10 flex flex-col items-center justify-center hover:border-[#FF4F00] hover:bg-white/[0.02] cursor-pointer transition-all group">
                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#FF4F00]/20 transition-all">
                          {uploading ? <Loader2 className="animate-spin text-[#FF4F00]" /> : <ImageIcon className="w-6 h-6 text-zinc-600 group-hover:text-[#FF4F00]" />}
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 mt-4 group-hover:text-[#FF4F00]">Add Frame</span>
                        <input type="file" accept="image/*" multiple onChange={handleImageUpload} disabled={uploading} className="absolute inset-0 opacity-0 cursor-pointer" />
                      </label>
                    )}
                  </div>

                  <button 
                    onClick={handleSaveProduct} 
                    disabled={saving || !imageUrls.length || !name} 
                    className={`mt-auto w-full py-6 rounded-[2rem] font-black text-[12px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 transition-all duration-500 active:scale-95 disabled:opacity-30 ${
                      success 
                        ? "bg-green-500 text-white shadow-xl shadow-green-900/20" 
                        : "bg-[#FF4F00] text-white shadow-2xl shadow-orange-900/40 hover:bg-[#E64600]"
                    }`}
                  >
                    {saving ? <Loader2 className="animate-spin" /> : success ? <><Check className="w-5 h-5" /> In Catalog</> : <><Tag className="w-5 h-5" /> Deploy Product</>}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB: INVENTORY */}
        {activeTab === "inventory" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/[0.02] border border-white/5 rounded-[3rem] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.01]">
                    {["The Shoe", "Category", "Market Value", "Stock Matrix", "Control"].map(h => (
                      <th key={h} className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {shoesList.map(shoe => (
                    <tr key={shoe.id} className="group hover:bg-white/[0.02] transition-colors">
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-6">
                          <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white/5 border border-white/10 flex-shrink-0 group-hover:scale-110 transition-transform duration-500">
                            <img src={shoe.image_url} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <p className="font-black text-sm text-white tracking-tight">{shoe.name}</p>
                            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">ID: #{shoe.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400 bg-white/5 px-4 py-2 rounded-full border border-white/5">
                          {shoe.category}
                        </span>
                      </td>
                      <td className="px-10 py-8">
                        <p className="text-sm font-black text-[#FF4F00]">₹{shoe.price.toLocaleString()}</p>
                      </td>
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-4">
                          <button onClick={() => handleUpdateStock(shoe.id, shoe.stock, -1)} className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center hover:bg-[#FF4F00]/20 transition-all active:scale-90">
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className={`text-sm font-black w-10 text-center ${shoe.stock < 5 ? "text-red-500 animate-pulse" : "text-white"}`}>
                            {shoe.stock}
                          </span>
                          <button onClick={() => handleUpdateStock(shoe.id, shoe.stock, 1)} className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center hover:bg-green-500/20 transition-all active:scale-90">
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <button onClick={() => setDeleteId(shoe.id)} className="p-4 rounded-2xl text-zinc-600 hover:text-red-400 hover:bg-red-400/5 transition-all">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* TAB: ORDERS */}
        {activeTab === "orders" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/[0.02] border border-white/5 rounded-[3rem] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.01]">
                    {["Order Asset", "Recipient Detail", "Investment", "Logistic Status", "Terminal"].map(h => (
                      <th key={h} className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {ordersList.map(order => (
                    <tr key={order.id} className="group hover:bg-white/[0.02] transition-colors">
                      <td className="px-10 py-8">
                        <div>
                          <p className="text-sm font-black text-white tracking-tight">{order.shoes?.name || "Premium Item"}</p>
                          <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mt-1">Order #{order.id.toString().slice(-6).toUpperCase()}</p>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <User className="w-3 h-3 text-zinc-600" />
                            <p className="text-xs font-bold text-zinc-300">{order.customer_name}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3 h-3 text-zinc-600" />
                            <p className="text-[10px] text-zinc-500 font-medium">{order.city || "Kanpur"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-8 font-black text-sm text-[#FF4F00]">₹{order.amount.toLocaleString()}</td>
                      <td className="px-10 py-8">
                        <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                          order.status === "success" 
                            ? "bg-green-500/10 text-green-400 border-green-500/20" 
                            : "bg-orange-500/10 text-orange-400 border-orange-500/20"
                        }`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${order.status === "success" ? "bg-green-400" : "bg-orange-400"}`} />
                          {order.status}
                        </span>
                      </td>
                      <td className="px-10 py-8">
                        <button 
                          onClick={() => generateShippingLabel(order)} 
                          className="flex items-center gap-3 px-6 py-3 bg-[#FF4F00]/5 hover:bg-[#FF4F00] text-[#FF4F00] hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 shadow-lg shadow-orange-900/10 border border-orange-500/10"
                        >
                          <Printer className="w-4 h-4" /> Label
                        </button>
                      </td>
                    </tr>
                  ))}
                  {ordersList.length === 0 && (
                    <tr><td colSpan={5} className="py-32 text-center text-zinc-600 font-black uppercase tracking-[0.3em] text-xs">Awaiting Global Orders</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </main>

      {/* Luxury Delete Confirmation */}
      <AnimatePresence>
        {deleteId && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-xl flex items-center justify-center p-6">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-[#0D0D0D] border border-white/10 p-10 rounded-[3rem] max-w-sm w-full text-center shadow-2xl">
              <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
                <Trash2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black mb-4 tracking-tighter">Terminate Listing?</h3>
              <p className="text-zinc-500 text-sm leading-relaxed mb-10">This action is irreversible. The asset will be permanently removed from the Kanpur Shoes catalog.</p>
              <div className="flex gap-4">
                <button onClick={() => setDeleteId(null)} className="flex-1 py-5 bg-white/5 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all">Cancel</button>
                <button onClick={() => handleDeleteProduct(deleteId)} className="flex-1 py-5 bg-red-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-600 transition-all shadow-xl shadow-red-900/30">Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Simple Zap icon component since lucide-react Zap might be different or for consistent fill
function Zap({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
