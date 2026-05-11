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
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [success, setSuccess] = useState(false);

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("product_id", productId)
        .order("created_at", { ascending: false });

      if (error) {
        // If table doesn't exist, we don't want to spam console errors in production
        if (error.code === "PGRST205") {
          console.warn("Reviews table not found. Please create the 'reviews' table in Supabase.");
          setReviews([]);
          return;
        }
        throw error;
      }
      setReviews(data || []);
    } catch (err: any) {
      console.error("Error fetching reviews:", err.message || err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

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

  // Rating distribution
  const dist = [5, 4, 3, 2, 1].map((s) => ({
    star: s,
    count: reviews.filter((r) => r.rating === s).length,
    pct: reviews.length > 0 ? (reviews.filter((r) => r.rating === s).length / reviews.length) * 100 : 0,
  }));

  return (
    <div className="py-16 border-t border-[#efefef]">
      <div className="flex flex-col lg:flex-row gap-16">

        {/* Left: Summary & Form */}
        <div className="lg:w-[340px] shrink-0 space-y-8">
          <div>
            <h2 className="text-[22px] font-black tracking-tight text-black mb-5">Customer Reviews</h2>

            {/* Big rating */}
            <div className="flex items-end gap-4 mb-4">
              <span className="text-[48px] font-black leading-none text-black">{averageRating}</span>
              <div className="pb-2">
                <div className="flex gap-0.5 mb-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-4 h-4 ${Number(averageRating) >= s ? "star-filled" : "star-empty"}`}
                    />
                  ))}
                </div>
                <p className="text-[12px] text-[#999]">Based on {reviews.length} reviews</p>
              </div>
            </div>

            {/* Distribution bars */}
            <div className="space-y-2">
              {dist.map(({ star, count, pct }) => (
                <div key={star} className="flex items-center gap-2.5">
                  <span className="text-[11px] font-bold text-[#555] w-4 shrink-0">{star}</span>
                  <Star className="w-3 h-3 star-filled shrink-0" />
                  <div className="flex-1 h-1.5 bg-[#f0f0f0] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-black rounded-full transition-all duration-700"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-[11px] text-[#999] w-4 text-right">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Review Form */}
          {user ? (
            <div className="bg-[#f7f7f7] p-6 rounded-[18px]">
              <h3 className="text-[15px] font-bold mb-5 text-black">Write a Review</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#999] mb-2">Your Rating</p>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onMouseEnter={() => setHoverRating(s)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(s)}
                        className="hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-6 h-6 transition-all ${
                            (hoverRating || rating) >= s ? "star-filled" : "star-empty"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <textarea
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience with these shoes..."
                  className="w-full px-4 py-3.5 bg-white border border-[#e5e5e5] rounded-[12px] focus:outline-none focus:border-black transition-all text-[13px] h-28 resize-none text-black placeholder:text-[#aaa]"
                />
                <button
                  disabled={submitting}
                  className="w-full btn-pill btn-pill-dark py-3.5 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <Loader2 className="animate-spin w-4 h-4" />
                  ) : success ? (
                    <><CheckCircle2 className="w-4 h-4" /> Posted!</>
                  ) : (
                    "Post Review"
                  )}
                </button>
              </form>
            </div>
          ) : (
            <div className="bg-[#f7f7f7] p-6 rounded-[18px] text-center">
              <MessageSquare className="w-8 h-8 text-[#ccc] mx-auto mb-3" />
              <p className="text-[13px] text-[#777]">Sign in to share your review with the community.</p>
            </div>
          )}
        </div>

        {/* Right: Reviews List */}
        <div className="flex-1 space-y-8">
          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="animate-spin text-[#ccc]" />
            </div>
          ) : reviews.length > 0 ? (
            <div className="divide-y divide-[#efefef]">
              {reviews.map((review) => (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={review.id}
                  className="py-6 space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-[#f0f0f0] rounded-full flex items-center justify-center text-[#999]">
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-[13px] font-bold text-black">{review.user_email.split("@")[0]}</p>
                        <p className="text-[10px] text-[#aaa] font-medium">
                          {new Date(review.created_at).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3.5 h-3.5 ${review.rating >= s ? "star-filled" : "star-empty"}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-[13px] text-[#555] leading-relaxed">{review.comment}</p>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-[#ccc]">
              <p className="text-[14px] font-medium text-[#aaa]">No reviews yet. Be the first!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
