/* MASTER_LOG - APRIL 28, 2026 
- Project Status: Advanced E-commerce - Social Proof.
- Last Action: Integrated Customer Reviews & Ratings system.
- Pending Tasks: Admin moderation for reviews.
*/

"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { Star, User, Loader2, CheckCircle2, MessageSquare } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface Review {
  id: string;
  user_id: string;
  rating: number;
  comment: string;
  created_at: string;
  user_email: string;
}

interface ReviewSectionProps {
  productId: string;
}

export default function ReviewSection({ productId }: ReviewSectionProps) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("product_id", productId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return alert("Please sign in to leave a review.");
    
    setSubmitting(true);
    try {
      const { error } = await supabase.from("reviews").insert([{
        product_id: productId,
        user_id: user.id,
        user_email: user.email,
        rating,
        comment,
      }]);

      if (error) throw error;
      
      setSuccess(true);
      setComment("");
      setRating(5);
      fetchReviews();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : "0";

  return (
    <div className="py-20 border-t border-zinc-100">
      <div className="flex flex-col lg:flex-row gap-20">
        {/* Left: Summary & Stats */}
        <div className="lg:w-1/3 space-y-8">
          <div>
            <h2 className="text-3xl font-black text-zinc-900 tracking-tight mb-2">Customer Reviews</h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star 
                    key={s} 
                    className={`w-5 h-5 ${Number(averageRating) >= s ? "fill-zinc-900 text-zinc-900" : "text-zinc-200"}`} 
                  />
                ))}
              </div>
              <span className="text-lg font-bold">{averageRating} out of 5</span>
            </div>
            <p className="text-zinc-500 text-sm mt-4">Based on {reviews.length} total reviews.</p>
          </div>

          {/* Review Form */}
          {user ? (
            <div className="bg-zinc-50 p-8 rounded-[2rem] border border-zinc-100">
              <h3 className="text-lg font-bold mb-6">Write a Review</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button 
                      key={s} 
                      type="button"
                      onClick={() => setRating(s)}
                      className="hover:scale-110 transition-transform"
                    >
                      <Star className={`w-6 h-6 ${rating >= s ? "fill-zinc-900 text-zinc-900" : "text-zinc-300"}`} />
                    </button>
                  ))}
                </div>
                <textarea 
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience with these shoes..."
                  className="w-full px-5 py-4 bg-white border border-zinc-100 rounded-2xl focus:ring-2 focus:ring-zinc-900 transition-all text-sm h-32 resize-none"
                />
                <button 
                  disabled={submitting}
                  className="w-full py-4 bg-zinc-900 text-white rounded-full font-bold text-sm hover:bg-zinc-800 transition-all flex items-center justify-center gap-2"
                >
                  {submitting ? <Loader2 className="animate-spin w-4 h-4" /> : success ? <><CheckCircle2 className="w-4 h-4" /> Posted!</> : "Post Review"}
                </button>
              </form>
            </div>
          ) : (
            <div className="bg-zinc-50 p-8 rounded-[2rem] text-center">
              <MessageSquare className="w-8 h-8 text-zinc-300 mx-auto mb-4" />
              <p className="text-sm text-zinc-500 font-medium">Please sign in to share your review with the community.</p>
            </div>
          )}
        </div>

        {/* Right: Reviews List */}
        <div className="lg:w-2/3 space-y-10">
          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="animate-spin text-zinc-200" /></div>
          ) : reviews.length > 0 ? (
            <div className="grid gap-10">
              {reviews.map((review) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={review.id} 
                  className="space-y-4"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center text-zinc-400">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-zinc-900">{review.user_email.split('@')[0]}</p>
                        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">{new Date(review.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className={`w-3 h-3 ${review.rating >= s ? "fill-zinc-900 text-zinc-900" : "text-zinc-200"}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-zinc-600 leading-relaxed text-sm pl-1">{review.comment}</p>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-zinc-300">
              <p className="text-sm font-medium italic">No reviews yet. Be the first to share your thoughts!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
