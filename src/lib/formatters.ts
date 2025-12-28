export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date));
}

export function formatRelativeTime(date: string | Date): string {
  const rtf = new Intl.RelativeTimeFormat('vi-VN', { numeric: 'auto' });
  const diff = new Date(date).getTime() - Date.now();
  const minutes = Math.floor(diff / 60000);
  
  if (Math.abs(minutes) < 60) {
    return rtf.format(minutes, 'minute');
  }
  const hours = Math.floor(minutes / 60);
  if (Math.abs(hours) < 24) {
    return rtf.format(hours, 'hour');
  }
  const days = Math.floor(hours / 24);
  return rtf.format(days, 'day');
}

export function getStatusVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
  const variants: Record<string, any> = {
    PENDING: 'secondary',
    ACCEPTED: 'default',
    PICKED_UP: 'default',
    DELIVERED: 'outline',
    CANCELLED: 'destructive',
    OPEN: 'secondary',
    IN_PROGRESS: 'default',
    RESOLVED: 'outline',
    APPROVED: 'outline',
    LOCKED: 'destructive'
  };
  return variants[status] || 'default';
}

export function getPriorityVariant(priority: string): "default" | "destructive" | "secondary" {
  const variants: Record<string, any> = {
    LOW: 'default',
    MEDIUM: 'secondary',
    HIGH: 'destructive',
    URGENT: 'destructive'
  };
  return variants[priority] || 'default';
}

// Format currency with compact notation (e.g., 1.5M, 2.3B)
export function formatCurrencyCompact(amount: number): string {
  if (amount >= 1000000000000) {
    return `₫${(amount / 1000000000000).toFixed(1)}T`;
  } else if (amount >= 1000000000) {
    return `₫${(amount / 1000000000).toFixed(1)}B`;
  } else if (amount >= 1000000) {
    return `₫${(amount / 1000000).toFixed(1)}M`;
  } else if (amount >= 1000) {
    return `₫${(amount / 1000).toFixed(0)}K`;
  } else {
    return `₫${amount.toFixed(0)}`;
  }
}

// Format currency without symbol
export function formatCurrencyNoSymbol(amount: number): string {
  return new Intl.NumberFormat('vi-VN').format(amount);
}

// Format number with thousand separators
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('vi-VN').format(num);
}

