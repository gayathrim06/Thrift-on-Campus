"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

interface Category {
  id: string;
  name: string;
  icon: string;
  _count: { products: number };
}

const BG_GRADIENTS = [
  "from-blue-500/20 to-cyan-500/10",
  "from-pink-500/20 to-rose-500/10",
  "from-amber-500/20 to-yellow-500/10",
  "from-emerald-500/20 to-green-500/10",
  "from-violet-500/20 to-purple-500/10",
  "from-orange-500/20 to-amber-500/10",
  "from-indigo-500/20 to-blue-500/10",
  "from-gray-500/20 to-slate-500/10",
];

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((d) => { setCategories(d.categories || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen pt-20 pb-24 md:pb-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <h1 className="text-3xl font-bold text-white mb-2">Browse Categories</h1>
        <p className="text-white/40">Find what you need from your campus community</p>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Array(8).fill(0).map((_, i) => (
            <div key={i} className="glass rounded-2xl p-6 animate-pulse border border-white/5 h-32" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              whileHover={{ scale: 1.02 }}
            >
              <Link
                href={`/browse?category=${cat.name}`}
                className={`group flex flex-col items-start p-6 glass rounded-2xl border border-white/5 hover:border-violet-500/30 transition-all duration-300 bg-gradient-to-br ${BG_GRADIENTS[i % BG_GRADIENTS.length]} h-full`}
              >
                <span className="text-4xl mb-4 block">{cat.icon}</span>
                <p className="font-bold text-white/90 text-lg group-hover:text-violet-300 transition-colors mb-1">
                  {cat.name}
                </p>
                <p className="text-sm text-white/35">
                  {cat._count.products} item{cat._count.products !== 1 ? "s" : ""}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
