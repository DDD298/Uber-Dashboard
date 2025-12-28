# Tổng quan cấu trúc Format Utils

## ✅ Cấu trúc hiện tại (Đã chuẩn hóa)

### 1. `src/lib/formatters.ts` - FILE CHÍNH CHO FORMAT

**Mục đích**: Tất cả các hàm format (tiền tệ, ngày giờ, số)

**Các hàm có sẵn**:

- `formatCurrency(amount)` - Format tiền VND đầy đủ
- `formatCurrencyCompact(amount)` - Format rút gọn (₫1.5M, ₫2.3B)
- `formatCurrencyNoSymbol(amount)` - Format số không ký hiệu
- `formatNumber(num)` - Format số với dấu phân cách
- `formatDate(date)` - Format ngày giờ
- `formatRelativeTime(date)` - Thời gian tương đối
- `getStatusVariant(status)` - Badge variant cho status
- `getPriorityVariant(priority)` - Badge variant cho priority

**Import**:

```typescript
import { formatCurrency, formatNumber } from "@/lib/formatters";
```

---

### 2. `src/lib/utils.ts` - UTILS CHUNG

**Mục đích**: Các utility functions không liên quan đến format tiền tệ

**Các hàm có sẵn**:

- `cn(...inputs)` - Merge className (dùng cho Tailwind)
- `formatAddress(address)` - Rút gọn địa chỉ blockchain
- `formatTimestamp(timestamp)` - Format timestamp (đã Việt hóa)

**Import**:

```typescript
import { cn } from "@/lib/utils";
```

---

### 3. `src/utils/` - UTILS KHÁC

**Các file còn lại**:

- `auth.ts` - Authentication utilities
- `dateFormat.ts` - Date formatting utilities
- `format.ts` - General formatting
- `tokenStorage.ts` - Token storage utilities

---

## ❌ Đã xóa (Trùng lặp)

- ~~`src/utils/currencyFormat.ts`~~ - Đã xóa
- ~~`src/utils/index.ts`~~ - Đã xóa

---

## 📋 Quy tắc sử dụng

### ✅ ĐÚNG

```typescript
// Format tiền tệ
import { formatCurrency } from "@/lib/formatters";
const price = formatCurrency(1000000); // "1.000.000 ₫"

// Format số
import { formatNumber } from "@/lib/formatters";
const count = formatNumber(1000); // "1.000"

// Merge className
import { cn } from "@/lib/utils";
const className = cn("text-red-500", isActive && "font-bold");
```

### ❌ SAI

```typescript
// KHÔNG import formatCurrency từ @/lib/utils
import { formatCurrency } from "@/lib/utils"; // ❌ SAI!

// KHÔNG import từ các file đã xóa
import { formatCurrency } from "@/utils/currencyFormat"; // ❌ File không tồn tại
import { formatCurrency } from "@/utils/index"; // ❌ File không tồn tại
```

---

## 🎯 Chuẩn hóa

- **Tiền tệ**: VND (₫)
- **Locale**: vi-VN
- **Ngôn ngữ**: Tiếng Việt
- **Format số**: Dấu phân cách hàng nghìn theo chuẩn VN

---

## 📚 Tài liệu

Xem chi tiết tại: `src/lib/FORMATTERS_README.md`
