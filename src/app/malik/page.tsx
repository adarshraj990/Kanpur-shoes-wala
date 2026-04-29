"use client";
import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Check, Loader2, Image as ImageIcon, Trash2, Plus, Minus, Package, LayoutGrid, ShoppingCart, Printer, User, MapPin, Phone, LogOut, BarChart3, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { jsPDF } from "jspdf";

const ADMIN_EMAILS = ["bhaikumarark99@gmail.com", "adarshfouryt@gmail.com"];
const CATEGORIES = ["Premium Shoes", "Sneakers", "Chelsea Boots", "Slides & Sandals", "Running & Sports", "Casual Wear"];

type Tab = "overview" | "products" | "inventory" | "orders";

export default function MalikDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [name, setName] = useState(""); const [description, setDescription] = useState(""); const [detailedDescription, setDetailedDescription] = useState(""); const [price, setPrice] = useState(""); const [category, setCategory] = useState("Premium Shoes"); const [stock, setStock] = useState(10); const [imageUrls, setImageUrls] = useState<string[]>([]); const [uploading, setUploading] = useState(false); const [saving, setSaving] = useState(false); const [success, setSuccess] = useState(false);
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
    if (!authLoading && (!user || !ADMIN_EMAILS.includes(user.email || ""))) router.push("/");
    else { fetchAnalytics(); fetchShoes(); }
  }, [user, authLoading]);

  const fetchShoes = async () => { setLoadingShoes(true); const { data } = await supabase.from("shoes").select("*").order("created_at", { ascending: false }); if (data) setShoesList(data); setLoadingShoes(false); };
  const fetchAnalytics = async () => { setLoadingOrders(true); const { data: orders } = await supabase.from("orders").select("*, shoes(name)").order("created_at", { ascending: false }); const { count } = await supabase.from("shoes").select("*", { count: "exact", head: true }); if (orders) { setOrdersList(orders); const s = orders.filter(o => o.status === "success"); setAnalytics({ totalOrders: s.length, totalRevenue: s.reduce((a, o) => a + Number(o.amount), 0), totalProducts: count || 0 }); } setLoadingOrders(false); };
  const handleUpdateStock = async (id: number, cur: number, delta: number) => { const ns = Math.max(0, cur + delta); await supabase.from("shoes").update({ stock: ns }).eq("id", id); setShoesList(p => p.map(s => s.id === id ? { ...s, stock: ns } : s)); };
  const handleDeleteProduct = async (id: number) => { const { error } = await supabase.from("shoes").delete().eq("id", id); if (!error) { setShoesList(p => p.filter(s => s.id !== id)); setDeleteId(null); } };
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => { const files = Array.from(e.target.files || []); if (!files.length) return; setUploading(true); try { const urls = await Promise.all(files.map(async f => { const fd = new FormData(); fd.append("file", f); fd.append("upload_preset", UPLOAD_PRESET!); const r = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, { method: "POST", body: fd }); return (await r.json()).secure_url; })); setImageUrls(p => [...p, ...urls.filter(Boolean)]); } finally { setUploading(false); } };
  const handleSaveProduct = async () => { const np = parseFloat(price); if (!name || !imageUrls.length || isNaN(np)) return; setSaving(true); try { const { error } = await supabase.from("shoes").insert([{ name, description, detailed_description: detailedDescription, price: np, category, stock, image_url: imageUrls[0], image_urls: imageUrls, created_at: new Date().toISOString() }]); if (error) throw error; setSuccess(true); setTimeout(() => setSuccess(false), 3000); setName(""); setDescription(""); setDetailedDescription(""); setImageUrls([]); setPrice(""); setCategory("Premium Shoes"); setStock(10); fetchShoes(); fetchAnalytics(); } catch (e: any) { alert(e.message); } finally { setSaving(false); } };
  const generateShippingLabel = (order: any) => { const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a6" }); const m = 5, w = 95, h = 138; doc.setLineWidth(1.5); doc.rect(m, m, w, h); doc.setFontSize(14); doc.setFont("helvetica", "bold"); doc.text("KANPUR SHOES WALA", 52.5, 15, { align: "center" }); doc.setLineWidth(0.5); doc.line(m + 5, 18, 100, 18); doc.setFontSize(10); doc.text("TO:", m + 5, 28); doc.setFontSize(12); doc.text(order.customer_name?.toUpperCase() || "N/A", m + 5, 35); doc.setFontSize(9); doc.setFont("helvetica", "normal"); const al = doc.splitTextToSize(`${order.address || ""}, ${order.city || ""} - ${order.pincode || ""}`, 70); doc.text(al, m + 5, 42); doc.setFont("helvetica", "bold"); doc.text(`Ph: ${order.phone || "N/A"}`, m + 5, 42 + al.length * 5); doc.line(m + 2, 65, 100, 65); doc.setFontSize(8); doc.setFont("helvetica", "normal"); doc.text("FROM: KANPUR SHOES WALA, Kanpur, UP - 208001", m + 5, 72); doc.setFont("helvetica", "bold"); doc.text(`ORDER: #${order.id.toString().slice(-6).toUpperCase()}`, m + 5, 85); doc.setFont("helvetica", "normal"); doc.text(`Item: ${order.shoes?.name || "Premium Shoe"}`, m + 5, 92); doc.text(`Date: ${new Date(order.created_at).toLocaleDateString()}`, m + 5, 99); doc.save(`label_${order.id}.pdf`); };

  if (authLoading) return <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A]"><Loader2 className="animate-spin text-white w-8 h-8" /></div>;

  const NAV: { id: Tab; label: string; icon: any }[] = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "products", label: "Add Product", icon: Plus },
    { id: "inventory", label: "Inventory", icon: LayoutGrid },
    { id: "orders", label: "Orders", icon: ShoppingCart },
  ];

  const inputCls = "w-full px-4 py-3.5 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-[#FF4F00] transition-colors";

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-[#1A1A1A] p-6 fixed h-full">
        <div className="mb-10">
          <div className="w-10 h-10 rounded-xl bg-[#FF4F00] flex items-center justify-center mb-3">
            <Package className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-lg font-black tracking-tight">Malik Panel</h1>
          <p className="text-xs text-zinc-500 mt-1">{user?.email}</p>
        </div>
        <nav className="flex flex-col gap-1 flex-1">
          {NAV.map(n => (
            <button key={n.id} onClick={() => setActiveTab(n.id)} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all text-left ${activeTab === n.id ? "bg-[#FF4F00] text-white" : "text-zinc-400 hover:text-white hover:bg-[#1A1A1A]"}`}>
              <n.icon className="w-4 h-4" />{n.label}
            </button>
          ))}
        </nav>
        <button onClick={signOut} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-zinc-500 hover:text-red-400 hover:bg-[#1A1A1A] transition-all">
          <LogOut className="w-4 h-4" />Sign Out
        </button>
      </aside>

      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A] border-b border-[#1A1A1A] px-4 py-3 flex items-center justify-between">
        <span className="font-black text-sm">Malik Panel</span>
        <div className="flex gap-1">{NAV.map(n => (<button key={n.id} onClick={() => setActiveTab(n.id)} className={`p-2 rounded-lg transition-all ${activeTab === n.id ? "bg-[#FF4F00]" : "text-zinc-500"}`}><n.icon className="w-4 h-4" /></button>))}</div>
      </div>

      {/* Main */}
      <main className="flex-1 lg:ml-64 p-6 lg:p-10 pt-20 lg:pt-10">

        {/* OVERVIEW */}
        {activeTab === "overview" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div>
              <h2 className="text-3xl font-black tracking-tight">Overview</h2>
              <p className="text-zinc-500 mt-1">Kanpur Shoes Wala — Business Dashboard</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: "Total Revenue", value: `₹${analytics.totalRevenue.toLocaleString()}`, color: "#FF4F00", sub: "All time" },
                { label: "Orders Placed", value: analytics.totalOrders, color: "#22C55E", sub: "Successful" },
                { label: "Products Live", value: analytics.totalProducts, color: "#3B82F6", sub: "In catalog" },
              ].map(s => (
                <div key={s.label} className="bg-[#111] border border-[#1A1A1A] rounded-2xl p-6">
                  <div className="flex justify-between items-start mb-4">
                    <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">{s.label}</p>
                    <ArrowUpRight className="w-4 h-4" style={{ color: s.color }} />
                  </div>
                  <p className="text-4xl font-black" style={{ color: s.color }}>{s.value}</p>
                  <p className="text-xs text-zinc-600 mt-2">{s.sub}</p>
                </div>
              ))}
            </div>
            <div className="bg-[#111] border border-[#1A1A1A] rounded-2xl p-6">
              <h3 className="font-black mb-4 text-sm uppercase tracking-widest text-zinc-400">Recent Orders</h3>
              <div className="space-y-3">
                {ordersList.slice(0, 5).map(o => (
                  <div key={o.id} className="flex items-center justify-between py-3 border-b border-[#1A1A1A] last:border-0">
                    <div><p className="text-sm font-bold">{o.customer_name || "Customer"}</p><p className="text-xs text-zinc-500">#{o.id.toString().slice(-6).toUpperCase()}</p></div>
                    <div className="text-right"><p className="text-sm font-black text-[#FF4F00]">₹{o.amount}</p><span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${o.status === "success" ? "bg-green-500/10 text-green-500" : "bg-orange-500/10 text-orange-500"}`}>{o.status}</span></div>
                  </div>
                ))}
                {ordersList.length === 0 && <p className="text-zinc-600 text-sm py-6 text-center">No orders yet</p>}
              </div>
            </div>
          </motion.div>
        )}

        {/* ADD PRODUCT */}
        {activeTab === "products" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 max-w-2xl">
            <div>
              <h2 className="text-3xl font-black tracking-tight">Add Product</h2>
              <p className="text-zinc-500 mt-1">List a new shoe to the collection</p>
            </div>
            <div className="bg-[#111] border border-[#1A1A1A] rounded-2xl p-6 sm:p-8 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5"><label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Name</label><input value={name} onChange={e => setName(e.target.value)} placeholder="Kanpur Air V2" className={inputCls} /></div>
                <div className="space-y-1.5"><label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Price (₹)</label><input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="799" className={inputCls} /></div>
                <div className="space-y-1.5"><label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Category</label><select value={category} onChange={e => setCategory(e.target.value)} className={inputCls}>{CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
                <div className="space-y-1.5"><label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Initial Stock</label><input type="number" value={stock} onChange={e => setStock(parseInt(e.target.value))} className={inputCls} /></div>
              </div>
              <div className="space-y-1.5"><label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Short Tagline</label><input value={description} onChange={e => setDescription(e.target.value)} placeholder="Handcrafted in Kanpur" className={inputCls} /></div>
              <div className="space-y-1.5"><label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Detailed Description</label><textarea value={detailedDescription} onChange={e => setDetailedDescription(e.target.value)} rows={3} className={inputCls + " resize-none"} /></div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Product Images</label>
                <div className="grid grid-cols-4 gap-3">
                  {imageUrls.map((url, i) => (
                    <div key={url} className="relative aspect-square rounded-xl overflow-hidden border border-[#2A2A2A]">
                      <img src={url} className="w-full h-full object-cover" />
                      <button onClick={() => setImageUrls(p => p.filter((_, j) => j !== i))} className="absolute top-1.5 right-1.5 p-1 bg-black/70 text-red-400 rounded-lg"><Trash2 className="w-3 h-3" /></button>
                    </div>
                  ))}
                  <label className="relative aspect-square rounded-xl border-2 border-dashed border-[#2A2A2A] flex flex-col items-center justify-center hover:border-[#FF4F00] cursor-pointer transition-colors">
                    {uploading ? <Loader2 className="animate-spin text-zinc-600" /> : <ImageIcon className="w-5 h-5 text-zinc-600" />}
                    <span className="text-[9px] text-zinc-600 mt-1">Upload</span>
                    <input type="file" accept="image/*" multiple onChange={handleImageUpload} disabled={uploading} className="absolute inset-0 opacity-0 cursor-pointer" />
                  </label>
                </div>
              </div>
              <button onClick={handleSaveProduct} disabled={saving || !imageUrls.length || !name} className={`w-full py-4 rounded-xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${success ? "bg-green-500" : "bg-[#FF4F00] hover:bg-[#E64600]"} disabled:opacity-40`}>
                {saving ? <Loader2 className="animate-spin w-5 h-5" /> : success ? <><Check className="w-5 h-5" />Saved!</> : <><Package className="w-5 h-5" />Save Product</>}
              </button>
            </div>
          </motion.div>
        )}

        {/* INVENTORY */}
        {activeTab === "inventory" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div><h2 className="text-3xl font-black tracking-tight">Inventory</h2><p className="text-zinc-500 mt-1">{shoesList.length} products in catalog</p></div>
            <div className="bg-[#111] border border-[#1A1A1A] rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead><tr className="border-b border-[#1A1A1A]">{["Product", "Category", "Price", "Stock", ""].map(h => <th key={h} className="text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-500">{h}</th>)}</tr></thead>
                  <tbody className="divide-y divide-[#1A1A1A]">
                    {loadingShoes ? <tr><td colSpan={5} className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-zinc-600" /></td></tr>
                      : shoesList.map(shoe => (
                        <tr key={shoe.id} className="hover:bg-[#151515] transition-colors">
                          <td className="px-6 py-4"><div className="flex items-center gap-3"><div className="w-11 h-11 rounded-xl overflow-hidden bg-[#1A1A1A] flex-shrink-0"><img src={shoe.image_url} className="w-full h-full object-cover" /></div><p className="font-bold text-sm text-white leading-tight">{shoe.name}</p></div></td>
                          <td className="px-6 py-4"><span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 bg-[#1A1A1A] px-2 py-1 rounded-lg">{shoe.category}</span></td>
                          <td className="px-6 py-4 font-black text-[#FF4F00] text-sm">₹{shoe.price}</td>
                          <td className="px-6 py-4"><div className="flex items-center gap-2"><button onClick={() => handleUpdateStock(shoe.id, shoe.stock, -1)} className="w-7 h-7 bg-[#1A1A1A] hover:bg-[#2A2A2A] rounded-lg flex items-center justify-center transition-colors"><Minus className="w-3 h-3" /></button><span className={`text-sm font-black w-8 text-center ${shoe.stock < 5 ? "text-red-400" : "text-white"}`}>{shoe.stock}</span><button onClick={() => handleUpdateStock(shoe.id, shoe.stock, 1)} className="w-7 h-7 bg-[#1A1A1A] hover:bg-[#2A2A2A] rounded-lg flex items-center justify-center transition-colors"><Plus className="w-3 h-3" /></button></div></td>
                          <td className="px-6 py-4 text-right"><button onClick={() => setDeleteId(shoe.id)} className="p-2 text-zinc-600 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"><Trash2 className="w-4 h-4" /></button></td>
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
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div><h2 className="text-3xl font-black tracking-tight">Orders</h2><p className="text-zinc-500 mt-1">{ordersList.length} total orders</p></div>
            <div className="bg-[#111] border border-[#1A1A1A] rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead><tr className="border-b border-[#1A1A1A]">{["Order", "Customer", "Amount", "Status", "Action"].map(h => <th key={h} className="text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-500">{h}</th>)}</tr></thead>
                  <tbody className="divide-y divide-[#1A1A1A]">
                    {loadingOrders ? <tr><td colSpan={5} className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-zinc-600" /></td></tr>
                      : ordersList.map(order => (
                        <tr key={order.id} className="hover:bg-[#151515] transition-colors">
                          <td className="px-6 py-4"><p className="text-sm font-bold text-white">{order.shoes?.name || "Shoe"}</p><p className="text-[10px] font-black text-zinc-500 mt-1">#{order.id.toString().slice(-6).toUpperCase()}</p></td>
                          <td className="px-6 py-4 space-y-1"><p className="text-sm font-bold flex items-center gap-1.5"><User className="w-3 h-3 text-zinc-600" />{order.customer_name}</p><p className="text-[10px] text-zinc-500 flex items-center gap-1.5"><Phone className="w-3 h-3 text-zinc-600" />{order.phone}</p><p className="text-[10px] text-zinc-500 flex items-center gap-1.5"><MapPin className="w-3 h-3 text-zinc-600" />{order.city}</p></td>
                          <td className="px-6 py-4 font-black text-[#FF4F00] text-sm">₹{order.amount}</td>
                          <td className="px-6 py-4"><span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${order.status === "success" ? "bg-green-500/10 text-green-400" : "bg-orange-500/10 text-orange-400"}`}>{order.status}</span></td>
                          <td className="px-6 py-4"><button onClick={() => generateShippingLabel(order)} className="flex items-center gap-2 px-3 py-2 bg-[#1A1A1A] hover:bg-[#FF4F00] text-zinc-400 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"><Printer className="w-3.5 h-3.5" />Label</button></td>
                        </tr>
                      ))}
                    {ordersList.length === 0 && !loadingOrders && <tr><td colSpan={5} className="py-20 text-center text-zinc-600 text-sm">No orders yet</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </main>

      {/* Delete Modal */}
      <AnimatePresence>
        {deleteId && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-6">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-[#111] border border-[#2A2A2A] p-8 rounded-2xl max-w-sm w-full text-center">
              <div className="w-14 h-14 bg-red-500/10 text-red-400 rounded-2xl flex items-center justify-center mx-auto mb-5"><Trash2 className="w-7 h-7" /></div>
              <h3 className="text-xl font-black mb-2">Delete Product?</h3>
              <p className="text-zinc-500 text-sm mb-6">This will permanently remove this item from Kanpur Shoes Wala.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteId(null)} className="flex-1 py-3 bg-[#1A1A1A] text-white rounded-xl font-bold text-sm hover:bg-[#2A2A2A] transition-colors">Cancel</button>
                <button onClick={() => handleDeleteProduct(deleteId)} className="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold text-sm hover:bg-red-600 transition-colors">Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
