"use client";
import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Check, Loader2, Image as ImageIcon, Trash2, Plus, Minus, Package, LayoutGrid, ShoppingCart, Printer, User, MapPin, Phone, LogOut, BarChart3, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { jsPDF } from "jspdf";

const ADMIN_EMAILS = ["adarshfouryt@gmail.com", "bhaikumarark99@gmail.com"];
const CATEGORIES = ["Premium Shoes", "Sneakers", "Chelsea Boots", "Slides & Sandals", "Running & Sports", "Casual Wear"];

type Tab = "overview" | "products" | "inventory" | "orders";

export default function MalikDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [name, setName] = useState(""); const [description, setDescription] = useState(""); const [detailedDescription, setDetailedDescription] = useState(""); const [price, setPrice] = useState(""); const [category, setCategory] = useState("Premium Shoes"); const [stock, setStock] = useState(10); const [imageUrls, setImageUrls] = useState<string[]>([]); const [uploading, setUploading] = useState(false); const [saving, setSaving] = useState(false); const [success, setSuccess] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const AVAILABLE_SIZES = ["6", "7", "8", "9", "10", "11"];
  const [shoesList, setShoesList] = useState<any[]>([]);
  const [loadingShoes, setLoadingShoes] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [analytics, setAnalytics] = useState({ totalOrders: 0, totalRevenue: 0, totalProducts: 0 });
  const [ordersList, setOrdersList] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const { user, loading: authLoading, signOut } = useAuth();
  const router = useRouter();
  const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  useEffect(() => {
    console.log("Admin Panel Auth Check:", { user: user?.email, authLoading });
    if (!authLoading) {
      if (!user) {
        console.warn("No user found, redirecting to home...");
        router.push("/");
      } else if (!ADMIN_EMAILS.includes(user.email || "")) {
        console.warn(`User ${user.email} is not an admin. Redirecting...`);
        router.push("/");
      } else {
        console.log("Admin access granted.");
        fetchAnalytics();
        fetchShoes();
      }
    }
  }, [user, authLoading]);

  const fetchShoes = async () => { setLoadingShoes(true); const { data } = await supabase.from("shoes").select("*").order("created_at", { ascending: false }); if (data) setShoesList(data); setLoadingShoes(false); };
  const fetchAnalytics = async () => { setLoadingOrders(true); const { data: orders } = await supabase.from("orders").select("*, shoes(name)").order("created_at", { ascending: false }); const { count } = await supabase.from("shoes").select("*", { count: "exact", head: true }); if (orders) { setOrdersList(orders); const s = orders.filter(o => o.status === "success"); setAnalytics({ totalOrders: s.length, totalRevenue: s.reduce((a, o) => a + Number(o.amount), 0), totalProducts: count || 0 }); } setLoadingOrders(false); };
  const handleUpdateStock = async (id: number, cur: number, delta: number) => { const ns = Math.max(0, cur + delta); await supabase.from("shoes").update({ stock: ns }).eq("id", id); setShoesList(p => p.map(s => s.id === id ? { ...s, stock: ns } : s)); };
  const handleDeleteProduct = async (id: number) => { const { error } = await supabase.from("shoes").delete().eq("id", id); if (!error) { setShoesList(p => p.filter(s => s.id !== id)); setDeleteId(null); } };
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => { const files = Array.from(e.target.files || []); if (!files.length) return; setUploading(true); try { const urls = await Promise.all(files.map(async f => { const fd = new FormData(); fd.append("file", f); fd.append("upload_preset", UPLOAD_PRESET!); const r = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, { method: "POST", body: fd }); return (await r.json()).secure_url; })); setImageUrls(p => [...p, ...urls.filter(Boolean)]); } finally { setUploading(false); } };
  const handleSaveProduct = async () => { const np = parseFloat(price); if (!name || !imageUrls.length || isNaN(np)) return; setSaving(true); try { const { error } = await supabase.from("shoes").insert([{ name, description, detailed_description: detailedDescription, price: np, category, stock, image_url: imageUrls[0], image_urls: imageUrls, sizes: selectedSizes, created_at: new Date().toISOString() }]); if (error) throw error; setSuccess(true); setTimeout(() => setSuccess(false), 3000); setName(""); setDescription(""); setDetailedDescription(""); setImageUrls([]); setPrice(""); setCategory("Premium Shoes"); setStock(10); setSelectedSizes([]); fetchShoes(); fetchAnalytics(); } catch (e: any) { alert(e.message); } finally { setSaving(false); } };
  const generateShippingLabel = (order: any) => { const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a6" }); const m = 5, w = 95, h = 138; doc.setLineWidth(1.5); doc.rect(m, m, w, h); doc.setFontSize(14); doc.setFont("helvetica", "bold"); doc.text("KANPUR SHOES WALA", 52.5, 15, { align: "center" }); doc.setLineWidth(0.5); doc.line(m + 5, 18, 100, 18); doc.setFontSize(10); doc.text("TO:", m + 5, 28); doc.setFontSize(12); doc.text(order.customer_name?.toUpperCase() || "N/A", m + 5, 35); doc.setFontSize(9); doc.setFont("helvetica", "normal"); const al = doc.splitTextToSize(`${order.address || ""}, ${order.city || ""} - ${order.pincode || ""}`, 70); doc.text(al, m + 5, 42); doc.setFont("helvetica", "bold"); doc.text(`Ph: ${order.phone || "N/A"}`, m + 5, 42 + al.length * 5); doc.line(m + 2, 65, 100, 65); doc.setFontSize(8); doc.setFont("helvetica", "normal"); doc.text("FROM: KANPUR SHOES WALA, Kanpur, UP - 208001", m + 5, 72); doc.setFont("helvetica", "bold"); doc.text(`ORDER: #${order.id.toString().slice(-6).toUpperCase()}`, m + 5, 85); doc.setFont("helvetica", "normal"); doc.text(`Item: ${order.shoes?.name || "Premium Shoe"}`, m + 5, 92); doc.text(`Date: ${new Date(order.created_at).toLocaleDateString()}`, m + 5, 99); doc.save(`label_${order.id}.pdf`); };

  if (authLoading) return <div className="min-h-screen flex items-center justify-center bg-white"><div className="w-8 h-8 bg-black animate-pulse rounded-lg" /></div>;

  const NAV: { id: Tab; label: string; icon: any }[] = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "products", label: "Add Product", icon: Plus },
    { id: "inventory", label: "Inventory", icon: LayoutGrid },
    { id: "orders", label: "Orders", icon: ShoppingCart },
  ];

  const inputCls = "w-full px-4 py-3.5 bg-[#f9f9f9] border border-transparent rounded-xl text-black text-sm placeholder:text-[#bbb] focus:outline-none focus:bg-white focus:border-[#eee] transition-all";

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#111] flex font-inter selection:bg-black selection:text-white">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-[#efefef] p-6 fixed top-0 left-0 bottom-0 z-50 bg-white">
        <div className="mb-10 pt-4">
          <div className="flex flex-col mb-4">
            <span className="text-[18px] font-black tracking-tighter text-[#111] leading-none uppercase flex flex-col">
              <span>Kanpur Shoes</span>
              <span className="text-[9px] tracking-[0.4em] text-[#999] -mt-0.5">Wala</span>
            </span>
          </div>
          <div className="h-0.5 w-6 bg-black rounded-full mb-6" />
          <div className="px-3 py-2 bg-[#f7f7f7] rounded-xl">
            <p className="text-[10px] font-black text-black uppercase tracking-widest">Admin Control</p>
            <p className="text-[9px] font-medium text-[#999] truncate mt-0.5">{user?.email}</p>
          </div>
        </div>

        <nav className="flex flex-col gap-1 flex-1">
          {NAV.map(n => (
            <button 
              key={n.id} 
              onClick={() => setActiveTab(n.id)} 
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all text-left ${activeTab === n.id ? "bg-black text-white shadow-xl shadow-black/10" : "text-[#888] hover:text-black hover:bg-[#f7f7f7]"}`}
            >
              <n.icon className={`w-4 h-4 flex-shrink-0 ${activeTab === n.id ? "text-white" : "text-[#ccc]"}`} />
              {n.label}
            </button>
          ))}
        </nav>

        <div className="pt-6 border-t border-[#efefef]">
          <button onClick={signOut} className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-[11px] font-black uppercase tracking-widest text-[#999] hover:text-red-500 hover:bg-red-50 transition-all">
            <LogOut className="w-4 h-4 flex-shrink-0" />Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#efefef] px-6 py-4 flex items-center justify-between">
        <span className="text-[13px] font-black uppercase tracking-tighter">Kanpur Shoes Wala</span>
        <div className="flex gap-1">
          {NAV.map(n => (
            <button key={n.id} onClick={() => setActiveTab(n.id)} className={`p-2 rounded-lg transition-all ${activeTab === n.id ? "bg-black text-white" : "text-[#999]"}`}>
              <n.icon className="w-4 h-4" />
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 w-full lg:ml-64 min-h-screen">
        <div className="p-6 lg:p-12 pt-28 lg:pt-16 max-w-[1200px] mx-auto">

        {/* OVERVIEW */}
        {activeTab === "overview" && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
            <div>
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#999] block mb-3">Intelligence Dashboard</span>
              <h2 className="text-[3.5rem] font-black tracking-tight text-black leading-none">Business<br />Performance</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { label: "Total Revenue", value: `₹${analytics.totalRevenue.toLocaleString()}`, sub: "All time earnings" },
                { label: "Orders Placed", value: analytics.totalOrders, sub: "Successful transactions" },
                { label: "Products Live", value: analytics.totalProducts, sub: "In your catalog" },
              ].map((s, idx) => (
                <div key={s.label} className="bg-white border border-[#efefef] rounded-[24px] p-8 shadow-sm hover:shadow-md transition-shadow">
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#999] mb-4">{s.label}</p>
                  <p className="text-4xl font-black text-black mb-2">{s.value}</p>
                  <div className="flex items-center gap-2">
                    <div className="h-1 w-6 bg-black rounded-full" />
                    <p className="text-[11px] font-bold text-[#bbb]">{s.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white border border-[#efefef] rounded-[32px] p-8 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-black tracking-tight text-black">Recent Orders</h3>
                <Link href="/malik?tab=orders" onClick={() => setActiveTab("orders")} className="text-[11px] font-black uppercase tracking-widest text-[#999] hover:text-black transition-colors">View All</Link>
              </div>
              <div className="space-y-2">
                {ordersList.slice(0, 5).map(o => (
                  <div key={o.id} className="flex items-center justify-between py-4 border-b border-[#f7f7f7] last:border-0 hover:px-2 transition-all rounded-xl hover:bg-[#fcfcfc]">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-[#f7f7f7] rounded-lg flex items-center justify-center">
                        <ShoppingBag className="w-4 h-4 text-[#bbb]" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-black">{o.customer_name || "Guest Customer"}</p>
                        <p className="text-[10px] font-bold text-[#999] uppercase tracking-wider">#{o.id.toString().slice(-6).toUpperCase()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-black">₹{o.amount}</p>
                      <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${o.status === "success" ? "bg-green-50 text-green-600" : "bg-orange-50 text-orange-500"}`}>{o.status}</span>
                    </div>
                  </div>
                ))}
                {ordersList.length === 0 && <p className="text-[#999] text-sm py-12 text-center font-medium">No order data available yet.</p>}
              </div>
            </div>
          </motion.div>
        )}

        {/* ADD PRODUCT */}
        {activeTab === "products" && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-10 max-w-2xl">
            <div>
              <h2 className="text-[2.5rem] font-black tracking-tight text-black">Add Product</h2>
              <p className="text-[#999] mt-2 font-medium">Define a new premium silhouette for your collection.</p>
            </div>
            <div className="bg-white border border-[#efefef] rounded-[32px] p-10 shadow-sm space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2"><label className="text-[10px] font-black uppercase tracking-widest text-[#999] ml-1">Product Name</label><input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Heritage Chelsea" className={inputCls} /></div>
                <div className="space-y-2"><label className="text-[10px] font-black uppercase tracking-widest text-[#999] ml-1">Price (INR)</label><input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="0.00" className={inputCls} /></div>
                <div className="space-y-2"><label className="text-[10px] font-black uppercase tracking-widest text-[#999] ml-1">Category</label><select value={category} onChange={e => setCategory(e.target.value)} className={inputCls}>{CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
                <div className="space-y-2"><label className="text-[10px] font-black uppercase tracking-widest text-[#999] ml-1">Stock Units</label><input type="number" value={stock} onChange={e => setStock(parseInt(e.target.value))} className={inputCls} /></div>
              </div>
              <div className="space-y-2"><label className="text-[10px] font-black uppercase tracking-widest text-[#999] ml-1">Short Description</label><input value={description} onChange={e => setDescription(e.target.value)} placeholder="e.g. Handcrafted Italian Leather" className={inputCls} /></div>
              <div className="space-y-2"><label className="text-[10px] font-black uppercase tracking-widest text-[#999] ml-1">Detailed Story</label><textarea value={detailedDescription} onChange={e => setDetailedDescription(e.target.value)} rows={4} className={inputCls + " resize-none"} placeholder="Describe the craftsmanship..." /></div>
              
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#999] ml-1">Size Availability (UK)</label>
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_SIZES.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSizes(prev => prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size])}
                      className={`w-12 h-10 rounded-xl text-[11px] font-bold border transition-all ${
                        selectedSizes.includes(size) 
                          ? "bg-black border-black text-white" 
                          : "bg-[#f9f9f9] border-transparent text-[#999] hover:border-[#eee]"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#999] ml-1">Visual Assets</label>
                <div className="grid grid-cols-4 gap-4">
                  {imageUrls.map((url, i) => (
                    <div key={url} className="relative aspect-square rounded-2xl overflow-hidden border border-[#eee] group">
                      <img src={url} className="w-full h-full object-cover" />
                      <button onClick={() => setImageUrls(p => p.filter((_, j) => j !== i))} className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"><Trash2 className="w-5 h-5 text-white" /></button>
                    </div>
                  ))}
                  <label className="relative aspect-square rounded-2xl border-2 border-dashed border-[#eee] flex flex-col items-center justify-center hover:border-black hover:bg-[#fcfcfc] cursor-pointer transition-all group">
                    {uploading ? <Loader2 className="animate-spin text-black w-5 h-5" /> : <Plus className="w-5 h-5 text-[#ccc] group-hover:text-black" />}
                    <span className="text-[9px] font-black uppercase tracking-widest text-[#ccc] group-hover:text-black mt-2">Add</span>
                    <input type="file" accept="image/*" multiple onChange={handleImageUpload} disabled={uploading} className="absolute inset-0 opacity-0 cursor-pointer" />
                  </label>
                </div>
              </div>

              <button 
                onClick={handleSaveProduct} 
                disabled={saving || !imageUrls.length || !name} 
                className={`w-full py-5 rounded-[20px] font-black text-[14px] uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${success ? "bg-green-500 text-white" : "bg-black text-white hover:bg-[#222] shadow-xl shadow-black/5"} disabled:opacity-40`}
              >
                {saving ? <Loader2 className="animate-spin w-5 h-5" /> : success ? <><Check className="w-5 h-5" />Product Published</> : <><Package className="w-5 h-5" />Publish Collection</>}
              </button>
            </div>
          </motion.div>
        )}

        {/* INVENTORY */}
        {activeTab === "inventory" && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
              <div>
                <h2 className="text-[2.5rem] font-black tracking-tight text-black">Inventory</h2>
                <p className="text-[#999] font-medium mt-2">{shoesList.length} Active models in catalog</p>
              </div>
              <div className="bg-[#f7f7f7] px-4 py-2 rounded-full border border-[#efefef]">
                <p className="text-[10px] font-black uppercase tracking-widest text-[#999]">Managed Assets</p>
              </div>
            </div>

            <div className="bg-white border border-[#efefef] rounded-[32px] overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead><tr className="bg-[#fcfcfc] border-b border-[#efefef]">{["Model", "Category", "Retail Price", "Stock Level", "Management"].map(h => <th key={h} className="text-left px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[#999]">{h}</th>)}</tr></thead>
                  <tbody className="divide-y divide-[#f7f7f7]">
                    {loadingShoes ? <tr><td colSpan={5} className="py-24 text-center"><div className="w-8 h-8 bg-black animate-pulse rounded-lg mx-auto" /></td></tr>
                      : shoesList.map(shoe => (
                        <tr key={shoe.id} className="hover:bg-[#fcfcfc] transition-colors">
                          <td className="px-8 py-5"><div className="flex items-center gap-4"><div className="w-14 h-14 rounded-2xl overflow-hidden bg-[#f7f7f7] border border-[#efefef] flex-shrink-0"><img src={shoe.image_url} className="w-full h-full object-cover" /></div><p className="font-black text-[14px] text-black leading-tight">{shoe.name}</p></div></td>
                          <td className="px-8 py-5"><span className="text-[9px] font-black uppercase tracking-widest text-[#999] bg-[#f7f7f7] px-3 py-1.5 rounded-full border border-[#eee]">{shoe.category}</span></td>
                          <td className="px-8 py-5 font-black text-black text-[14px]">₹{shoe.price.toLocaleString()}</td>
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-3">
                              <button onClick={() => handleUpdateStock(shoe.id, shoe.stock, -1)} className="w-8 h-8 border border-[#eee] hover:border-black rounded-xl flex items-center justify-center transition-all hover:bg-black hover:text-white"><Minus className="w-3.5 h-3.5" /></button>
                              <span className={`text-[15px] font-black w-8 text-center ${shoe.stock < 5 ? "text-red-500" : "text-black"}`}>{shoe.stock}</span>
                              <button onClick={() => handleUpdateStock(shoe.id, shoe.stock, 1)} className="w-8 h-8 border border-[#eee] hover:border-black rounded-xl flex items-center justify-center transition-all hover:bg-black hover:text-white"><Plus className="w-3.5 h-3.5" /></button>
                            </div>
                          </td>
                          <td className="px-8 py-5 text-right">
                            <button onClick={() => setDeleteId(shoe.id)} className="p-3 text-[#ccc] hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all">
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
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
              <div>
                <h2 className="text-[2.5rem] font-black tracking-tight text-black">Logistics</h2>
                <p className="text-[#999] font-medium mt-2">{ordersList.length} Fulfillment requests recorded</p>
              </div>
              <div className="bg-[#f7f7f7] px-4 py-2 rounded-full border border-[#efefef]">
                <p className="text-[10px] font-black uppercase tracking-widest text-[#999]">Real-time Tracking</p>
              </div>
            </div>

            <div className="bg-white border border-[#efefef] rounded-[32px] overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead><tr className="bg-[#fcfcfc] border-b border-[#efefef]">{["Fulfillment", "Client Data", "Retail Value", "Status", "Manifest"].map(h => <th key={h} className="text-left px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[#999]">{h}</th>)}</tr></thead>
                  <tbody className="divide-y divide-[#f7f7f7]">
                    {loadingOrders ? <tr><td colSpan={5} className="py-24 text-center"><div className="w-8 h-8 bg-black animate-pulse rounded-lg mx-auto" /></td></tr>
                      : ordersList.map(order => (
                        <tr key={order.id} className="hover:bg-[#fcfcfc] transition-colors">
                          <td className="px-8 py-5">
                            <p className="text-[14px] font-black text-black">{order.shoes?.name || "Premium Footwear"}</p>
                            <p className="text-[10px] font-bold text-[#999] uppercase tracking-widest mt-1">Ref: #{order.id.toString().slice(-6).toUpperCase()}</p>
                          </td>
                          <td className="px-8 py-5 space-y-1.5">
                            <div className="flex items-center gap-2 text-sm font-black text-black">
                              <User className="w-3.5 h-3.5 text-[#ccc]" /> {order.customer_name}
                            </div>
                            <div className="flex items-center gap-2 text-[11px] font-medium text-[#999]">
                              <Phone className="w-3.5 h-3.5 text-[#ccc]" /> {order.phone}
                            </div>
                            <div className="flex items-center gap-2 text-[11px] font-medium text-[#999]">
                              <MapPin className="w-3.5 h-3.5 text-[#ccc]" /> {order.city}
                            </div>
                          </td>
                          <td className="px-8 py-5 font-black text-black text-[14px]">₹{order.amount.toLocaleString()}</td>
                          <td className="px-8 py-5">
                            <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border ${
                              order.status === "success" 
                                ? "bg-green-50 border-green-100 text-green-600" 
                                : "bg-orange-50 border-orange-100 text-orange-500"
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-8 py-5">
                            <button onClick={() => generateShippingLabel(order)} className="flex items-center gap-2 px-5 py-2.5 bg-[#f9f9f9] border border-[#eee] hover:border-black hover:bg-black text-[#999] hover:text-white rounded-[14px] text-[10px] font-black uppercase tracking-widest transition-all">
                              <Printer className="w-3.5 h-3.5" /> Manifest
                            </button>
                          </td>
                        </tr>
                      ))}
                    {ordersList.length === 0 && !loadingOrders && <tr><td colSpan={5} className="py-24 text-center text-[#999] text-sm font-medium">No logistics data found.</td></tr>}
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
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-[100] bg-black/20 backdrop-blur-md flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 10 }} 
              animate={{ scale: 1, y: 0 }} 
              exit={{ scale: 0.95, y: 10 }} 
              className="bg-white p-10 rounded-[40px] max-w-[400px] w-full text-center shadow-2xl border border-[#f0f0f0]"
            >
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Trash2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-black mb-3">Retire Product?</h3>
              <p className="text-[#999] text-sm font-medium mb-10 px-4">Are you sure you want to permanently remove this silhouette from your collection?</p>
              <div className="flex gap-4">
                <button onClick={() => setDeleteId(null)} className="flex-1 py-4 bg-[#f7f7f7] text-[#999] rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#eee] transition-all">Wait, Go Back</button>
                <button onClick={() => handleDeleteProduct(deleteId)} className="flex-1 py-4 bg-red-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-600 shadow-xl shadow-red-500/20 transition-all">Yes, Retire</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
