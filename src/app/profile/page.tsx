"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { BookMarked, LogOut, ShieldCheck, PlusCircle } from "lucide-react";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) {
    router.push("/login");
    return null;
  }

  const isAdmin = (session.user as any)?.role === "ADMIN";

  return (
    <div className="min-h-screen pt-20 pb-24 md:pb-8 flex items-start justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        {/* Avatar */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center text-4xl font-black text-white shadow-lg shadow-violet-600/30 mb-4">
            {session.user?.name?.[0]?.toUpperCase()}
          </div>
          <h1 className="text-2xl font-bold text-white">{session.user?.name}</h1>
          <p className="text-white/40 text-sm mt-1">{session.user?.email}</p>
          {isAdmin && (
            <span className="mt-2 flex items-center gap-1.5 px-3 py-1 bg-violet-600/20 border border-violet-500/30 rounded-full text-xs text-violet-300 font-medium">
              <ShieldCheck size={12} />
              Admin
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="glass-strong rounded-2xl border border-white/8 overflow-hidden">
          <Link
            href="/my-listings"
            className="flex items-center justify-between px-5 py-4 hover:bg-white/5 transition-colors border-b border-white/5"
          >
            <div className="flex items-center gap-3">
              <BookMarked size={18} className="text-white/50" />
              <span className="text-sm text-white/80">My Listings</span>
            </div>
            <span className="text-white/20">›</span>
          </Link>

          <Link
            href="/sell"
            className="flex items-center justify-between px-5 py-4 hover:bg-white/5 transition-colors border-b border-white/5"
          >
            <div className="flex items-center gap-3">
              <PlusCircle size={18} className="text-white/50" />
              <span className="text-sm text-white/80">Sell an Item</span>
            </div>
            <span className="text-white/20">›</span>
          </Link>

          {isAdmin && (
            <Link
              href="/admin"
              className="flex items-center justify-between px-5 py-4 hover:bg-white/5 transition-colors border-b border-white/5"
            >
              <div className="flex items-center gap-3">
                <ShieldCheck size={18} className="text-violet-400" />
                <span className="text-sm text-violet-300">Admin Panel</span>
              </div>
              <span className="text-white/20">›</span>
            </Link>
          )}

          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full flex items-center gap-3 px-5 py-4 hover:bg-red-500/5 transition-colors text-left"
          >
            <LogOut size={18} className="text-red-400" />
            <span className="text-sm text-red-400">Sign out</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
