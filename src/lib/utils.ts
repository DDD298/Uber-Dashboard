import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format number to Vietnamese Dong (VND) currency
 */
export function formatCurrency(amount: number | string | null | undefined): string {
  if (amount === null || amount === undefined || amount === "") return "0₫";
  const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(numAmount)) return "0₫";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  }).format(numAmount);
}

/**
 * Format currency with compact notation (e.g., 1.5M, 2.3B)
 */
export function formatCurrencyCompact(amount: number | string | null | undefined): string {
  if (amount === null || amount === undefined || amount === "") return "₫0";
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(num)) return "₫0";

  if (num >= 1000000000000) {
    return `₫${(num / 1000000000000).toFixed(1)}T`;
  } else if (num >= 1000000000) {
    return `₫${(num / 1000000000).toFixed(1)}B`;
  } else if (num >= 1000000) {
    return `₫${(num / 1000000).toFixed(1)}M`;
  } else if (num >= 1000) {
    return `₫${(num / 1000).toFixed(0)}K`;
  } else {
    return `₫${num.toFixed(0)}`;
  }
}

/**
 * Format currency without symbol
 */
export function formatCurrencyNoSymbol(amount: number | string | null | undefined): string {
  if (amount === null || amount === undefined || amount === "") return "0";
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(num)) return "0";
  return new Intl.NumberFormat("vi-VN").format(num);
}

/**
 * Format date to Vietnamese locale string
 */
export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return "N/A";
  try {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (error) {
    return "Invalid Date";
  }
}

/**
 * Format date to relative time string (e.g., 2 phút trước)
 */
export function formatRelativeTime(date: string | Date | null | undefined): string {
  if (!date) return "N/A";
  const rtf = new Intl.RelativeTimeFormat("vi-VN", { numeric: "auto" });
  const d = typeof date === "string" ? new Date(date) : date;
  const diff = d.getTime() - Date.now();
  const minutes = Math.floor(diff / 60000);

  if (Math.abs(minutes) < 60) {
    return rtf.format(minutes, "minute");
  }
  const hours = Math.floor(minutes / 60);
  if (Math.abs(hours) < 24) {
    return rtf.format(hours, "hour");
  }
  const days = Math.floor(hours / 24);
  return rtf.format(days, "day");
}

/**
 * Format number with thousand separators
 */
export function formatNumber(num: number | string | null | undefined): string {
  if (num === null || num === undefined || num === "") return "0";
  const n = typeof num === "string" ? parseFloat(num) : num;
  if (isNaN(n)) return "0";
  return new Intl.NumberFormat("vi-VN").format(n);
}

/**
 * Format address by shortening it
 */
export function formatAddress(address: string): string {
  if (!address) return "";
  if (address.length < 10) return address;
  return `${address.substring(0, 4)}…${address.substring(address.length - 4)}`;
}

/**
 * Format timestamp to relative time (alternative simple version)
 */
export function formatTimestamp(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;

  if (diff < 60000) {
    return "Vừa xong";
  } else if (diff < 3600000) {
    const minutes = Math.floor(diff / 60000);
    return `${minutes} phút trước`;
  } else if (diff < 86400000) {
    const hours = Math.floor(diff / 3600000);
    return `${hours} giờ trước`;
  } else {
    const days = Math.floor(diff / 86400000);
    return `${days} ngày trước`;
  }
}

/**
 * Get Badge variant based on status
 */
export function getStatusVariant(status: string): "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info" | "danger" {
  const s = status?.toUpperCase();
  const variants: Record<string, any> = {
    PENDING: "secondary",
    ACCEPTED: "info",
    PICKED_UP: "info",
    DELIVERED: "outline",
    COMPLETED: "success",
    CANCELLED: "danger",
    OPEN: "secondary",
    IN_PROGRESS: "info",
    RESOLVED: "outline",
    APPROVED: "success",
    LOCKED: "danger",
    ONLINE: "success",
    OFFLINE: "secondary",
    BUSY: "warning",
    PAID: "success",
    FAILED: "danger",
    REFUNDED: "info",
  };
  return variants[s] || "default";
}

/**
 * Get Badge variant based on priority
 */
export function getPriorityVariant(priority: string): "default" | "destructive" | "secondary" | "warning" {
  const p = priority?.toUpperCase();
  const variants: Record<string, any> = {
    LOW: "default",
    MEDIUM: "secondary",
    HIGH: "destructive",
    URGENT: "destructive",
    CRITICAL: "destructive",
  };
  return variants[p] || "default";
}
