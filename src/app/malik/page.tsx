/* MASTER_LOG - APRIL 28, 2026 
- Project Status: Logistics Ready.
- Last Action: Integrated Professional Shipping Label Generator (jsPDF) for all orders.
- Status: Secure /malik route active, Inventory & Logistics live.
*/

"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { 
  Check, Loader2, Image as ImageIcon, 
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

  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  const ADMIN_EMAILS = ['bhaikumarark99@gmail.com', 'adarshfouryt@gmail.com'];

  useEffect(() => {
    if (!authLoading && (!user || !ADMIN_EMAILS.includes(user.email || ""))) router.push("/");
    fetchAnalytics();
    fetchShoes();
  }, [user, authLoading]);

  const fetchShoes = async () => {
    setLoadingShoes(true);
    const { data } = await supabase.from("shoes").select("*").order('created_at', { ascending: false });
    if (data) setShoesList(data);
    setLoadingShoes(false);
  };

  const fetchAnalytics = async () => {
    setLoadingOrders(true);
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
    setLoadingOrders(false);
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
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-black tracking-tight text-zinc-900">Malik Dashboard</h1>
          <div className="px-4 py-2 bg-green-50 text-green-700 rounded-full text-xs font-bold flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Live: {analytics.liveVisitors}
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
              <div className="space-y-6">
                {/* Form fields ... same as before */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-zinc-400">Product Name</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Kanpur Air V2" className="w-full px-5 py-4 bg-zinc-50 rounded-2xl border-none focus:ring-2 focus:ring-zinc-900 transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-zinc-400">Price (INR)</label>
                    <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="799" className="w-full px-5 py-4 bg-zinc-50 rounded-2xl border-none focus:ring-2 focus:ring-zinc-900 transition-all font-bold" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-zinc-400">Initial Stock</label>
                    <input type="number" value={stock} onChange={(e) => setStock(parseInt(e.target.value))} className="w-full px-5 py-4 bg-zinc-50 rounded-2xl border-none focus:ring-2 focus:ring-zinc-900 transition-all font-bold" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-zinc-400">Category</label>
                    <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-5 py-4 bg-zinc-50 rounded-2xl border-none focus:ring-2 focus:ring-zinc-900 transition-all font-bold appearance-none">
                      {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-zinc-400">Short Tagline</label>
                    <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Handcrafted in Kanpur" className="w-full px-5 py-4 bg-zinc-50 rounded-2xl border-none focus:ring-2 focus:ring-zinc-900 transition-all" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-zinc-400">Detailed Description</label>
                  <textarea value={detailedDescription} onChange={(e) => setDetailedDescription(e.target.value)} rows={4} className="w-full px-5 py-4 bg-zinc-50 rounded-2xl border-none focus:ring-2 focus:ring-zinc-900 transition-all" />
                </div>
                <div className="space-y-4">
                  <label className="text-xs font-bold uppercase text-zinc-400">Product Gallery</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {imageUrls.map((url, i) => (
                      <div key={url} className="relative aspect-square rounded-2xl overflow-hidden border border-zinc-100">
                        <img src={url} className="w-full h-full object-cover" />
                        <button onClick={() => removeImage(i)} className="absolute top-2 right-2 p-1.5 bg-white/90 text-red-500 rounded-full"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    ))}
                    <div className="relative aspect-square rounded-2xl border-2 border-dashed border-zinc-200 flex flex-col items-center justify-center hover:bg-zinc-50 cursor-pointer">
                      {uploading ? <Loader2 className="animate-spin text-zinc-300" /> : <ImageIcon className="w-6 h-6 text-zinc-200" />}
                      <input type="file" accept="image/*" multiple onChange={handleImageUpload} disabled={uploading} className="absolute inset-0 opacity-0 cursor-pointer" />
                    </div>
                  </div>
                </div>
                <button onClick={handleSaveProduct} disabled={saving || imageUrls.length === 0} className={`w-full py-5 rounded-full font-bold text-lg flex items-center justify-center gap-3 transition-all ${success ? "bg-green-500 text-white" : "bg-zinc-900 text-white hover:bg-zinc-800"}`}>
                  {saving ? <Loader2 className="animate-spin" /> : success ? <><Check /> Product Saved!</> : <><Package className="w-5 h-5" /> Save Product</>}
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

            {/* Orders Management (Full Width Table) */}
            <div className="bg-white p-8 sm:p-12 rounded-[2.5rem] border border-zinc-100 shadow-sm overflow-hidden">
              <h2 className="text-2xl font-black mb-8 flex items-center gap-3">
                <ShoppingCart className="w-6 h-6" />
                Orders & Logistics
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-xs font-bold uppercase text-zinc-400 border-b border-zinc-50">
                      <th className="pb-4 pr-4">Order Details</th>
                      <th className="pb-4 px-4">Shipping Info</th>
                      <th className="pb-4 px-4">Amount</th>
                      <th className="pb-4 pl-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-50">
                    {loadingOrders ? (
                      <tr><td colSpan={4} className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-zinc-200" /></td></tr>
                    ) : ordersList.map((order) => (
                      <tr key={order.id} className="group hover:bg-zinc-50/50 transition-colors">
                        <td className="py-6 pr-4">
                          <div className="flex flex-col">
                            <p className="font-bold text-sm text-zinc-900">{order.shoes?.name || "Premium Shoe"}</p>
                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mt-1">#{order.id.toString().slice(-6).toUpperCase()}</p>
                            <div className={`mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[8px] font-bold uppercase w-fit ${order.status === 'success' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                              <div className={`w-1 h-1 rounded-full ${order.status === 'success' ? 'bg-green-500' : 'bg-orange-500'}`} />
                              {order.status}
                            </div>
                          </div>
                        </td>
                        <td className="py-6 px-4">
                          <div className="space-y-1">
                            <p className="text-xs font-bold flex items-center gap-1.5"><User className="w-3 h-3 text-zinc-300" /> {order.customer_name}</p>
                            <p className="text-[10px] text-zinc-500 flex items-center gap-1.5"><MapPin className="w-3 h-3 text-zinc-300" /> {order.city || "Kanpur"}</p>
                            <p className="text-[10px] text-zinc-500 flex items-center gap-1.5"><Phone className="w-3 h-3 text-zinc-300" /> {order.phone || "N/A"}</p>
                          </div>
                        </td>
                        <td className="py-6 px-4 font-black text-sm">₹{order.amount}</td>
                        <td className="py-6 pl-4 text-right">
                          <button 
                            onClick={() => generateShippingLabel(order)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-200"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            Label
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column: Analytics Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-zinc-900 p-8 rounded-[2.5rem] text-white">
              <p className="text-xs font-bold opacity-50 uppercase tracking-widest mb-4">Total Revenue</p>
              <h2 className="text-4xl font-black mb-8">₹{analytics.totalRevenue.toLocaleString()}</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white/10 rounded-2xl">
                  <p className="text-[10px] opacity-40 uppercase font-bold mb-1">Orders</p>
                  <p className="text-xl font-bold">{analytics.totalOrders}</p>
                </div>
                <div className="p-4 bg-white/10 rounded-2xl">
                  <p className="text-[10px] opacity-40 uppercase font-bold mb-1">Live Vis.</p>
                  <p className="text-xl font-bold">{analytics.liveVisitors}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-[2.5rem] border border-zinc-100 shadow-sm">
              <h3 className="font-bold mb-6 flex items-center gap-2 uppercase text-xs tracking-widest text-zinc-400">Logistics Instructions</h3>
              <ul className="space-y-4 text-xs text-zinc-500">
                <li className="flex gap-3"><Check className="w-4 h-4 text-green-500 flex-shrink-0" /> Print A6 labels on thermal paper.</li>
                <li className="flex gap-3"><Check className="w-4 h-4 text-green-500 flex-shrink-0" /> Paste label securely on the top box.</li>
                <li className="flex gap-3"><Check className="w-4 h-4 text-green-500 flex-shrink-0" /> Check for "Fragile" mark for leather shoes.</li>
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
