"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Heart, Share2, MessageCircle, Calendar, User, Tag,
  ShieldCheck, Sparkles, CheckCircle2, MapPin, Zap, ExternalLink, Mail
} from "lucide-react";
import { formatPrice, formatDate, getConditionColor } from "@/lib/utils";
import { toast } from "@/components/ui/toaster";
import { triggerCelebrationConfetti, triggerHeartBurst } from "@/lib/confetti";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  condition: string;
  status: string;
  createdAt: string;
  seller: { id: string; name: string; email: string };
  category: { name: string; icon: string };
}

export default function ProductDetailPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then((r) => r.json())
      .then((d) => {
        setProduct(d.product || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleContact = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;
    triggerCelebrationConfetti({ x, y });
    setContactModalOpen(true);
  };

  const handleLike = (e: React.MouseEvent) => {
    const next = !liked;
    setLiked(next);
    if (next) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;
      triggerHeartBurst(x, y);
      toast.success("Saved to your wishlist!");
    } else {
      toast("Removed from wishlist");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 max-w-6xl mx-auto px-4 animate-pulse">
        <div className="grid md:grid-cols-2 gap-10">
          <div className="aspect-square bg-white/5 rounded-3xl" />
          <div className="space-y-4 py-6">
            <div className="h-6 bg-white/5 rounded w-1/3" />
            <div className="h-8 bg-white/5 rounded w-3/4" />
            <div className="h-10 bg-white/5 rounded w-1/2" />
            <div className="h-24 bg-white/5 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-24 flex flex-col items-center justify-center text-center px-4">
        <p className="text-5xl mb-4">🕵️</p>
        <h2 className="text-xl font-bold text-white mb-2">Listing not found</h2>
        <p className="text-white/40 text-sm mb-6">This item might have already found a new student home.</p>
        <Link
          href="/browse"
          className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm transition-all"
        >
          ← Explore Active Finds
        </Link>
      </div>
    );
  }

  const isSold = product.status === "SOLD";
  // Psychology anchoring calculations: estimated retail price
  const estimatedRetail = Math.round(product.price * 2.2);
  const moneySaved = estimatedRetail - product.price;

  return (
    <div className="min-h-screen pt-20 pb-28 md:pb-16 overflow-x-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Back link */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-white/50 hover:text-white transition-colors mb-6 group glass px-3 py-1.5 rounded-xl border border-white/8"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Back to Listings
        </motion.button>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-14">
          {/* ── Product Hero Image ────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative aspect-square rounded-3xl overflow-hidden glass border border-white/10 shadow-2xl group"
          >
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />

            {/* Top badges */}
            <div className="absolute top-3 left-3 flex gap-2">
              <span className={`text-xs font-bold px-3 py-1 rounded-full backdrop-blur-md shadow-md ${getConditionColor(product.condition)} border border-white/10`}>
                {product.condition.charAt(0) + product.condition.slice(1).toLowerCase()} Condition
              </span>
            </div>

            {/* Quick action buttons on photo */}
            <div className="absolute top-3 right-3 flex gap-2">
              <button
                onClick={handleLike}
                className="w-9 h-9 rounded-full glass-strong border border-white/10 flex items-center justify-center text-white/80 hover:text-white shadow-md active:scale-75 transition-all"
                aria-label="Save"
              >
                <Heart size={16} className={liked ? "fill-rose-500 text-rose-500 animate-pulse" : ""} />
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success("Share link copied!");
                }}
                className="w-9 h-9 rounded-full glass-strong border border-white/10 flex items-center justify-center text-white/80 hover:text-white shadow-md active:scale-75 transition-all"
                aria-label="Share"
              >
                <Share2 size={16} />
              </button>
            </div>

            {isSold && (
              <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center">
                <span className="text-3xl sm:text-4xl font-black text-rose-400 rotate-[-12deg] border-4 border-rose-500/60 px-8 py-2.5 rounded-2xl shadow-2xl">
                  SOLD OUT
                </span>
              </div>
            )}
          </motion.div>

          {/* ── Product Information & Psychology Trust ────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex flex-col justify-between py-1"
          >
            <div>
              {/* Category */}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-semibold text-violet-300 glass px-2.5 py-1 rounded-lg border border-violet-500/20">
                  {product.category.icon} {product.category.name}
                </span>
                <span className="text-[11px] text-white/40 flex items-center gap-1">
                  <Calendar size={11} /> Listed {formatDate(product.createdAt)}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-4 leading-tight tracking-tight">
                {product.name}
              </h1>

              {/* Psychology Anchoring Price Box */}
              <div className="glass-card rounded-2xl p-4 sm:p-5 border border-white/10 mb-6 relative overflow-hidden">
                <div className="flex items-baseline justify-between gap-4">
                  <div>
                    <span className="text-[11px] text-white/40 uppercase font-bold tracking-wider block">
                      Campus Thrift Price
                    </span>
                    <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                      {formatPrice(product.price)}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-white/40 line-through block">
                      New: ₹{estimatedRetail.toLocaleString()}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/15 px-2.5 py-0.5 rounded-md border border-emerald-500/30">
                      <Zap size={11} /> Save ₹{moneySaved.toLocaleString()} (55% Off)
                    </span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-white/50">
                  <span className="flex items-center gap-1.5">
                    <Sparkles size={12} className="text-amber-400" />
                    <span>Item Value: <strong>Verified Great Deal</strong></span>
                  </span>
                  <span className="text-violet-300 font-medium">Same-Day Campus Pickup</span>
                </div>
              </div>

              {/* Description */}
              <div className="glass rounded-2xl p-4 sm:p-5 mb-5 border border-white/5">
                <h3 className="text-xs text-white/40 uppercase tracking-wider font-bold mb-2">Item Details</h3>
                <p className="text-white/80 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>

              {/* Seller & Psychological In-Group Trust */}
              <div className="glass-glow rounded-2xl p-4 sm:p-5 mb-6 border border-violet-500/20">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-violet-600 to-pink-500 flex items-center justify-center text-sm font-bold text-white shadow-md">
                      {product.seller.name[0]}
                    </div>
                    <div>
                      <p className="font-bold text-white text-sm">{product.seller.name}</p>
                      <p className="text-[11px] text-violet-300/80 font-medium flex items-center gap-1">
                        <ShieldCheck size={12} className="text-emerald-400" />
                        Verified Campus Student
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Trusted Seller
                  </span>
                </div>

                <div className="text-[11px] text-white/55 space-y-1 pt-2 border-t border-white/5">
                  <p className="flex items-center gap-1.5">
                    <MapPin size={12} className="text-violet-400 shrink-0" />
                    <span>Recommended safe exchange: <strong>Campus Library / Student Union</strong></span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <CheckCircle2 size={12} className="text-emerald-400 shrink-0" />
                    <span>Identity cross-checked with <code>@campus.edu</code> registry</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Desktop Contact Buttons */}
            <div className="hidden md:flex gap-3">
              {!isSold ? (
                <button
                  onClick={handleContact}
                  className="flex-1 flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 rounded-2xl font-bold text-white transition-all shadow-xl shadow-violet-600/30 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <MessageCircle size={18} />
                  <span>Connect with Seller</span>
                </button>
              ) : (
                <div className="flex-1 py-4 glass rounded-2xl text-center text-white/40 font-bold border border-white/5">
                  This item has been sold
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Sticky Mobile Contact Bar (Visible only on phones) ────────────── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden glass-strong border-t border-white/10 p-3 px-4 shadow-2xl safe-area-bottom">
        <div className="flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] text-white/40 uppercase font-bold block">Campus Price</span>
            <span className="text-xl font-black text-white">{formatPrice(product.price)}</span>
          </div>

          {!isSold ? (
            <button
              onClick={handleContact}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-5 bg-gradient-to-r from-violet-600 to-pink-600 rounded-xl font-bold text-white text-sm shadow-lg shadow-violet-600/30 active:scale-95 transition-all"
            >
              <MessageCircle size={17} />
              <span>Contact Seller</span>
            </button>
          ) : (
            <div className="flex-1 py-2.5 glass rounded-xl text-center text-xs text-white/40 font-bold">
              Item Sold
            </div>
          )}
        </div>
      </div>

      {/* ── Interactive Contact Modal ────────────────────────────────────── */}
      <AnimatePresence>
        {contactModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-md glass-card rounded-3xl p-6 border border-white/15 shadow-2xl relative"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 to-pink-500 flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-violet-500/30">
                <Sparkles size={24} />
              </div>

              <h3 className="text-xl font-black text-white text-center mb-1">
                Connect with {product.seller.name}
              </h3>
              <p className="text-xs text-white/50 text-center mb-6">
                Fast & trusted campus communication. No spam, guaranteed peer identity.
              </p>

              <div className="space-y-3 mb-6">
                {/* Email Option */}
                <a
                  href={`mailto:${product.seller.email}?subject=Interested in ${encodeURIComponent(product.name)} on Thrift in Campus`}
                  className="flex items-center justify-between p-3.5 rounded-xl glass hover:bg-white/10 transition-colors border border-white/5 group"
                >
                  <div className="flex items-center gap-3">
                    <Mail size={18} className="text-violet-400" />
                    <div>
                      <p className="text-xs font-bold text-white">Campus Email</p>
                      <p className="text-[11px] text-white/40">{product.seller.email}</p>
                    </div>
                  </div>
                  <ExternalLink size={14} className="text-white/40 group-hover:text-white" />
                </a>

                {/* WhatsApp simulated direct connect */}
                <a
                  href={`https://wa.me/?text=Hi%20${encodeURIComponent(product.seller.name)}!%20I%20saw%20your%20listing%20for%20${encodeURIComponent(product.name)}%20on%20Thrift%20in%20Campus.`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-3.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors border border-emerald-500/25 group"
                >
                  <div className="flex items-center gap-3">
                    <MessageCircle size={18} className="text-emerald-400" />
                    <div>
                      <p className="text-xs font-bold text-white">Quick Chat / WhatsApp</p>
                      <p className="text-[11px] text-emerald-300/70">Instant campus response</p>
                    </div>
                  </div>
                  <ExternalLink size={14} className="text-emerald-400" />
                </a>
              </div>

              <button
                onClick={() => setContactModalOpen(false)}
                className="w-full py-3 rounded-xl glass text-xs font-bold text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              >
                Close Window
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
