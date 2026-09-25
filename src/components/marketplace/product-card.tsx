"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { formatPrice, formatDate, getConditionColor } from "@/lib/utils";
import { Calendar, User, Heart, Sparkles } from "lucide-react";
import { triggerHeartBurst } from "@/lib/confetti";

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

export default function ProductCard({
  product,
  index = 0,
}: {
  product: Product;
  index?: number;
}) {
  const [liked, setLiked] = useState(false);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const next = !liked;
    setLiked(next);
    if (next) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;
      triggerHeartBurst(x, y);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        delay: Math.min(index * 0.04, 0.24),
        ease: "easeOut",
      }}
      whileTap={{ scale: 0.97 }}
      className="h-full"
    >
      <Link href={`/products/${product.id}`} className="block group h-full">
        <div className="h-full flex flex-col glass rounded-2xl sm:rounded-3xl overflow-hidden card-hover border border-white/8 hover:border-violet-500/40 hover:shadow-xl hover:shadow-violet-600/10 transition-all duration-300">
          {/* Image Container */}
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-white/5">
            <Image
              src={product.image}
              alt={product.name}
              fill
              loading="lazy"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />

            {/* Gradient Overlay for contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 opacity-60 group-hover:opacity-40 transition-opacity" />

            {/* Condition badge */}
            <div className="absolute top-2.5 left-2.5 z-10">
              <span
                className={`text-[10px] sm:text-xs font-semibold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full shadow-sm border border-white/10 ${getConditionColor(product.condition)}`}
              >
                {product.condition.charAt(0) + product.condition.slice(1).toLowerCase()}
              </span>
            </div>

            {/* Quick Heart Save Button */}
            <button
              onClick={handleLike}
              className="absolute top-2.5 right-2.5 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full glass-strong flex items-center justify-center text-white/70 hover:text-white transition-transform active:scale-75 shadow-md"
              aria-label="Save item"
            >
              <Heart
                size={14}
                className={liked ? "fill-rose-500 text-rose-500 animate-pulse" : "transition-colors"}
              />
            </button>

            {/* Psychology delight badge */}
            <div className="absolute bottom-2 left-2.5 z-10">
              <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-medium px-2 py-0.5 rounded-md bg-emerald-500/80 backdrop-blur-sm text-white shadow-sm">
                <Sparkles size={10} />
                Student Deal
              </span>
            </div>
          </div>

          {/* Info Section */}
          <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-1 mb-1">
                <p className="text-[11px] sm:text-xs text-violet-300/80 font-medium truncate">
                  {product.category.icon} {product.category.name}
                </p>
              </div>

              <h3 className="font-semibold text-white/90 text-xs sm:text-sm leading-snug line-clamp-2 mb-2 group-hover:text-violet-300 transition-colors">
                {product.name}
              </h3>
            </div>

            <div>
              <div className="flex items-baseline justify-between gap-2 mb-2">
                <p className="text-base sm:text-xl font-black text-white tracking-tight">
                  {formatPrice(product.price)}
                </p>
                <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                  Campus Verified
                </span>
              </div>

              <div className="flex items-center justify-between text-[10px] sm:text-xs text-white/40 pt-2 border-t border-white/5">
                <span className="flex items-center gap-1 truncate max-w-[80px] sm:max-w-[100px]">
                  <User size={10} className="shrink-0" />
                  <span className="truncate">{product.seller.name.split(" ")[0]}</span>
                </span>
                <span className="flex items-center gap-1 shrink-0">
                  <Calendar size={10} />
                  {formatDate(product.createdAt)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// Skeleton loader for product card
export function ProductCardSkeleton() {
  return (
    <div className="glass rounded-2xl sm:rounded-3xl overflow-hidden border border-white/5 animate-pulse">
      <div className="aspect-[4/3] bg-white/5" />
      <div className="p-3.5 space-y-2.5">
        <div className="h-3 bg-white/5 rounded w-1/3" />
        <div className="h-4 bg-white/5 rounded w-3/4" />
        <div className="h-5 bg-white/5 rounded w-1/2" />
        <div className="h-3 bg-white/5 rounded" />
      </div>
    </div>
  );
}
