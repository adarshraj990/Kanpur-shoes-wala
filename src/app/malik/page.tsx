"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { 
  Check, Loader2, Image as ImageIcon, 
  Trash2, Plus, Minus, Package, LayoutGrid,
  ShoppingCart, Printer, User, MapPin, Phone,
  LogOut, BarChart3, ShoppingBag
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { jsPDF } from "jspdf";
import Link from "next/link";

const ADMIN_EMAILS = ["adarshfouryt@gmail.com", "bhaikumarark99@gmail.com"];
const CATEGORIES = ["Premium Shoes", "Sneakers", "Chelsea Boots", "Slides & Sandals", "Running & Sports", "Casual Wear"];

type Tab = "overview" | "products" | "inventory" | "orders";

export default function MalikDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  
  // Form State
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
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const AVAILABLE_SIZES = ["6", "7", "8", "9", "10", "11"];

  // Management State
  const [shoesList, setShoesList] = useState<any[]>([]);
  const [loadingShoes, setLoadingShoes] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // Analytics & Orders
  const [analytics, setAnalytics] = useState({ totalOrders: 0, totalRevenue: 0, totalProducts: 0 });
  const [ordersList, setOrdersList] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  const { user, loading: authLoading, signOut } = useAuth();
  const router = useRouter();

  const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  useEffect(() => {
    if (!authLoading) {
      if (!user || !ADMIN_EMAILS.includes(user.email || "")) {
        router.push("/");
      } else {
        fetchAnalytics();
        fetchShoes();
      }
    }
  }, [user, authLoading]);

  const fetchShoes = async () => {
    setLoadingShoes(true);
    const { data } = await supabase.from("shoes").select("*").order("created_at", { ascending: false });
    if (data) setShoesList(data);
    setLoadingShoes(false);
  };

  const fetchAnalytics = async () => {
    setLoadingOrders(true);
    const { data: orders } = await supabase.from("orders").select("*, shoes(name)").order("created_at", { ascending: false });
    const { count } = await supabase.from("shoes").select("*", { count: "exact", head: true });
    
    if (orders) {
      setOrdersList(orders);
      const successfulOrders = orders.filter(o => o.status === "success");
      setAnalytics({
        totalOrders: successfulOrders.length,
        totalRevenue: successfulOrders.reduce((acc, o) => acc + Number(o.amount), 0),
        totalProducts: count || 0
      });
    }
    setLoadingOrders(false);
  };

  const handleUpdateStock = async (id: number, cur: number, delta: number) => {
    const ns = Math.max(0, cur + delta);
    const { error } = await supabase.from("shoes").update({ stock: ns }).eq("id", id);
    if (!error) {
      setShoesList(p => p.map(s => s.id === id ? { ...s, stock: ns } : s));
    }
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
        const data = await r.json();
        return data.secure_url;
      }));
      setImageUrls(p => [...p, ...urls.filter(Boolean)]);
    } catch (err) {
      console.error("Upload failed:", err);
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
        name, 
        description, 
        detailed_description: detailedDescription, 
        price: np, 
        category, 
        stock, 
        image_url: imageUrls[0], 
        image_urls: imageUrls, 
        sizes: selectedSizes, 
        created_at: new Date().toISOString() 
      }]);
      if (error) throw error;
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      setName(""); setDescription(""); setDetailedDescription(""); setImageUrls([]); setPrice(""); setCategory("Premium Shoes"); setStock(10); setSelectedSizes([]);
      fetchShoes();
      fetchAnalytics();
    } catch (e: any) {
      alert(e.message);
    } finally {
      setSaving(false);
    }
  };

  const generateShippingLabel = async (order: any) => {
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a6" });
    const m = 5, w = 95, h = 138;
    
    // Outer Border
    doc.setLineWidth(1.5);
    doc.rect(m, m, w, h);
    
    // Header
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("KANPUR SHOES WALA", 52.5, 15, { align: "center" });
    doc.setLineWidth(0.5);
    doc.line(m + 5, 18, 100, 18);
    
    // Recipient Section
    doc.setFontSize(10);
    doc.text("TO:", m + 5, 28);
    doc.setFontSize(12);
    doc.text(order.customer_name?.toUpperCase() || "N/A", m + 5, 35);
    
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    const addressLine = `${order.address || ""}, ${order.city || ""}, ${order.state || ""} - ${order.pincode || ""}`;
    const al = doc.splitTextToSize(addressLine, 75);
    doc.text(al, m + 5, 42);
    
    const phoneY = 42 + (al.length * 5);
    doc.setFont("helvetica", "bold");
    doc.text(`Ph: ${order.phone || "N/A"}`, m + 5, phoneY);
    
    // Divider
    doc.line(m + 2, 65, 100, 65);
    
    // Sender Section
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text("FROM: KANPUR SHOES WALA, Kanpur, UP - 208001", m + 5, 72);
    
    // Order info
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(`ORDER: #${order.id.toString().slice(-6).toUpperCase()}`, m + 5, 85);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(`Item: ${order.shoes?.name || "Premium Shoe"}`, m + 5, 92);
    doc.text(`Amount: ₹${order.amount}`, m + 5, 98);
    doc.text(`Date: ${new Date(order.created_at).toLocaleDateString()}`, m + 5, 104);

    // QR Code Implementation (Using public API)
    try {
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=KSW-ORDER-${order.id}`;
      doc.addImage(qrUrl, 'PNG', 65, 105, 25, 25);
      doc.setFontSize(7);
      doc.text("Scan to Verify", 77.5, 133, { align: "center" });
    } catch (e) {
      console.warn("QR Code failed to load");
    }

    // Barcode Simulation
    doc.setLineWidth(0.5);
    for (let i = 0; i < 40; i += 1.5) {
      const bh = Math.random() * 8 + 4;
      doc.line(m + 5 + i, 130, m + 5 + i, 130 - bh);
    }
    
    doc.save(`Label_${order.id.toString().slice(-6).toUpperCase()}.pdf`);
  };

  if (authLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A]">
      <Loader2 className="animate-spin text-white w-8 h-8" />
    </div>
  );

  const NAV: { id: Tab; label: string; icon: any }[] = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "products", label: "Add Product", icon: Plus },
    { id: "inventory", label: "Inventory", icon: LayoutGrid },
    { id: "orders", label: "Orders", icon: ShoppingBag },
  ];

  const handleShipOrder = async (order: any) => {
    if (!confirm(`Create shipment for ${order.customer_name} via NimbusPost?`)) return;
    
    try {
      const res = await fetch("/api/nimbus/ship", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order),
      });
      const data = await res.json();
      if (data.status) {
        alert("Shipment created successfully! AWB: " + (data.data?.awb_number || "Pending"));
        fetchAnalytics(); // Refresh
      } else {
        alert("Failed to create shipment: " + (data.message || "Unknown error"));
      }
    } catch (err) {
      alert("Error connecting to NimbusPost API");
    }
  };

  const inputCls = "w-full px-4 py-3.5 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-[#FF4F00] transition-colors";

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex font-inter selection:bg-white selection:text-black">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-[#1A1A1A] p-6 fixed top-0 left-0 bottom-0 z-50 bg-[#0A0A0A]">
        <div className="mb-10">
          <div className="w-10 h-10 rounded-xl bg-[#FF4F00] flex items-center justify-center mb-4">
            <Package className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-black tracking-tight leading-none uppercase">Malik Panel</h1>
          <p className="text-[10px] font-bold text-zinc-600 truncate mt-1.5 uppercase tracking-widest">{user?.email}</p>
        </div>
        
        <nav className="flex flex-col gap-1.5 flex-1">
          {NAV.map(n => (
            <button 
              key={n.id} 
              onClick={() => setActiveTab(n.id)} 
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all text-left ${
                activeTab === n.id ? "bg-[#FF4F00] text-white shadow-lg shadow-orange-900/20" : "text-zinc-500 hover:text-white hover:bg-[#1A1A1A]"
              }`}
            >
              <n.icon className="w-4 h-4 flex-shrink-0" />
              {n.label}
            </button>
          ))}
        </nav>

        <div className="pt-6 border-t border-[#1A1A1A]">
          <button 
            onClick={signOut} 
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-red-400 hover:bg-red-400/5 transition-all"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A] border-b border-[#1A1A1A] px-5 py-4 flex items-center justify-between">
        <span className="font-black text-sm uppercase tracking-tighter">Malik Panel</span>
        <div className="flex gap-1">
          {NAV.map(n => (
            <button 
              key={n.id} 
              onClick={() => setActiveTab(n.id)} 
              className={`p-2 rounded-lg transition-all ${activeTab === n.id ? "bg-[#FF4F00]" : "text-zinc-500"}`}
            >
              <n.icon className="w-4 h-4" />
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 w-full lg:ml-64 min-h-screen">
        <div className="p-6 lg:p-12 pt-24 lg:pt-12 max-w-[1200px] mx-auto">
          
          {/* OVERVIEW */}
          {activeTab === "overview" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#FF4F00] mb-2 block">Intelligence Dashboard</span>
                <h2 className="text-[3.5rem] font-black tracking-tighter leading-none">Business<br />Metrics</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: "Total Revenue", value: `₹${analytics.totalRevenue.toLocaleString()}`, sub: "Net earnings from success orders" },
                  { label: "Order Volume", value: analytics.totalOrders, sub: "Total successful conversions" },
                  { label: "Inventory Count", value: analytics.totalProducts, sub: "Unique product silhouettes" },
                ].map((s) => (
                  <div key={s.label} className="bg-[#111] border border-[#1A1A1A] rounded-[2rem] p-8 group hover:border-[#222] transition-colors">
                    <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-4">{s.label}</p>
                    <p className="text-4xl font-black mb-2 group-hover:text-[#FF4F00] transition-colors">{s.value}</p>
                    <p className="text-[10px] font-medium text-zinc-600">{s.sub}</p>
                  </div>
                ))}
              </div>

              <div className="bg-[#111] border border-[#1A1A1A] rounded-[2.5rem] p-8 md:p-10">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-black tracking-tight">Recent Activity</h3>
                  <button onClick={() => setActiveTab("orders")} className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">View All Logs</button>
                </div>
                <div className="space-y-4">
                  {ordersList.slice(0, 5).map(o => (
                    <div key={o.id} className="flex items-center justify-between p-4 bg-[#0D0D0D] border border-[#151515] rounded-2xl hover:border-[#222] transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-[#1A1A1A] rounded-xl flex items-center justify-center">
                          <ShoppingBag className="w-4 h-4 text-zinc-500" />
                        </div>
                        <div>
                          <p className="text-sm font-bold">{o.customer_name || "Guest Customer"}</p>
                          <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">#{o.id.toString().slice(-6).toUpperCase()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black text-[#FF4F00]">₹{o.amount}</p>
                        <span className={`text-[8px] font-black uppercase tracking-widest ${o.status === "success" ? "text-green-500" : "text-orange-500"}`}>{o.status}</span>
                      </div>
                    </div>
                  ))}
                  {ordersList.length === 0 && <p className="text-center py-10 text-zinc-600 text-sm">No recent transactions.</p>}
                </div>
              </div>
            </motion.div>
          )}

          {/* ADD PRODUCT */}
          {activeTab === "products" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl space-y-10">
              <div>
                <h2 className="text-4xl font-black tracking-tight">Add Product</h2>
                <p className="text-zinc-500 mt-2">Introduce a new silhouette to the Kanpur collection.</p>
              </div>

              <div className="bg-[#111] border border-[#1A1A1A] rounded-[2.5rem] p-10 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-zinc-600 ml-1">Product Name</label>
                    <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Classic Oxford" className={inputCls} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-zinc-600 ml-1">Price (INR)</label>
                    <input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="0.00" className={inputCls} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-zinc-600 ml-1">Category</label>
                    <select value={category} onChange={e => setCategory(e.target.value)} className={inputCls}>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-zinc-600 ml-1">Stock Units</label>
                    <input type="number" value={stock} onChange={e => setStock(parseInt(e.target.value))} className={inputCls} />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-zinc-600 ml-1">Short Description</label>
                  <input value={description} onChange={e => setDescription(e.target.value)} placeholder="Premium handcrafted quality" className={inputCls} />
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-zinc-600 ml-1">Detailed Story</label>
                  <textarea value={detailedDescription} onChange={e => setDetailedDescription(e.target.value)} rows={4} className={inputCls + " resize-none"} placeholder="Narrate the craftsmanship..." />
                </div>

                <div className="space-y-3">
                  <label className="text-[9px] font-black uppercase tracking-widest text-zinc-600 ml-1">Size Availability (UK)</label>
                  <div className="flex flex-wrap gap-2">
                    {AVAILABLE_SIZES.map(size => (
                      <button
                        key={size}
                        onClick={() => setSelectedSizes(prev => prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size])}
                        className={`w-12 h-10 rounded-xl text-[10px] font-bold border transition-all ${
                          selectedSizes.includes(size) ? "bg-[#FF4F00] border-[#FF4F00] text-white" : "bg-[#1A1A1A] border-transparent text-zinc-500 hover:border-[#333]"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[9px] font-black uppercase tracking-widest text-zinc-600 ml-1">Visual Assets</label>
                  <div className="grid grid-cols-4 gap-4">
                    {imageUrls.map((url, i) => (
                      <div key={url} className="relative aspect-square rounded-2xl overflow-hidden border border-[#1A1A1A] group">
                        <img src={url} className="w-full h-full object-cover" />
                        <button onClick={() => setImageUrls(p => p.filter((_, j) => j !== i))} className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <Trash2 className="w-5 h-5 text-white" />
                        </button>
                      </div>
                    ))}
                    <label className="relative aspect-square rounded-2xl border-2 border-dashed border-[#1A1A1A] flex flex-col items-center justify-center hover:border-[#FF4F00] hover:bg-[#1A1A1A]/50 cursor-pointer transition-all group">
                      {uploading ? <Loader2 className="animate-spin text-[#FF4F00] w-5 h-5" /> : <ImageIcon className="w-5 h-5 text-zinc-700 group-hover:text-[#FF4F00]" />}
                      <span className="text-[8px] font-black uppercase tracking-widest text-zinc-700 group-hover:text-[#FF4F00] mt-2">Upload</span>
                      <input type="file" accept="image/*" multiple onChange={handleImageUpload} disabled={uploading} className="absolute inset-0 opacity-0 cursor-pointer" />
                    </label>
                  </div>
                </div>

                <button 
                  onClick={handleSaveProduct} 
                  disabled={saving || !imageUrls.length || !name} 
                  className={`w-full py-5 rounded-2xl font-black text-[12px] uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${success ? "bg-green-500" : "bg-white text-black hover:bg-zinc-100 shadow-xl shadow-white/5"} disabled:opacity-30`}
                >
                  {saving ? <Loader2 className="animate-spin w-5 h-5" /> : success ? <><Check className="w-5 h-5" />Product Published</> : <><Package className="w-5 h-5" />Publish Silhouette</>}
                </button>
              </div>
            </motion.div>
          )}

          {/* INVENTORY */}
          {activeTab === "inventory" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
              <div className="flex justify-between items-end">
                <div>
                  <h2 className="text-4xl font-black tracking-tight">Inventory</h2>
                  <p className="text-zinc-500 mt-2">{shoesList.length} unique models active</p>
                </div>
              </div>

              <div className="bg-[#111] border border-[#1A1A1A] rounded-[2.5rem] overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#1A1A1A]">
                        {["Model", "Category", "Retail", "Stock", "Action"].map(h => (
                          <th key={h} className="text-left px-8 py-5 text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1A1A1A]">
                      {loadingShoes ? (
                        <tr><td colSpan={5} className="py-24 text-center"><Loader2 className="animate-spin mx-auto text-zinc-800" /></td></tr>
                      ) : shoesList.map(shoe => (
                        <tr key={shoe.id} className="hover:bg-[#151515] transition-colors group">
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-4">
                              <div className="w-14 h-14 rounded-2xl overflow-hidden bg-[#1A1A1A] border border-[#222]">
                                <img src={shoe.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                              </div>
                              <p className="font-bold text-[14px]">{shoe.name}</p>
                            </div>
                          </td>
                          <td className="px-8 py-6"><span className="text-[9px] font-black uppercase tracking-widest text-zinc-500 bg-[#1A1A1A] px-3 py-1.5 rounded-full border border-[#222]">{shoe.category}</span></td>
                          <td className="px-8 py-6 font-black text-[#FF4F00]">₹{shoe.price.toLocaleString()}</td>
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-3">
                              <button onClick={() => handleUpdateStock(shoe.id, shoe.stock, -1)} className="w-8 h-8 bg-[#1A1A1A] hover:bg-[#2A2A2A] rounded-xl flex items-center justify-center transition-all"><Minus className="w-3.5 h-3.5" /></button>
                              <span className={`text-[15px] font-black w-8 text-center ${shoe.stock < 5 ? "text-red-500" : "text-white"}`}>{shoe.stock}</span>
                              <button onClick={() => handleUpdateStock(shoe.id, shoe.stock, 1)} className="w-8 h-8 bg-[#1A1A1A] hover:bg-[#2A2A2A] rounded-xl flex items-center justify-center transition-all"><Plus className="w-3.5 h-3.5" /></button>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <button onClick={() => setDeleteId(shoe.id)} className="p-3 text-zinc-800 hover:text-red-500 hover:bg-red-500/10 rounded-2xl transition-all">
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* ORDERS */}
          {activeTab === "orders" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
              <div>
                <h2 className="text-4xl font-black tracking-tight">Logistics</h2>
                <p className="text-zinc-500 mt-2">{ordersList.length} historical fulfillment records</p>
              </div>

              <div className="bg-[#111] border border-[#1A1A1A] rounded-[2.5rem] overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#1A1A1A]">
                        {["Order", "Customer Details", "Amount", "Status", "Manifest"].map(h => (
                          <th key={h} className="text-left px-8 py-5 text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1A1A1A]">
                      {loadingOrders ? (
                        <tr><td colSpan={5} className="py-24 text-center"><Loader2 className="animate-spin mx-auto text-zinc-800" /></td></tr>
                      ) : ordersList.map(order => (
                        <tr key={order.id} className="hover:bg-[#151515] transition-colors">
                          <td className="px-8 py-6">
                            <p className="text-[14px] font-black">{order.shoes?.name || "Premium Footwear"}</p>
                            <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mt-1">Ref: #{order.id.toString().slice(-6).toUpperCase()}</p>
                          </td>
                          <td className="px-8 py-6 space-y-1.5">
                            <div className="flex items-center gap-2 text-[13px] font-black">
                              <User className="w-3.5 h-3.5 text-zinc-700" /> {order.customer_name}
                            </div>
                            <div className="flex items-center gap-2 text-[11px] font-medium text-zinc-500">
                              <Phone className="w-3.5 h-3.5 text-zinc-700" /> {order.phone || "N/A"}
                            </div>
                            <div className="flex items-center gap-2 text-[11px] font-medium text-zinc-500">
                              <MapPin className="w-3.5 h-3.5 text-zinc-700" /> {order.address}, {order.city} - {order.pincode}
                            </div>
                          </td>
                          <td className="px-8 py-6 font-black text-[#FF4F00] text-[15px]">₹{order.amount.toLocaleString()}</td>
                          <td className="px-8 py-6">
                            <span className={`text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full border ${
                              order.status === "success" ? "bg-green-500/10 border-green-500/20 text-green-500" : "bg-orange-500/10 border-orange-500/20 text-orange-500"
                            }`}>{order.status}</span>
                          </td>
                          <td className="px-8 py-6 flex items-center gap-2">
                            <button onClick={() => generateShippingLabel(order)} className="flex items-center gap-2 px-5 py-3 bg-[#1A1A1A] border border-[#222] hover:border-[#FF4F00] hover:text-[#FF4F00] rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
                              <Printer className="w-3.5 h-3.5" /> Label
                            </button>
                            <button 
                              onClick={() => handleShipOrder(order)} 
                              className="flex items-center gap-2 px-5 py-3 bg-[#1A1A1A] border border-[#222] hover:border-blue-500 hover:text-blue-500 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
                            >
                              <Package className="w-3.5 h-3.5" /> Ship
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      {/* Delete Confirmation Overlay */}
      <AnimatePresence>
        {deleteId && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-6">
            <motion.div initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 10 }} className="bg-[#111] border border-[#222] p-10 rounded-[3rem] max-w-[400px] w-full text-center shadow-2xl">
              <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Trash2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black mb-3">Retire Silhouette?</h3>
              <p className="text-zinc-600 text-sm font-medium mb-10 px-4">This will permanently remove the item from the live storefront.</p>
              <div className="flex gap-4">
                <button onClick={() => setDeleteId(null)} className="flex-1 py-4 bg-[#1A1A1A] text-zinc-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:text-white transition-all">Cancel</button>
                <button onClick={() => handleDeleteProduct(deleteId)} className="flex-1 py-4 bg-red-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-600 transition-all">Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
