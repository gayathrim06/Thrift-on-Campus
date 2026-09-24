"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, XCircle, AlertCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

let toastListeners: ((t: Toast) => void)[] = [];

export function toast(message: string, type: ToastType = "info") {
  const id = Math.random().toString(36).slice(2);
  toastListeners.forEach((l) => l({ id, message, type }));
}
toast.success = (msg: string) => toast(msg, "success");
toast.error = (msg: string) => toast(msg, "error");

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const listener = (t: Toast) => {
      setToasts((prev) => [...prev, t]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((p) => p.id !== t.id));
      }, 4000);
    };
    toastListeners.push(listener);
    return () => { toastListeners = toastListeners.filter((l) => l !== listener); };
  }, []);

  if (!mounted) return null;

  const icons = {
    success: <CheckCircle size={16} className="text-emerald-400 shrink-0" />,
    error: <XCircle size={16} className="text-red-400 shrink-0" />,
    info: <AlertCircle size={16} className="text-blue-400 shrink-0" />,
  };

  return createPortal(
    <div className="fixed bottom-24 md:bottom-6 right-4 z-[100] flex flex-col gap-2 max-w-xs w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 40, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "glass-strong rounded-xl px-4 py-3 flex items-center gap-3 pointer-events-auto shadow-xl",
              t.type === "success" && "border border-emerald-500/20",
              t.type === "error" && "border border-red-500/20",
              t.type === "info" && "border border-blue-500/20"
            )}
          >
            {icons[t.type]}
            <p className="text-sm text-white/90 flex-1">{t.message}</p>
            <button
              onClick={() => setToasts((prev) => prev.filter((p) => p.id !== t.id))}
              className="text-white/30 hover:text-white/70 transition-colors"
            >
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>,
    document.body
  );
}
