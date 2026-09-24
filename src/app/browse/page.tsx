"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, X, ChevronDown, Sparkles, RefreshCw } from "lucide-react";
import ProductCard, { ProductCardSkeleton } from "@/components/marketplace/product-card";
import { cn } from "@/lib/utils";

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

const CONDITIONS = ["EXCELLENT", "GOOD", "FAIR", "POOR"];
const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
];

const CATEGORIES = [
  { name: "Electronics", icon: "📱" },
  { name: "Clothing", icon: "👕" },
  { name: "Books", icon: "📚" },
  { name: "Bags", icon: "🎒" },
  { name: "Hostel", icon: "🏠" },
  { name: "Sports", icon: "⚽" },
  { name: "Entertainment", icon: "🎮" },
  { name: "Miscellaneous", icon: "📦" },
];

export default function BrowsePage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [condition, setCondition] = useState(searchParams.get("condition") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "newest");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ status: "APPROVED", sort });
    if (search) params.set("search", search);
    if (category) params.set("category", category);
    if (condition) params.set("condition", condition);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);

    try {
      const res = await fetch(`/api/products?${params}`);
      const data = await res.json();
      setProducts(data.products || []);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [search, category, condition, sort, minPrice, maxPrice]);

  useEffect(() => {
    const t = setTimeout(fetchProducts, 250);
    return () => clearTimeout(t);
  }, [fetchProducts]);

  const hasFilters = Boolean(category || condition || minPrice || maxPrice);

  const clearFilters = () => {
    setCategory("");
    setCondition("");
    setMinPrice("");
    setMaxPrice("");
    setSearch("");
  };

  return (
    <div className="min-h-screen pt-20 pb-28 md:pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="py-6 sm:py-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4"
      >
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-violet-400 glass px-2.5 py-1 rounded-md mb-2 border border-violet-500/20">
            <Sparkles size={12} />
            <span>Curated Campus Deals • Verified Student Inventory</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Campus Marketplace
          </h1>
          <p className="text-xs sm:text-sm text-white/50 mt-1">
            {loading ? "Searching student listings..." : `${products.length} active verified finds`}
          </p>
        </div>

        {/* Desktop Quick Sort */}
        <div className="hidden sm:flex items-center gap-2">
          <span className="text-xs text-white/40">Sort by:</span>
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="appearance-none pl-3.5 pr-8 py-2 glass rounded-xl text-xs font-semibold text-white/80 focus:outline-none border border-white/10 cursor-pointer bg-[#0e0e17]"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value} className="bg-[#10101b]">
                  {o.label}
                </option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
          </div>
        </div>
      </motion.div>

      {/* ── Search + Filter Trigger Bar ─────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex gap-2.5 mb-4"
      >
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/35" />
          <input
            type="text"
            placeholder="Search textbooks, calculators, hoodies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-9 py-3 glass rounded-2xl text-white placeholder:text-white/35 focus:outline-none border border-white/10 focus:border-violet-500/50 transition-colors text-xs sm:text-sm shadow-inner"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white p-1"
            >
              <X size={15} />
            </button>
          )}
        </div>

        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          className={cn(
            "flex items-center gap-2 px-3.5 sm:px-4 py-3 rounded-2xl glass text-xs sm:text-sm font-semibold transition-all border active:scale-95",
            filtersOpen || hasFilters
              ? "border-violet-500/50 text-violet-300 bg-violet-600/15"
              : "border-white/10 text-white/70 hover:text-white"
          )}
        >
          <SlidersHorizontal size={15} />
          <span className="hidden xs:inline">Filters</span>
          {hasFilters && (
            <span className="bg-pink-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
              •
            </span>
          )}
        </button>

        {/* Mobile sort button */}
        <div className="relative sm:hidden">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="appearance-none pl-3 pr-7 py-3 glass rounded-2xl text-xs font-semibold text-white/80 focus:outline-none border border-white/10 bg-[#0e0e17] cursor-pointer"
          >
            <option value="newest">Newest</option>
            <option value="price_asc">Price: Low</option>
            <option value="price_desc">Price: High</option>
          </select>
          <ChevronDown size={13} className="absolute right-2 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
        </div>
      </motion.div>

      {/* ── Category Horizontal Scroll Pills (Optimized for Mobile Swiping) ─ */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar touch-pan-x">
        <button
          onClick={() => setCategory("")}
          className={cn(
            "shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-95",
            !category
              ? "bg-violet-600 text-white shadow-md shadow-violet-600/30"
              : "glass text-white/60 hover:text-white border border-white/5"
          )}
        >
          ✨ All Finds
        </button>

        {CATEGORIES.map((c) => (
          <button
            key={c.name}
            onClick={() => setCategory(category === c.name ? "" : c.name)}
            className={cn(
              "shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all active:scale-95",
              category === c.name
                ? "bg-gradient-to-r from-violet-600 to-pink-600 text-white shadow-md shadow-violet-600/30"
                : "glass text-white/65 hover:text-white border border-white/5"
            )}
          >
            <span>{c.icon}</span>
            <span>{c.name}</span>
          </button>
        ))}
      </div>

      {/* ── Expandable Filter Drawer ─────────────────────────────────────── */}
      <AnimatePresence>
        {filtersOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-6"
          >
            <div className="glass-card rounded-2xl p-5 border border-white/10 shadow-xl">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {/* Condition */}
                <div>
                  <label className="text-[11px] text-white/40 uppercase font-bold tracking-wider mb-2.5 block">
                    Product Condition
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {CONDITIONS.map((c) => (
                      <button
                        key={c}
                        onClick={() => setCondition(condition === c ? "" : c)}
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all active:scale-95",
                          condition === c
                            ? "bg-violet-600 text-white shadow"
                            : "glass text-white/60 hover:text-white border border-white/5"
                        )}
                      >
                        {c.charAt(0) + c.slice(1).toLowerCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price range */}
                <div>
                  <label className="text-[11px] text-white/40 uppercase font-bold tracking-wider mb-2.5 block">
                    Price Range (₹)
                  </label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="number"
                      placeholder="Min ₹"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="w-full px-3 py-2 glass rounded-xl text-xs text-white placeholder:text-white/30 focus:outline-none border border-white/10 bg-transparent"
                    />
                    <span className="text-white/30 text-xs">–</span>
                    <input
                      type="number"
                      placeholder="Max ₹"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="w-full px-3 py-2 glass rounded-xl text-xs text-white placeholder:text-white/30 focus:outline-none border border-white/10 bg-transparent"
                    />
                  </div>
                </div>

                {/* Clear filters action */}
                <div className="flex items-end">
                  <button
                    onClick={clearFilters}
                    className="w-full py-2.5 px-4 rounded-xl glass hover:bg-white/10 text-xs font-bold text-white/70 hover:text-white border border-white/10 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <RefreshCw size={13} />
                    <span>Reset All Filters</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Products Grid ────────────────────────────────────────────────── */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
          {Array(8).fill(0).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
          {products.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 glass rounded-3xl p-8 border border-white/8">
          <p className="text-5xl mb-3">🔍</p>
          <h3 className="text-lg font-bold text-white mb-1">No items match your criteria</h3>
          <p className="text-xs text-white/45 mb-6 max-w-sm mx-auto">
            Try adjusting your search keywords, price limits, or clearing the active filters.
          </p>
          <button
            onClick={clearFilters}
            className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs shadow-md transition-all active:scale-95"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
