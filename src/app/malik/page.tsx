/* MASTER_LOG - APRIL 29, 2026 
- Fix 1: Replaced Math.random() liveVisitors with Supabase Realtime Presence.
- Fix 2: Added Realtime subscription to 'orders' table for live updates.
- Fix 3: Added error handling to all fetch operations + manual Refresh button.
*/

"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { 
  Check, Loader2, Image as ImageIcon, RefreshCw,
  Trash2, Plus, Minus, Package, LayoutGrid,
  TrendingUp, ShoppingCart, DollarSign, Activity,
  Printer, Tag, FileText, User, MapPin, Phone
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { jsPDF } from "jspdf";

export default function MalikDashboard() {
  // Form State
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [detailedDescription, setDetailedDescription] = useState("");
  const [price, setPrice] = useState<string>("");
  const [category, setCategory] = useState("Premium Shoes");
  const [stock, setStock] = useState<number>(10);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  // Management State
  const [shoesList, setShoesList] = useState<any[]>([]);
  const [loadingShoes, setLoadingShoes] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // Analytics & Orders
  const [analytics, setAnalytics] = useState<any>({ totalOrders: 0, totalRevenue: 0, liveVisitors: 0 });
  const [ordersList, setOrdersList] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  // Ref to hold the Presence channel so we can clean it up
  const presenceChannelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  const ADMIN_EMAILS = ['bhaikumarark99@gmail.com', 'adarshfouryt@gmail.com'];

  useEffect(() => {
    if (!authLoading && (!user || !ADMIN_EMAILS.includes(user.email || ""))) router.push("/");
    if (user && ADMIN_EMAILS.includes(user.email || "")) {
      fetchAnalytics();
      fetchShoes();
      setupRealtimeSubscriptions();
    }
    // Cleanup subscriptions on unmount
    return () => {
      supabase.channel("orders-realtime").unsubscribe();
      presenceChannelRef.current?.unsubscribe();
    };
  }, [user, authLoading]);

  const fetchShoes = async () => {
    setLoadingShoes(true);
    const { data } = await supabase.from("shoes").select("*").order('created_at', { ascending: false });
    if (data) setShoesList(data);
    setLoadingShoes(false);
  };

  const fetchAnalytics = async (isManualRefresh = false) => {
    if (isManualRefresh) setIsRefreshing(true);
    else setLoadingOrders(true);
    setFetchError(null);

    // FIX 1: Proper error handling on order fetch
    const { data: orders, error } = await supabase
      .from("orders")
      .select("*, shoes(name)")
      .order('created_at', { ascending: false });

    if (error) {
      console.error("[Dashboard] Orders fetch error:", error.message);
      setFetchError(error.message);
    } else if (orders) {
      setOrdersList(orders);
      const successOrders = orders.filter(o => o.status === 'success');
      // FIX 2: Do NOT use Math.random(). liveVisitors is now set by
      // the Supabase Presence subscription in setupRealtimeSubscriptions().
      setAnalytics((prev: any) => ({
        ...prev,
        totalOrders: successOrders.length,
        totalRevenue: successOrders.reduce((sum, o) => sum + Number(o.amount), 0),
      }));
    }

    if (isManualRefresh) setIsRefreshing(false);
    else setLoadingOrders(false);
  };

  const setupRealtimeSubscriptions = () => {
    // ── FIX 3: Realtime Subscription for Orders ──────────────────
    // Whenever a new row is INSERTed into 'orders', re-fetch analytics.
    supabase
      .channel("orders-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "orders" },
        (payload) => {
          console.log("[Realtime] New order received:", payload.new);
          fetchAnalytics(); // Re-fetch to get updated totals
        }
      )
      .subscribe();

    // ── FIX 4: Supabase Presence for Live Visitors ───────────────
    // The VisitorTracker component (in layout.tsx) tracks ALL users.
    // Here in the dashboard, we SUBSCRIBE to that same channel and
    // count the members to get the real live visitor count.
    const presenceChannel = supabase.channel("live_visitors");
    presenceChannelRef.current = presenceChannel;

    presenceChannel
      .on("presence", { event: "sync" }, () => {
        // state() returns all current presence keys
        const state = presenceChannel.presenceState();
        const liveCount = Object.keys(state).length;
        console.log("[Presence] Live visitors:", liveCount);
        setAnalytics((prev: any) => ({ ...prev, liveVisitors: liveCount }));
      })
      .on("presence", { event: "join" }, ({ newPresences }) => {
        console.log("[Presence] User joined:", newPresences);
      })
      .on("presence", { event: "leave" }, ({ leftPresences }) => {
        console.log("[Presence] User left:", leftPresences);
      })
      .subscribe();
  };

  const handleUpdateStock = async (id: number, currentStock: number, delta: number) => {
    const newStock = Math.max(0, currentStock + delta);
    const { error } = await supabase.from("shoes").update({ stock: newStock }).eq("id", id);
    if (!error) {
      setShoesList(prev => prev.map(s => s.id === id ? { ...s, stock: newStock } : s));
    }
  };

  const handleDeleteProduct = async (id: number) => {
    const { error } = await supabase.from("shoes").delete().eq("id", id);
    if (!error) {
      setShoesList(prev => prev.filter(s => s.id !== id));
      setDeleteId(null);
    } else {
      alert("Error deleting product: " + error.message);
    }
  };

  const generateShippingLabel = (order: any) => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a6", // 105 x 148 mm
    });

    const margin = 5;
    const width = 105 - (margin * 2);
    const height = 148 - (margin * 2);

    // Thick black border
    doc.setLineWidth(1.5);
    doc.rect(margin, margin, width, height);

    // Title
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("KANPUR SHOES WALA", 52.5, 15, { align: "center" });
    doc.setLineWidth(0.5);
    doc.line(margin + 5, 18, 105 - margin - 5, 18);

    // Recipient Section (TO)
    doc.setFontSize(10);
    doc.text("TO (RECIPIENT):", margin + 5, 28);
    doc.setFontSize(12);
    doc.text(order.customer_name.toUpperCase(), margin + 5, 35);
    
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    const addressLines = doc.splitTextToSize(
      `${order.address || "N/A"}, ${order.city || ""}, ${order.pincode || ""}`, 
      width - 15
    );
    doc.text(addressLines, margin + 5, 42);
    
    doc.setFont("helvetica", "bold");
    doc.text(`Phone: ${order.phone || "N/A"}`, margin + 5, 42 + (addressLines.length * 5));

    // Divider
    doc.setLineWidth(0.2);
    doc.line(margin + 2, 65, 105 - margin - 2, 65);

    // Sender Section (FROM)
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text("FROM (SENDER):", margin + 5, 72);
    doc.setFont("helvetica", "bold");
    doc.text("KANPUR SHOES WALA", margin + 5, 77);
    doc.setFont("helvetica", "normal");
    doc.text("123, Shoe Street, Civil Lines,", margin + 5, 82);
    doc.text("Kanpur, Uttar Pradesh - 208001", margin + 5, 87);
    doc.text("Contact: +91 9988776655", margin + 5, 92);

    // Order Details
    doc.setLineWidth(0.2);
    doc.line(margin + 2, 100, 105 - margin - 2, 100);
    doc.setFont("helvetica", "bold");
    doc.text(`ORDER ID: #${order.id.toString().slice(-6).toUpperCase()}`, margin + 5, 108);
    doc.setFont("helvetica", "normal");
    doc.text(`Item: ${order.shoes?.name || "Premium Shoe"}`, margin + 5, 115);
    doc.text(`Date: ${new Date(order.created_at).toLocaleDateString()}`, margin + 5, 120);

    // Barcode Placeholder (Simple lines)
    doc.setLineWidth(1);
    for (let i = 0; i < 40; i += 2) {
      const h = Math.random() * 10 + 5;
      doc.line(margin + 10 + i, 135, margin + 10 + i, 135 - h);
    }
    doc.setFontSize(7);
    doc.text(order.id.toString().slice(-12), margin + 10, 140);

    // Fragile Instruction
    doc.rect(70, 125, 25, 15);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text("FRAGILE", 82.5, 132, { align: "center" });
    doc.setFontSize(6);
    doc.text("HANDLE WITH CARE", 82.5, 137, { align: "center" });

    doc.save(`shipping_label_${order.id}.pdf`);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setUploading(true);
    
    try {
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", UPLOAD_PRESET!);
        const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, { method: "POST", body: formData });
        const data = await res.json();
        return data.secure_url;
      });

      const urls = await Promise.all(uploadPromises);
      const validUrls = urls.filter(url => !!url);
      setImageUrls(prev => [...prev, ...validUrls]);
    } catch (err) {
      console.error("Upload error:", err);
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
        stock: stock,
        image_url: imageUrls[0],
        image_urls: imageUrls,
        created_at: new Date().toISOString()
      }]);
      if (error) throw error;
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      setName(""); setDescription(""); setDetailedDescription(""); setImageUrls([]); setPrice(""); setCategory("Premium Shoes"); setStock(10);
      fetchShoes();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (authLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;

  const CATEGORIES = ["Premium Shoes", "Sneakers", "Chelsea Boots", "Slides & Sandals", "Running & Sports", "Casual Wear"];

  return (
    <div className="min-h-screen bg-[#F9F9F9] p-6 sm:p-10 lg:p-20">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-center mb-12 gap-4">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-zinc-900">Malik Dashboard</h1>
            {fetchError && (
              <p className="text-xs text-red-500 mt-2 font-medium">⚠️ Error: {fetchError}</p>
            )}
          </div>
          <div className="flex items-center gap-3">
            {/* Manual Refresh Button */}
            <button
              onClick={() => fetchAnalytics(true)}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-full text-xs font-bold transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </button>
            {/* Live Visitors (real Presence count) */}
            <div className="px-4 py-2 bg-green-50 text-green-700 rounded-full text-xs font-bold flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Live: {analytics.liveVisitors}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-8">
            {/* New Product Form */}
            <div className="bg-white p-8 sm:p-12 rounded-[2.5rem] border border-zinc-100 shadow-sm">
              <h2 className="text-2xl font-black mb-8 flex items-center gap-3">
                <Plus className="w-6 h-6" />
                Add Premium Product
              </h2>
              {/* ── 2-Column Product Form ── */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Product Name *</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Kanpur Air V2" className="w-full px-5 py-4 bg-zinc-50 rounded-2xl border border-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900 transition-all text-sm font-medium" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Price (INR) *</label>
                  <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="799" className="w-full px-5 py-4 bg-zinc-50 rounded-2xl border border-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900 transition-all font-bold text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Category</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-5 py-4 bg-zinc-50 rounded-2xl border border-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900 transition-all font-bold text-sm appearance-none">
                    {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Initial Stock</label>
                  <input type="number" value={stock} onChange={(e) => setStock(parseInt(e.target.value))} className="w-full px-5 py-4 bg-zinc-50 rounded-2xl border border-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900 transition-all font-bold text-sm" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Short Tagline</label>
                  <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Handcrafted in Kanpur, premium leather..." className="w-full px-5 py-4 bg-zinc-50 rounded-2xl border border-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900 transition-all text-sm" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Detailed Description</label>
                  <textarea value={detailedDescription} onChange={(e) => setDetailedDescription(e.target.value)} rows={3} placeholder="Full product details, materials, care instructions..." className="w-full px-5 py-4 bg-zinc-50 rounded-2xl border border-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900 transition-all text-sm" />
                </div>

                {/* Image Upload + Instant Preview */}
                <div className="space-y-3 md:col-span-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Product Gallery *</label>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                    {imageUrls.map((url, i) => (
                      <div key={url} className="relative aspect-square rounded-xl overflow-hidden border-2 border-zinc-100 group">
                        <img src={url} alt={`Product ${i+1}`} className="w-full h-full object-cover" />
                        {i === 0 && <span className="absolute bottom-1 left-1 bg-zinc-900 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-md">Cover</span>}
                        <button onClick={() => removeImage(i)} className="absolute top-1.5 right-1.5 p-1 bg-white/95 text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"><Trash2 className="w-3 h-3" /></button>
                      </div>
                    ))}
                    <div className="relative aspect-square rounded-xl border-2 border-dashed border-zinc-200 flex flex-col items-center justify-center hover:border-zinc-400 hover:bg-zinc-50 cursor-pointer transition-all gap-1">
                      {uploading ? <Loader2 className="animate-spin w-5 h-5 text-zinc-400" /> : <><ImageIcon className="w-5 h-5 text-zinc-300" /><span className="text-[10px] text-zinc-400 font-bold">Upload</span></>}
                      <input type="file" accept="image/*" multiple onChange={handleImageUpload} disabled={uploading} className="absolute inset-0 opacity-0 cursor-pointer" />
                    </div>
                  </div>
                  {imageUrls.length === 0 && <p className="text-[11px] text-amber-600 font-medium">⚠ At least 1 image required before saving.</p>}
                </div>
              </div>

              <div className="pt-4">
                <button onClick={handleSaveProduct} disabled={saving || imageUrls.length === 0} className={`w-full py-5 rounded-2xl font-bold text-base flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed ${success ? 'bg-green-500 text-white shadow-lg shadow-green-100' : 'bg-zinc-900 text-white hover:bg-zinc-700 shadow-lg shadow-zinc-100'}`}>
                  {saving ? <Loader2 className="animate-spin w-5 h-5" /> : success ? <><Check className="w-5 h-5" /> Product Saved!</> : <><Package className="w-5 h-5" /> Save Product</>}
                </button>
              </div>
            </div>

            {/* Inventory Management */}
            <div className="bg-white p-8 sm:p-12 rounded-[2.5rem] border border-zinc-100 shadow-sm overflow-hidden">
              <h2 className="text-2xl font-black mb-8 flex items-center gap-3">
                <LayoutGrid className="w-6 h-6" />
                Manage Inventory
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-xs font-bold uppercase text-zinc-400 border-b border-zinc-50">
                      <th className="pb-4 pr-4">Product</th>
                      <th className="pb-4 px-4">Price</th>
                      <th className="pb-4 px-4">Stock</th>
                      <th className="pb-4 pl-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-50">
                    {loadingShoes ? (
                      <tr><td colSpan={4} className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-zinc-200" /></td></tr>
                    ) : shoesList.map((shoe) => (
                      <tr key={shoe.id} className="group hover:bg-zinc-50/50 transition-colors">
                        <td className="py-6 pr-4"><div className="flex items-center gap-4"><div className="w-12 h-12 bg-zinc-50 rounded-xl overflow-hidden border border-zinc-100"><img src={shoe.image_url} className="w-full h-full object-cover" /></div><div><p className="font-bold text-sm text-zinc-900">{shoe.name}</p><p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{shoe.category}</p></div></div></td>
                        <td className="py-6 px-4 font-bold text-sm">₹{shoe.price}</td>
                        <td className="py-6 px-4"><div className="flex items-center gap-3"><button onClick={() => handleUpdateStock(shoe.id, shoe.stock, -1)} className="p-1.5 bg-zinc-100 hover:bg-zinc-200 rounded-lg text-zinc-500 transition-all"><Minus className="w-3.5 h-3.5" /></button><span className={`text-sm font-black w-8 text-center ${shoe.stock < 5 ? "text-red-500" : "text-zinc-900"}`}>{shoe.stock}</span><button onClick={() => handleUpdateStock(shoe.id, shoe.stock, 1)} className="p-1.5 bg-zinc-100 hover:bg-zinc-200 rounded-lg text-zinc-500 transition-all"><Plus className="w-3.5 h-3.5" /></button></div></td>
                        <td className="py-6 pl-4 text-right"><button onClick={() => setDeleteId(shoe.id)} className="p-3 text-zinc-300 hover:text-red-500 transition-all"><Trash2 className="w-5 h-5" /></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Orders Management */}
            <div className="bg-white p-8 sm:p-12 rounded-[2.5rem] border border-zinc-100 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black flex items-center gap-3">
                  <ShoppingCart className="w-6 h-6" />
                  Orders & Logistics
                </h2>
                <span className="text-xs font-bold text-zinc-400 bg-zinc-50 px-3 py-1.5 rounded-full">{ordersList.length} total</span>
              </div>
              {loadingOrders ? (
                <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin text-zinc-200" /></div>
              ) : ordersList.length === 0 ? (
                <div className="text-center py-24 bg-zinc-50 rounded-3xl">
                  <ShoppingCart className="w-10 h-10 text-zinc-200 mx-auto mb-4" />
                  <p className="font-bold text-zinc-400">No orders found yet.</p>
                  <p className="text-xs text-zinc-300 mt-1">Orders will appear here once customers start purchasing.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-[10px] font-black uppercase tracking-widest text-zinc-400 border-b border-zinc-100">
                        <th className="pb-5 pr-4">Order</th>
                        <th className="pb-5 px-4">Customer</th>
                        <th className="pb-5 px-4">Amount</th>
                        <th className="pb-5 px-4">Status</th>
                        <th className="pb-5 pl-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-50">
                      {ordersList.map((order) => (
                        <tr key={order.id} className="group hover:bg-zinc-50/30 transition-colors">
                          <td className="py-5 pr-4">
                            <p className="font-bold text-sm text-zinc-900 leading-tight">{order.shoes?.name || 'Premium Shoe'}</p>
                            <p className="text-[10px] font-black text-zinc-300 uppercase tracking-widest mt-1">#{order.id.toString().slice(-6).toUpperCase()}</p>
                          </td>
                          <td className="py-5 px-4">
                            <p className="text-xs font-bold text-zinc-800 flex items-center gap-1"><User className="w-3 h-3 text-zinc-300" /> {order.customer_name}</p>
                            <p className="text-[10px] text-zinc-400 mt-0.5 flex items-center gap-1"><MapPin className="w-3 h-3" /> {order.city || 'Kanpur'}, {order.pincode}</p>
                            <p className="text-[10px] text-zinc-400 mt-0.5 flex items-center gap-1"><Phone className="w-3 h-3" /> {order.phone || 'N/A'}</p>
                          </td>
                          <td className="py-5 px-4">
                            <span className="text-base font-black text-zinc-900">₹{Number(order.amount).toLocaleString()}</span>
                          </td>
                          <td className="py-5 px-4">
                            <button
                              onClick={async () => {
                                const newStatus = order.status === 'success' ? 'pending' : 'success';
                                await supabase.from('orders').update({ status: newStatus }).eq('id', order.id);
                                setOrdersList(prev => prev.map(o => o.id === order.id ? { ...o, status: newStatus } : o));
                              }}
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border transition-all hover:scale-105 ${
                                order.status === 'success'
                                  ? 'bg-green-50 text-green-700 border-green-100 hover:bg-green-100'
                                  : 'bg-amber-50 text-amber-700 border-amber-100 hover:bg-amber-100'
                              }`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${order.status === 'success' ? 'bg-green-500' : 'bg-amber-500'}`} />
                              {order.status === 'success' ? 'Completed' : 'Pending'}
                            </button>
                          </td>
                          <td className="py-5 pl-4 text-right">
                            <button
                              onClick={() => generateShippingLabel(order)}
                              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-zinc-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-[#FF4F00] transition-all duration-300"
                            >
                              <Printer className="w-3.5 h-3.5" /> Label
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Analytics Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Stats Card — fixed white labels */}
            <div className="bg-zinc-900 p-8 rounded-[2.5rem] text-white">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-2">Total Revenue</p>
              <h2 className="text-5xl font-black text-white mb-8 tracking-tight">₹{analytics.totalRevenue.toLocaleString()}</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 bg-white/10 rounded-2xl flex flex-col gap-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-300">Orders</p>
                  <p className="text-3xl font-black text-white">{analytics.totalOrders}</p>
                </div>
                <div className="p-5 bg-white/10 rounded-2xl flex flex-col gap-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-300">Live Now</p>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <p className="text-3xl font-black text-white">{analytics.liveVisitors}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Store Status */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-zinc-100 shadow-sm">
              <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-5">Store Status</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-1">
                  <span className="text-sm font-medium text-zinc-600">Total Products</span>
                  <span className="text-sm font-black text-zinc-900">{shoesList.length}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-sm font-medium text-zinc-600">Low Stock (&lt;5)</span>
                  <span className={`text-sm font-black ${shoesList.filter(s => s.stock < 5).length > 0 ? 'text-red-500' : 'text-green-600'}`}>
                    {shoesList.filter(s => s.stock < 5).length}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-sm font-medium text-zinc-600">Pending Orders</span>
                  <span className="text-sm font-black text-amber-600">
                    {ordersList.filter(o => o.status !== 'success').length}
                  </span>
                </div>
              </div>
            </div>

            {/* Logistics Instructions — preserved & polished */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-zinc-100 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <Printer className="w-4 h-4 text-zinc-400" />
                <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400">Logistics Instructions</h3>
              </div>
              <ul className="space-y-4">
                {[
                  'Print labels on A6 thermal paper for best results.',
                  'Paste label flat & securely on the top of the box.',
                  'Mark FRAGILE on leather shoe boxes before dispatch.',
                  'Double-check customer phone & PIN before sealing.'
                ].map((tip, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-green-500" />
                    </div>
                    <span className="text-xs text-zinc-500 leading-relaxed font-medium">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteId && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-zinc-900/40 backdrop-blur-sm flex items-center justify-center p-6">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-white p-10 rounded-[3rem] max-w-sm w-full text-center shadow-2xl">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6"><Trash2 className="w-8 h-8" /></div>
              <h3 className="text-xl font-bold mb-4">Are you sure?</h3>
              <p className="text-zinc-500 text-sm mb-8">This will permanently remove this shoe from Kanpur Shoes Wala.</p>
              <div className="flex gap-4"><button onClick={() => setDeleteId(null)} className="flex-1 py-4 bg-zinc-100 text-zinc-900 rounded-full font-bold text-sm">Cancel</button><button onClick={() => handleDeleteProduct(deleteId)} className="flex-1 py-4 bg-red-500 text-white rounded-full font-bold text-sm">Delete</button></div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
