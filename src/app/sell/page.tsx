"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Upload, CheckCircle, Loader2, ImageIcon } from "lucide-react";
import { toast } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";

/**
 * Converts any Unsplash page URL to a direct CDN image URL.
 * Handles both:
 *   https://unsplash.com/photos/slug-PHOTO_ID  → https://images.unsplash.com/photo-PHOTO_ID?w=800&q=80
 *   https://images.unsplash.com/...             → unchanged (already direct)
 *   anything else                               → unchanged
 */
function resolveImageUrl(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return trimmed;

  // Already a direct Unsplash CDN URL
  if (trimmed.startsWith("https://images.unsplash.com/")) return trimmed;

  // Unsplash page URL: extract photo ID (last hyphen-separated segment)
  const unsplashPageMatch = trimmed.match(
    /https:\/\/unsplash\.com\/photos\/[^/?#]*-([A-Za-z0-9_-]+)(?:[/?#]|$)/
  );
  if (unsplashPageMatch) {
    return `https://images.unsplash.com/photo-${unsplashPageMatch[1]}?w=800&q=80`;
  }

  return trimmed;
}

const sellSchema = z.object({
  name: z.string().min(2, "Name too short").max(100),
  description: z.string().min(10, "Description too short").max(2000),
  categoryId: z.string().min(1, "Select a category"),
  price: z.coerce.number().positive("Price must be positive"),
  // Accept any non-empty string (page URLs are resolved server-side)
  image: z.string().optional().default(""),
  condition: z.enum(["EXCELLENT", "GOOD", "FAIR", "POOR"]),
});

type SellForm = z.infer<typeof sellSchema>;

interface Category {
  id: string;
  name: string;
  icon: string;
}

export default function SellPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [imgError, setImgError] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<SellForm>({
    resolver: zodResolver(sellSchema) as any,
    defaultValues: { condition: "GOOD", image: "" },
  });

  const rawImageValue = watch("image") || "";
  const resolvedPreview = resolveImageUrl(rawImageValue);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/sell");
    }
    fetch("/api/categories")
      .then((r) => r.json())
      .then((d) => setCategories(d.categories || []));
  }, [status, router]);

  const onSubmit = async (data: SellForm) => {
    try {
      // Resolve page URLs → direct CDN URLs before submitting
      const imageUrl = resolveImageUrl(data.image || "") ||
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80";
      
      const res = await fetch("/api/products/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, image: imageUrl }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to submit");
      }

      setSubmitted(true);
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <Loader2 className="animate-spin text-violet-400" size={28} />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-24 md:pb-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <AnimatePresence mode="wait">
          {submitted ? (
            /* Success state */
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.1 }}
                className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mb-6"
              >
                <CheckCircle className="text-emerald-400" size={36} />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-2xl font-bold text-white mb-3">Listing submitted!</h2>
                <p className="text-white/50 mb-2">Your item is waiting for admin review.</p>
                <p className="text-sm text-white/30 mb-8">
                  Once approved, it will appear on the marketplace.
                </p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-6 py-3 glass rounded-xl text-sm text-white/70 hover:text-white border border-white/5 transition-colors"
                  >
                    Sell another
                  </button>
                  <button
                    onClick={() => router.push("/my-listings")}
                    className="px-6 py-3 bg-violet-600 hover:bg-violet-500 rounded-xl text-sm font-medium text-white transition-colors"
                  >
                    My Listings
                  </button>
                </div>
              </motion.div>
            </motion.div>
          ) : (
            /* Form */
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Sell an Item</h1>
                <p className="text-white/40">
                  Fill in the details below. Your listing will go live after admin review.
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Product name */}
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    Product Name *
                  </label>
                  <input
                    {...register("name")}
                    placeholder="e.g. Nike Hoodie, CLRS Textbook..."
                    className={cn(
                      "w-full px-4 py-3 glass rounded-xl text-white placeholder:text-white/25 focus:outline-none border transition-colors text-sm",
                      errors.name
                        ? "border-red-500/50 focus:border-red-500"
                        : "border-white/5 focus:border-violet-500/50"
                    )}
                  />
                  {errors.name && (
                    <p className="mt-1.5 text-xs text-red-400">{errors.name.message}</p>
                  )}
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    Category *
                  </label>
                  <select
                    {...register("categoryId")}
                    className={cn(
                      "w-full px-4 py-3 glass rounded-xl text-white focus:outline-none border transition-colors text-sm bg-transparent",
                      errors.categoryId
                        ? "border-red-500/50"
                        : "border-white/5 focus:border-violet-500/50"
                    )}
                  >
                    <option value="" className="bg-[#1a1a2e]">Select a category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id} className="bg-[#1a1a2e]">
                        {c.icon} {c.name}
                      </option>
                    ))}
                  </select>
                  {errors.categoryId && (
                    <p className="mt-1.5 text-xs text-red-400">{errors.categoryId.message}</p>
                  )}
                </div>

                {/* Condition */}
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    Condition *
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {(["EXCELLENT", "GOOD", "FAIR", "POOR"] as const).map((c) => (
                      <label
                        key={c}
                        className={cn(
                          "relative flex flex-col items-center gap-1 p-3 rounded-xl border cursor-pointer transition-all text-center",
                          watch("condition") === c
                            ? "border-violet-500/60 bg-violet-500/10 text-violet-300"
                            : "border-white/5 glass text-white/50 hover:border-white/20"
                        )}
                      >
                        <input
                          type="radio"
                          value={c}
                          {...register("condition")}
                          className="sr-only"
                        />
                        <span className="text-xs font-medium">
                          {c.charAt(0) + c.slice(1).toLowerCase()}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    Asking Price (₹) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 font-medium">₹</span>
                    <input
                      {...register("price")}
                      type="number"
                      placeholder="0"
                      className={cn(
                        "w-full pl-8 pr-4 py-3 glass rounded-xl text-white placeholder:text-white/25 focus:outline-none border transition-colors text-sm",
                        errors.price
                          ? "border-red-500/50"
                          : "border-white/5 focus:border-violet-500/50"
                      )}
                    />
                  </div>
                  {errors.price && (
                    <p className="mt-1.5 text-xs text-red-400">{errors.price.message}</p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    Description *
                  </label>
                  <textarea
                    {...register("description")}
                    rows={4}
                    placeholder="Describe your item — condition, age, why selling, etc."
                    className={cn(
                      "w-full px-4 py-3 glass rounded-xl text-white placeholder:text-white/25 focus:outline-none border transition-colors text-sm resize-none",
                      errors.description
                        ? "border-red-500/50"
                        : "border-white/5 focus:border-violet-500/50"
                    )}
                  />
                  {errors.description && (
                    <p className="mt-1.5 text-xs text-red-400">{errors.description.message}</p>
                  )}
                </div>

                {/* Image URL */}
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    Product Image{" "}
                    <span className="text-white/30 font-normal">(optional)</span>
                  </label>

                  <input
                    {...register("image")}
                    placeholder="Paste any image URL or Unsplash page link..."
                    onChange={(e) => {
                      register("image").onChange(e);
                      setImgError(false);
                    }}
                    className="w-full px-4 py-3 glass rounded-xl text-white placeholder:text-white/25 focus:outline-none border border-white/5 focus:border-violet-500/50 transition-colors text-sm"
                  />

                  {/* Live preview */}
                  {resolvedPreview && !imgError ? (
                    <div className="mt-3 relative w-full aspect-video rounded-xl overflow-hidden border border-white/10 bg-white/5">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={resolvedPreview}
                        alt="Preview"
                        onError={() => setImgError(true)}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-2 right-2 bg-emerald-500/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        ✓ Image loaded
                      </div>
                    </div>
                  ) : resolvedPreview && imgError ? (
                    <p className="mt-2 text-xs text-red-400 flex items-center gap-1.5">
                      <span>⚠</span> Couldn't load this image. Try a different URL.
                    </p>
                  ) : null}

                  <div className="mt-2 space-y-1">
                    <p className="text-xs text-white/30 flex items-center gap-1.5">
                      <Upload size={11} />
                      Paste the Unsplash page link directly — it works automatically.
                    </p>
                    <p className="text-xs text-white/20">
                      Or right-click any image online → "Copy image address" → paste here.
                    </p>
                    <p className="text-xs text-white/20">
                      Leave blank to use a default placeholder.
                    </p>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 rounded-2xl font-semibold text-white transition-all duration-200 shadow-lg shadow-violet-600/30 hover:scale-[1.01] flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Post Item"
                  )}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
