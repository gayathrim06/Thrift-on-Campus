"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, CheckCircle, XCircle, Package, Plus, Loader2 } from "lucide-react";
import { formatPrice, formatDate, getStatusColor } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  condition: string;
  status: string;
  createdAt: string;
  category: { name: string; icon: string };
}

const STATUS_ICONS: Record<string, React.ReactNode> = {
  PENDING: <Clock size={13} className="text-amber-400" />,
  APPROVED: <CheckCircle size={13} className="text-emerald-400" />,
  REJECTED: <XCircle size={13} className="text-red-400" />,
  SOLD: <Package size={13} className="text-gray-400" />,
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending Review",
  APPROVED: "Live",
  REJECTED: "Rejected",
  SOLD: "Sold",
};

export default function MyListingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/my-listings");
      return;
    }
    if (status === "authenticated") {
      fetch("/api/products/my-listings")
        .then((r) => r.json())
        .then((d) => { setProducts(d.products || []); setLoading(false); })
        .catch(() => setLoading(false));
    }
  }, [status, router]);

  const filtered = filter === "ALL" ? products : products.filter((p) => p.status === filter);

  const counts = {
    ALL: products.length,
    PENDING: products.filter((p) => p.status === "PENDING").length,
    APPROVED: products.filter((p) => p.status === "APPROVED").length,
    REJECTED: products.filter((p) => p.status === "REJECTED").length,
    SOLD: products.filter((p) => p.status === "SOLD").length,
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <Loader2 className="animate-spin text-violet-400" size={28} />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-24 md:pb-8 max-w-3xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">My Listings</h1>
          <p className="text-white/40">{products.length} total items</p>
        </div>
        <Link
          href="/sell"
          className="flex items-center gap-2 px-4 py-2.5 bg-violet-600 hover:bg-violet-500 rounded-xl text-sm font-medium text-white transition-colors"
        >
          <Plus size={15} />
          Sell Item
        </Link>
      </motion.div>

      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
        {(["ALL", "PENDING", "APPROVED", "REJECTED", "SOLD"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${
              filter === s
                ? "bg-violet-600 text-white"
                : "glass text-white/50 hover:text-white border border-white/5"
            }`}
          >
            {s === "ALL" ? "All" : STATUS_LABELS[s]}
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${
              filter === s ? "bg-white/20" : "bg-white/5"
            }`}>
              {counts[s]}
            </span>
          </button>
        ))}
      </div>

      {/* Listings */}
      <AnimatePresence mode="popLayout">
        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-4xl mb-3">📦</p>
            <p className="text-white/40 mb-6">
              {filter === "ALL"
                ? "You haven't listed anything yet"
                : `No ${STATUS_LABELS[filter as keyof typeof STATUS_LABELS] || filter.toLowerCase()} listings`}
            </p>
            {filter === "ALL" && (
              <Link
                href="/sell"
                className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-500 rounded-xl text-sm font-medium text-white transition-colors"
              >
                <Plus size={15} />
                List your first item
              </Link>
            )}
          </motion.div>
        ) : (
          <div className="space-y-3">
            {filtered.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2, delay: i * 0.04 }}
                layout
              >
                <Link href={`/products/${product.id}`}>
                  <div className="glass rounded-2xl p-4 border border-white/5 hover:border-violet-500/20 transition-all duration-200 hover:bg-white/4 flex gap-4 items-center group">
                    {/* Image */}
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-white/5">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="64px"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white/90 text-sm truncate group-hover:text-violet-300 transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-xs text-white/40 mt-0.5">
                        {product.category.icon} {product.category.name} · {formatDate(product.createdAt)}
                      </p>
                      <p className="text-base font-bold text-white mt-1.5">
                        {formatPrice(product.price)}
                      </p>
                    </div>

                    {/* Status */}
                    <div className={`shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium border ${getStatusColor(product.status)}`}>
                      {STATUS_ICONS[product.status]}
                      {STATUS_LABELS[product.status]}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
