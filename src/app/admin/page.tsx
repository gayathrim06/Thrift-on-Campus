"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Clock, CheckCircle, XCircle, Package,
  Users, BarChart3, ChevronRight, Loader2, Eye, ThumbsUp, ThumbsDown, DollarSign
} from "lucide-react";
import { formatPrice, formatDate } from "@/lib/utils";
import { toast } from "@/components/ui/toaster";

interface Stats {
  totalUsers: number;
  totalProducts: number;
  pending: number;
  approved: number;
  rejected: number;
  sold: number;
}

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  condition: string;
  status: string;
  description: string;
  createdAt: string;
  seller: { name: string; email: string };
  category: { name: string; icon: string };
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [stats, setStats] = useState<Stats | null>(null);
  const [pendingProducts, setPendingProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [view, setView] = useState<"dashboard" | "pending">("dashboard");

  useEffect(() => {
    if (status === "unauthenticated" || ((session?.user as any)?.role !== "ADMIN")) {
      if (status !== "loading") router.push("/");
      return;
    }
    loadData();
  }, [status, session]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsRes, pendingRes] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch("/api/admin/pending"),
      ]);
      const statsData = await statsRes.json();
      const pendingData = await pendingRes.json();
      setStats(statsData.stats);
      setPendingProducts(pendingData.products || []);
    } catch {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (productId: string, action: "APPROVED" | "REJECTED" | "SOLD") => {
    setActionLoading(productId + action);
    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (!res.ok) throw new Error();
      toast.success(`Product ${action.toLowerCase()}!`);
      await loadData();
    } catch {
      toast.error("Action failed");
    } finally {
      setActionLoading(null);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <Loader2 className="animate-spin text-violet-400" size={28} />
      </div>
    );
  }

  if ((session?.user as any)?.role !== "ADMIN") return null;

  const statCards = [
    { label: "Total Users", value: stats?.totalUsers || 0, icon: <Users size={18} className="text-blue-400" />, color: "from-blue-500/10 to-cyan-500/5" },
    { label: "Total Products", value: stats?.totalProducts || 0, icon: <Package size={18} className="text-violet-400" />, color: "from-violet-500/10 to-purple-500/5" },
    { label: "Pending Review", value: stats?.pending || 0, icon: <Clock size={18} className="text-amber-400" />, color: "from-amber-500/10 to-yellow-500/5", highlight: (stats?.pending || 0) > 0 },
    { label: "Approved", value: stats?.approved || 0, icon: <CheckCircle size={18} className="text-emerald-400" />, color: "from-emerald-500/10 to-green-500/5" },
    { label: "Rejected", value: stats?.rejected || 0, icon: <XCircle size={18} className="text-red-400" />, color: "from-red-500/10 to-rose-500/5" },
    { label: "Sold", value: stats?.sold || 0, icon: <DollarSign size={18} className="text-green-400" />, color: "from-green-500/10 to-emerald-500/5" },
  ];

  return (
    <div className="min-h-screen pt-20 pb-24 md:pb-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-2 text-sm text-white/40 mb-2">
          <span>Admin Panel</span>
        </div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
      </motion.div>

      {/* Tab nav */}
      <div className="flex gap-2 mb-8">
        {[
          { id: "dashboard", label: "Overview", icon: LayoutDashboard },
          { id: "pending", label: `Pending Review ${stats?.pending ? `(${stats.pending})` : ""}`, icon: Clock },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setView(id as "dashboard" | "pending")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              view === id
                ? "bg-violet-600 text-white shadow-lg shadow-violet-600/20"
                : "glass text-white/50 hover:text-white border border-white/5"
            }`}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {view === "dashboard" ? (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {/* Stats grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
              {statCards.map((card, i) => (
                <motion.div
                  key={card.label}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className={`glass rounded-2xl p-5 border transition-all bg-gradient-to-br ${card.color} ${
                    card.highlight ? "border-amber-500/30 shadow-lg shadow-amber-500/10" : "border-white/5"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-white/40 mb-1">{card.label}</p>
                      <p className="text-3xl font-black text-white">{card.value}</p>
                    </div>
                    <div className="w-9 h-9 rounded-xl glass-strong flex items-center justify-center">
                      {card.icon}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Quick action */}
            {(stats?.pending || 0) > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="glass rounded-2xl p-5 border border-amber-500/20 bg-amber-500/5 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                    <Clock size={18} className="text-amber-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">{stats?.pending} listing{stats?.pending !== 1 ? "s" : ""} need review</p>
                    <p className="text-sm text-white/40">Review and approve or reject them</p>
                  </div>
                </div>
                <button
                  onClick={() => setView("pending")}
                  className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 rounded-xl text-sm font-medium text-black transition-colors"
                >
                  Review <ChevronRight size={14} />
                </button>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="pending"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {pendingProducts.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-4xl mb-3">✅</p>
                <p className="text-white/40">All caught up! No pending listings.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingProducts.map((product, i) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="glass rounded-2xl p-5 border border-white/5"
                  >
                    <div className="flex gap-5">
                      {/* Image */}
                      <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-white/5 shrink-0">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          sizes="96px"
                          className="object-cover"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-semibold text-white text-base">{product.name}</h3>
                          <span className="text-lg font-bold text-white shrink-0">
                            {formatPrice(product.price)}
                          </span>
                        </div>
                        <p className="text-xs text-white/40 mb-2">
                          {product.category.icon} {product.category.name} · {product.condition.charAt(0) + product.condition.slice(1).toLowerCase()} · by {product.seller.name}
                        </p>
                        <p className="text-sm text-white/60 line-clamp-2 mb-3">
                          {product.description}
                        </p>
                        <p className="text-xs text-white/30">
                          Submitted {formatDate(product.createdAt)} · {product.seller.email}
                        </p>

                        {/* Actions */}
                        <div className="flex gap-2 mt-4">
                          <Link
                            href={`/products/${product.id}`}
                            target="_blank"
                            className="flex items-center gap-1.5 px-3 py-2 glass rounded-lg text-xs text-white/50 hover:text-white border border-white/5 transition-colors"
                          >
                            <Eye size={13} />
                            View
                          </Link>
                          <button
                            onClick={() => handleAction(product.id, "APPROVED")}
                            disabled={!!actionLoading}
                            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 rounded-lg text-xs font-medium text-white transition-colors"
                          >
                            {actionLoading === product.id + "APPROVED" ? (
                              <Loader2 size={13} className="animate-spin" />
                            ) : (
                              <ThumbsUp size={13} />
                            )}
                            Approve
                          </button>
                          <button
                            onClick={() => handleAction(product.id, "REJECTED")}
                            disabled={!!actionLoading}
                            className="flex items-center gap-1.5 px-4 py-2 bg-red-600/80 hover:bg-red-600 disabled:opacity-50 rounded-lg text-xs font-medium text-white transition-colors"
                          >
                            {actionLoading === product.id + "REJECTED" ? (
                              <Loader2 size={13} className="animate-spin" />
                            ) : (
                              <ThumbsDown size={13} />
                            )}
                            Reject
                          </button>
                          <button
                            onClick={() => handleAction(product.id, "SOLD")}
                            disabled={!!actionLoading}
                            className="flex items-center gap-1.5 px-4 py-2 glass hover:bg-white/10 disabled:opacity-50 rounded-lg text-xs text-white/50 border border-white/5 transition-colors"
                          >
                            Mark Sold
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
