"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";
import { toast } from "@/components/ui/toaster";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return;
    if (password.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Registration failed");
        return;
      }

      // Auto sign in
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.ok) {
        toast.success("Account created! Welcome 🎉");
        router.push("/");
        router.refresh();
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-16 flex items-center justify-center hero-bg px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-400 via-sky-500 to-blue-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-sky-500/25">
            <span className="text-xl font-black text-white">T</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Create account</h1>
          <p className="text-slate-400 text-sm mt-1">Join your campus marketplace</p>
        </div>

        <div className="glass-strong rounded-2xl p-6 border border-white/10 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-300 mb-1.5">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required
                className="w-full px-4 py-3 glass rounded-xl text-white placeholder:text-slate-500 focus:outline-none border border-white/8 focus:border-sky-500/50 transition-colors text-sm"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-300 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@campus.edu"
                required
                className="w-full px-4 py-3 glass rounded-xl text-white placeholder:text-slate-500 focus:outline-none border border-white/8 focus:border-sky-500/50 transition-colors text-sm"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  required
                  minLength={6}
                  className="w-full px-4 py-3 pr-11 glass rounded-xl text-white placeholder:text-slate-500 focus:outline-none border border-white/8 focus:border-sky-500/50 transition-colors text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 rounded-xl font-semibold text-white transition-all duration-200 shadow-lg shadow-sky-500/25 hover:scale-[1.01] flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>Create Account <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-white/30 mt-5">
            Already have an account?{" "}
            <Link href="/login" className="text-violet-400 hover:text-violet-300 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
