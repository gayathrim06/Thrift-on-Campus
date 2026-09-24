import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return `₹${price.toLocaleString("en-IN")}`;
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function getConditionLabel(condition: string): string {
  const labels: Record<string, string> = {
    EXCELLENT: "Excellent",
    GOOD: "Good",
    FAIR: "Fair",
    POOR: "Poor",
  };
  return labels[condition] || condition;
}

export function getConditionColor(condition: string): string {
  const colors: Record<string, string> = {
    EXCELLENT: "text-emerald-400 bg-emerald-400/10",
    GOOD: "text-blue-400 bg-blue-400/10",
    FAIR: "text-amber-400 bg-amber-400/10",
    POOR: "text-red-400 bg-red-400/10",
  };
  return colors[condition] || "text-gray-400 bg-gray-400/10";
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    PENDING: "text-amber-400 bg-amber-400/10 border-amber-400/20",
    APPROVED: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    REJECTED: "text-red-400 bg-red-400/10 border-red-400/20",
    SOLD: "text-gray-400 bg-gray-400/10 border-gray-400/20",
  };
  return colors[status] || "text-gray-400 bg-gray-400/10 border-gray-400/20";
}
