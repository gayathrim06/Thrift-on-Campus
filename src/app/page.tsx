"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, TrendingUp, Shield, Zap, HeartHandshake, CheckCircle2, Camera, MapPin, BadgeCheck } from "lucide-react";
import ProductCard, { ProductCardSkeleton } from "@/components/marketplace/product-card";
import { triggerCelebrationConfetti } from "@/lib/confetti";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  condition: string;
  createdAt: string;
  seller: { name: string };
  category: { name: string; icon: string };
}

const categories = [
  { name: "Electronics", icon: "📱", color: "from-indigo-500/20 to-blue-500/10", border: "border-indigo-500/25" },
  { name: "Clothing", icon: "👕", color: "from-purple-500/20 to-pink-500/10", border: "border-purple-500/25" },
  { name: "Books", icon: "📚", color: "from-blue-500/20 to-cyan-500/10", border: "border-blue-500/25" },
  { name: "Bags", icon: "🎒", color: "from-emerald-500/20 to-teal-500/10", border: "border-emerald-500/25" },
  { name: "Hostel", icon: "🏠", color: "from-violet-500/20 to-indigo-500/10", border: "border-violet-500/25" },
  { name: "Sports", icon: "⚽", color: "from-rose-500/20 to-pink-500/10", border: "border-rose-500/25" },
  { name: "Entertainment", icon: "🎮", color: "from-fuchsia-500/20 to-purple-500/10", border: "border-fuchsia-500/25" },
  { name: "Miscellaneous", icon: "📦", color: "from-slate-500/20 to-gray-500/10", border: "border-slate-500/25" },
];

const stats = [
  { label: "Campus Items Listed", value: "2,400+", icon: "📦" },
  { label: "Students Connected", value: "850+", icon: "🎓" },
  { label: "Student Money Saved", value: "₹14.2L", icon: "💸" },
  { label: "Verified Safety Score", value: "99.4%", icon: "🛡️" },
];

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products?status=APPROVED&sort=newest")
      .then((r) => r.json())
      .then((d) => {
        setProducts(d.products?.slice(0, 8) || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleHeroBurst = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;
    triggerCelebrationConfetti({ x, y });
  };

  return (
    <div className="pb-24 md:pb-12 overflow-x-hidden">
      {/* ── Hero Section ─────────────────────────────────────────────────── */}
      <section className="relative min-h-[88vh] sm:min-h-[90vh] flex items-center justify-center overflow-hidden pt-24 sm:pt-28 pb-12">
        {/* Ambient Glows — static on mobile, animated on desktop */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]">
          {/* Static mobile fallbacks rendered via CSS, animated only on md+ */}
          <div className="absolute -top-32 -left-32 w-64 sm:w-[420px] h-64 sm:h-[420px] rounded-full blur-[70px] sm:blur-[100px] bg-indigo-600/25 hidden sm:block" />
          <div className="absolute -bottom-32 -right-32 w-64 sm:w-[420px] h-64 sm:h-[420px] rounded-full blur-[70px] sm:blur-[100px] bg-violet-600/20 hidden sm:block" />
          {/* Mobile-only: simple static glow, no animation */}
          <div className="absolute inset-0 sm:hidden" style={{ background: "radial-gradient(ellipse 80% 60% at 50% 20%, rgba(99,102,241,0.18) 0%, transparent 70%)" }} />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center z-10">
          {/* Subtle dark fade aura behind text */}
          <div className="absolute inset-0 max-w-2xl mx-auto -z-10 rounded-full bg-black/40 blur-3xl pointer-events-none" />

          {/* Eyebrow Pill */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            onClick={handleHeroBurst}
            className="cursor-pointer inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-xs sm:text-sm text-sky-300 mb-6 border border-sky-500/30 hover:border-sky-400/50 transition-colors shadow-lg shadow-sky-950/40 active:scale-95"
          >
            <Sparkles size={14} className="text-sky-400 animate-spin" style={{ animationDuration: '6s' }} />
            <span className="font-semibold tracking-wide">Verified Student Marketplace • Safe Campus Exchange</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.08] mb-5 sm:mb-6"
          >
            <span className="text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">Buy Smart.</span>{" "}
            <span className="gradient-text drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">Sell Easy.</span>
            <br />
            <span className="text-slate-100 drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">Thrift on Campus.</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="text-sm sm:text-base md:text-lg text-slate-200 max-w-xl mx-auto mb-8 sm:mb-10 leading-relaxed px-2 drop-shadow-[0_1px_8px_rgba(0,0,0,0.9)] font-medium"
          >
            Discover affordable pre-loved finds from students right across your campus.
            Everything from calculators and textbooks to tech, streetwear, and dorm essentials.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3.5 max-w-sm sm:max-w-none mx-auto"
          >
            <Link
              href="/browse"
              className="group flex items-center justify-center gap-2.5 px-7 py-4 bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 rounded-2xl font-bold text-white text-sm sm:text-base transition-all duration-300 shadow-xl shadow-sky-500/25 hover:shadow-sky-500/45 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Explore Campus Finds</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/sell"
              className="flex items-center justify-center gap-2 px-7 py-4 glass rounded-2xl font-bold text-sm sm:text-base text-slate-200 hover:text-white hover:bg-white/10 transition-all duration-200 border border-white/12 active:scale-[0.98]"
            >
              <span>Sell an Item</span>
            </Link>
          </motion.div>

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            className="mt-12 sm:mt-16 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 pt-8 border-t border-white/8"
          >
            {stats.map((s, idx) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + idx * 0.08 }}
                className="text-center p-3 rounded-2xl glass border border-white/8 hover:border-indigo-500/30 transition-all"
              >
                <span className="text-base sm:text-xl block mb-1">{s.icon}</span>
                <p className="text-xl sm:text-2xl font-black text-white">{s.value}</p>
                <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5 font-medium">{s.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Categories Bar ───────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-end justify-between mb-6"
        >
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">Shop by Category</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">Find student essentials quickly and securely</p>
          </div>
          <Link
            href="/browse"
            className="text-xs sm:text-sm text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 group"
          >
            <span>See all</span>
            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 sm:gap-3">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.25, delay: i * 0.03 }}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href={`/browse?category=${cat.name}`}
                className={`group block glass rounded-2xl p-3 sm:p-4 text-center transition-all duration-300 border ${cat.border} hover:border-indigo-500/50 bg-gradient-to-b ${cat.color} shadow-sm`}
              >
                <span className="text-2xl sm:text-3xl mb-1.5 block group-hover:scale-110 transition-transform">
                  {cat.icon}
                </span>
                <p className="font-semibold text-xs truncate text-slate-200 group-hover:text-indigo-300 transition-colors">
                  {cat.name}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Featured Products Grid ───────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-semibold mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 hidden sm:inline-block animate-ping" />
              <span className="w-2 h-2 rounded-full bg-emerald-400 sm:hidden" />
              <span>Live Campus Feed</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">Fresh Listings</h2>
            <p className="text-xs sm:text-sm text-slate-400">Verified student listings ready for campus pickup</p>
          </div>
          <Link
            href="/browse"
            className="flex items-center gap-1.5 text-xs sm:text-sm text-indigo-400 hover:text-indigo-300 font-semibold glass px-3.5 py-1.5 rounded-xl border border-white/10 hover:border-indigo-500/40 transition-all"
          >
            <span>All Products</span>
            <ArrowRight size={14} />
          </Link>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {Array(8).fill(0).map((_, i) => <ProductCardSkeleton key={i} />)}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {products.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 glass rounded-3xl p-8 border border-white/8 text-slate-400">
            <p className="text-4xl mb-3">📦</p>
            <p className="font-semibold text-slate-300">No products listed yet.</p>
            <Link href="/sell" className="mt-4 inline-block text-xs font-bold text-indigo-400 hover:text-indigo-300 underline">
              List the first item
            </Link>
          </div>
        )}
      </section>

      {/* ── Why Thrift: Core Benefits ────────────────────────────────────── */}
      <section className="py-16 sm:py-20 border-t border-white/8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-12"
          >
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2 text-white">
              Why Thrift in Campus?
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Smart, sustainable, and 100% student-focused peer exchange.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-3 gap-4 sm:gap-6">
            {[
              {
                icon: <Zap className="text-indigo-400" size={20} />,
                badge: "border-indigo-500/20 bg-indigo-500/10",
                title: "Save 50% to 80%",
                desc: "Get quality gear, calculators, and textbooks at student prices. Keep your hard-earned budget for actual college life."
              },
              {
                icon: <Shield className="text-emerald-400" size={20} />,
                badge: "border-emerald-500/20 bg-emerald-500/10",
                title: "Moderated Campus Safety",
                desc: "Every listing is reviewed before going live. Zero random strangers, zero fake accounts — strictly campus students."
              },
              {
                icon: <HeartHandshake className="text-violet-400" size={20} />,
                badge: "border-violet-500/20 bg-violet-500/10",
                title: "Zero Shipping Hassle",
                desc: "No waiting days or paying expensive courier fees. Meet conveniently right at the campus library, quad, or cafeteria."
              },
            ].map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.08 }}
                className="glass-strong rounded-2xl sm:rounded-3xl p-6 border border-white/10 hover:border-indigo-500/40 transition-all card-hover shadow-xl"
              >
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-4 shadow-sm ${f.badge}`}>
                  {f.icon}
                </div>
                <h3 className="font-bold text-base sm:text-lg mb-2 text-white">{f.title}</h3>
                <p className="text-xs sm:text-sm leading-relaxed text-slate-400">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How Campus Thrift Works ─────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-10 sm:mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass border border-sky-500/25 text-sky-400 text-xs font-semibold mb-3 shadow-sm">
            <Sparkles size={13} />
            <span>Simple, Fast & 100% Free</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-2">
            How Campus Thrift Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
            Trade with verified students in 3 straightforward steps without courier charges or stranger hazards.
          </p>
        </motion.div>

        {/* 3 Step Cards */}
        <div className="grid sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
          {[
            {
              step: "01",
              icon: <Camera className="text-sky-400" size={22} />,
              badge: "border-sky-500/20 bg-sky-500/10 text-sky-400",
              title: "Snap & List in 60s",
              desc: "Take quick photos of your textbook, calculator, or gear. Set your price and get approved by campus moderators in minutes.",
            },
            {
              step: "02",
              icon: <MapPin className="text-cyan-400" size={22} />,
              badge: "border-cyan-500/20 bg-cyan-500/10 text-cyan-400",
              title: "Meet at a Campus Spot",
              desc: "Coordinate directly with a verified student. Meet safely between classes at the campus library, cafeteria, or dorm quad.",
            },
            {
              step: "03",
              icon: <CheckCircle2 className="text-emerald-400" size={22} />,
              badge: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
              title: "Inspect & Settle",
              desc: "Check the item in person and pay via UPI or cash on handoff. 100% direct trade with zero commission fees or delays.",
            },
          ].map((s, idx) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: idx * 0.08 }}
              className="glass-strong rounded-3xl p-6 sm:p-7 border border-white/10 hover:border-sky-500/40 transition-all card-hover shadow-xl flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-5">
                <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center shadow-sm ${s.badge}`}>
                  {s.icon}
                </div>
                <span className="text-2xl font-black text-white/20 tracking-tight font-mono">
                  {s.step}
                </span>
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white mb-2">{s.title}</h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Trust Action Strip */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-strong rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl"
        >
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
              <BadgeCheck className="text-emerald-400" size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Campus-Exclusive Community</p>
              <p className="text-xs text-slate-400">Strictly verified student accounts. Safe public campus meeting points recommended.</p>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Link
              href="/sell"
              className="flex-1 sm:flex-none px-6 py-3 bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 rounded-xl font-bold text-white text-xs sm:text-sm text-center shadow-lg shadow-sky-500/25 hover:scale-[1.02] active:scale-95 transition-all"
            >
              Sell an Item
            </Link>
            <Link
              href="/browse"
              className="flex-1 sm:flex-none px-6 py-3 glass hover:bg-white/10 rounded-xl font-semibold text-slate-200 hover:text-white text-xs sm:text-sm text-center border border-white/10 active:scale-95 transition-all"
            >
              Browse Items
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
