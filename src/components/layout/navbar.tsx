"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home, Search, Tag, PlusCircle, BookMarked, User,
  LogOut, ShieldCheck, Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/browse", label: "Browse", icon: Search },
  { href: "/categories", label: "Categories", icon: Tag },
  { href: "/sell", label: "Sell", icon: PlusCircle },
];

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 15);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const isAdmin = (session?.user as any)?.role === "ADMIN";

  return (
    <>
      {/* ── Top Navbar (Desktop & Tablet) ─────────────────────────────────── */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="fixed top-0 left-0 right-0 z-50 gpu-layer bg-gradient-to-b from-[#090a10]/90 via-[#090a10]/40 to-transparent backdrop-blur-md transition-all duration-300"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-18">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <motion.div
                whileHover={{ rotate: 8, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-400 via-sky-500 to-blue-600 flex items-center justify-center shadow-lg shadow-sky-500/25"
              >
                <Sparkles size={18} className="text-white" />
              </motion.div>
              <div>
                <span className="font-extrabold text-lg sm:text-xl tracking-tight block leading-none">
                  <span className="gradient-text font-black">Thrift</span>
                  <span className="text-white/90"> in Campus</span>
                </span>
                <span className="text-[10px] text-sky-300/70 tracking-wider uppercase font-semibold hidden sm:inline-block">
                  Verified Student Exchange
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-1.5 glass px-2 py-1.5 rounded-2xl border border-white/8 shadow-inner">
              {navLinks.map(({ href, label, icon: Icon }) => {
                const isActive = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      "relative flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-sm font-medium transition-all duration-200",
                      isActive
                        ? "text-white font-semibold"
                        : "text-slate-400 hover:text-white hover:bg-white/5"
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="nav-active-pill"
                        className="absolute inset-0 bg-sky-500/20 rounded-xl border border-sky-400/40 shadow-sm"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <Icon size={16} className={isActive ? "text-sky-400" : ""} />
                    <span className="relative z-10">{label}</span>
                  </Link>
                );
              })}

              {session && (
                <Link
                  href="/my-listings"
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium transition-all duration-200",
                    pathname === "/my-listings"
                      ? "bg-indigo-600/25 text-indigo-200 border border-indigo-500/40"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  )}
                >
                  <BookMarked size={16} />
                  My Listings
                </Link>
              )}

              {isAdmin && (
                <Link
                  href="/admin"
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium transition-all duration-200",
                    pathname.startsWith("/admin")
                      ? "bg-emerald-600/25 text-emerald-300 border border-emerald-500/40"
                      : "text-emerald-400/80 hover:text-emerald-300 hover:bg-emerald-500/10"
                  )}
                >
                  <ShieldCheck size={16} />
                  Admin
                </Link>
              )}
            </div>

            {/* Auth Buttons / Profile */}
            <div className="flex items-center gap-2.5">
              {session ? (
                <div className="relative">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl glass hover:bg-white/10 transition-all duration-200 border border-white/10"
                  >
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-xs font-bold text-white shadow">
                      {session.user?.name?.[0]?.toUpperCase()}
                    </div>
                    <span className="text-xs sm:text-sm text-slate-200 max-w-[90px] sm:max-w-[120px] truncate font-medium">
                      {session.user?.name}
                    </span>
                  </motion.button>
                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-52 glass-strong rounded-2xl py-2 shadow-2xl border border-white/15 z-50"
                        onMouseLeave={() => setProfileOpen(false)}
                      >
                        <div className="px-4 py-2 border-b border-white/8">
                          <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Signed in as</p>
                          <p className="text-xs font-medium text-slate-200 truncate mt-0.5">{session.user?.email}</p>
                        </div>
                        <Link
                          href="/my-listings"
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-indigo-600/15 transition-colors"
                          onClick={() => setProfileOpen(false)}
                        >
                          <BookMarked size={14} />
                          My Listings
                        </Link>
                        {isAdmin && (
                          <Link
                            href="/admin"
                            className="flex items-center gap-2.5 px-4 py-2 text-sm text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 transition-colors"
                            onClick={() => setProfileOpen(false)}
                          >
                            <ShieldCheck size={14} />
                            Admin Panel
                          </Link>
                        )}
                        <div className="my-1 border-t border-white/8" />
                        <button
                          onClick={() => { signOut({ callbackUrl: "/" }); setProfileOpen(false); }}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors text-left"
                        >
                          <LogOut size={14} />
                          Sign out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    className="px-3.5 py-1.5 text-xs sm:text-sm text-slate-300 hover:text-white transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 py-2 text-xs sm:text-sm font-semibold bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl transition-all duration-200 shadow-md shadow-sky-500/25 hover:scale-[1.03] active:scale-95"
                  >
                    Join Free
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.nav>

      {/* ── Native-Style Floating Mobile Bottom Bar (Phones) ──────────────── */}
      <div className="fixed bottom-3 left-0 right-0 z-50 md:hidden flex justify-center px-4 safe-area-bottom pointer-events-none gpu-layer">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 320, damping: 26, delay: 0.1 }}
          className="pointer-events-auto w-full max-w-md glass-strong border border-white/12 rounded-full px-3 py-2 shadow-2xl shadow-black/80 flex items-center justify-between"
          style={{ willChange: 'transform' }}
        >
          {/* Home */}
          <Link
            href="/"
            className={cn(
              "flex flex-col items-center justify-center w-12 h-11 rounded-2xl transition-all active:scale-85",
              pathname === "/" ? "text-sky-400 font-bold" : "text-slate-400 hover:text-slate-200"
            )}
          >
            <Home size={19} />
            <span className="text-[9px] mt-0.5">Home</span>
          </Link>

          {/* Browse */}
          <Link
            href="/browse"
            className={cn(
              "flex flex-col items-center justify-center w-12 h-11 rounded-2xl transition-all active:scale-85",
              pathname === "/browse" ? "text-sky-400 font-bold" : "text-slate-400 hover:text-slate-200"
            )}
          >
            <Search size={19} />
            <span className="text-[9px] mt-0.5">Browse</span>
          </Link>

          {/* Central Pulsing Sell Action */}
          <Link
            href="/sell"
            className="relative -top-3 flex flex-col items-center justify-center group active:scale-90 transition-transform"
          >
            <div className="relative w-13 h-13 rounded-full bg-gradient-to-tr from-cyan-400 via-sky-500 to-blue-600 flex items-center justify-center shadow-lg shadow-sky-500/40 border-2 border-[#090a10]">
              <div className="absolute inset-0 rounded-full animate-ping bg-sky-500/25 pointer-events-none" />
              <PlusCircle size={24} className="text-white" />
            </div>
            <span className="text-[10px] font-bold text-sky-300 mt-0.5">Sell Item</span>
          </Link>

          {/* My Listings */}
          <Link
            href="/my-listings"
            className={cn(
              "flex flex-col items-center justify-center w-12 h-11 rounded-2xl transition-all active:scale-85",
              pathname === "/my-listings" ? "text-sky-400 font-bold" : "text-slate-400 hover:text-slate-200"
            )}
          >
            <BookMarked size={19} />
            <span className="text-[9px] mt-0.5">Listings</span>
          </Link>

          {/* Account */}
          <Link
            href={session ? "/profile" : "/login"}
            className={cn(
              "flex flex-col items-center justify-center w-12 h-11 rounded-2xl transition-all active:scale-85",
              pathname === "/login" || pathname === "/profile" ? "text-indigo-400 font-bold" : "text-slate-400 hover:text-slate-200"
            )}
          >
            <User size={19} />
            <span className="text-[9px] mt-0.5">{session ? "You" : "Login"}</span>
          </Link>
        </motion.div>
      </div>
    </>
  );
}
