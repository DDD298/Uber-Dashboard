# API Mã Giảm Giá (Promo Codes)

## Base URL

```
/api/promo-codes
```

## Endpoints

### 1. Lấy danh sách mã giảm giá đang hoạt động

**Endpoint:** `GET /api/promo-codes/active`

**Mô tả:** Lấy tất cả các mã giảm giá đang hoạt động (is_active = true) và còn hạn sử dụng.

**Query Parameters:**

- Không có

**Response Success (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "code": "SUMMER2024",
      "description": "Giảm giá mùa hè 2024",
      "discount_type": "percentage",
      "discount_value": 20,
      "max_discount_amount": 50000,
      "min_order_amount": 100000,
      "usage_limit": 1000,
      "used_count": 245,
      "start_date": "2024-06-01T00:00:00.000Z",
      "end_date": "2024-08-31T23:59:59.000Z",
      "is_active": true,
      "created_at": "2024-05-15T10:30:00.000Z",
      "updated_at": "2024-06-01T08:00:00.000Z"
    }
  ]
}
```

**Response Error (500):**

```json
{
  "success": false,
  "error": "Lỗi khi lấy danh sách mã giảm giá"
}
```

---

### 2. Kiểm tra và áp dụng mã giảm giá

**Endpoint:** `POST /api/promo-codes/validate`

**Mô tả:** Kiểm tra tính hợp lệ của mã giảm giá và tính toán số tiền giảm.

**Request Body:**

```json
{
  "code": "SUMMER2024",
  "order_amount": 150000
}
```

**Response Success (200):**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "code": "SUMMER2024",
    "discount_type": "percentage",
    "discount_value": 20,
    "discount_amount": 30000,
    "final_amount": 120000,
    "message": "Mã giảm giá hợp lệ"
  }
}
```

**Response Error (400):**

```json
{
  "success": false,
  "error": "Mã giảm giá không tồn tại"
}
```

**Các lỗi có thể xảy ra:**

- Mã giảm giá không tồn tại
- Mã giảm giá đã hết hạn
- Mã giảm giá chưa đến thời gian sử dụng
- Mã giảm giá đã hết lượt sử dụng
- Đơn hàng không đủ giá trị tối thiểu

---

## Cấu trúc dữ liệu

### PromoCode Object

| Field                 | Type                    | Description                                      |
| --------------------- | ----------------------- | ------------------------------------------------ |
| `id`                  | number                  | ID của mã giảm giá                               |
| `code`                | string                  | Mã code (VD: "SUMMER2024")                       |
| `description`         | string                  | Mô tả mã giảm giá                                |
| `discount_type`       | "percentage" \| "fixed" | Loại giảm giá: phần trăm hoặc cố định            |
| `discount_value`      | number                  | Giá trị giảm (% hoặc số tiền)                    |
| `max_discount_amount` | number \| null          | Số tiền giảm tối đa (chỉ áp dụng cho percentage) |
| `min_order_amount`    | number \| null          | Giá trị đơn hàng tối thiểu                       |
| `usage_limit`         | number \| null          | Giới hạn số lần sử dụng                          |
| `used_count`          | number                  | Số lần đã sử dụng                                |
| `start_date`          | string (ISO 8601)       | Ngày bắt đầu                                     |
| `end_date`            | string (ISO 8601)       | Ngày kết thúc                                    |
| `is_active`           | boolean                 | Trạng thái hoạt động                             |
| `created_at`          | string (ISO 8601)       | Ngày tạo                                         |
| `updated_at`          | string (ISO 8601)       | Ngày cập nhật                                    |

---

## Ví dụ sử dụng

### JavaScript/TypeScript

```typescript
// Lấy danh sách mã giảm giá đang hoạt động
async function getActivePromoCodes() {
  try {
    const response = await fetch("/api/promo-codes/active");
    const data = await response.json();

    if (data.success) {
      return data.data;
    } else {
      throw new Error(data.error);
    }
  } catch (error) {
    console.error("Error fetching promo codes:", error);
    throw error;
  }
}

// Validate mã giảm giá
async function validatePromoCode(code: string, orderAmount: number) {
  try {
    const response = await fetch("/api/promo-codes/validate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code,
        order_amount: orderAmount,
      }),
    });

    const data = await response.json();

    if (data.success) {
      return data.data;
    } else {
      throw new Error(data.error);
    }
  } catch (error) {
    console.error("Error validating promo code:", error);
    throw error;
  }
}

// Sử dụng
const promoCodes = await getActivePromoCodes();
console.log("Available promo codes:", promoCodes);

const validation = await validatePromoCode("SUMMER2024", 150000);
console.log("Discount amount:", validation.discount_amount);
console.log("Final amount:", validation.final_amount);
```

### React Hook Example

```typescript
import { useQuery, useMutation } from "@tanstack/react-query";

// Hook để lấy mã giảm giá
export const useActivePromoCodes = () => {
  return useQuery({
    queryKey: ["active-promo-codes"],
    queryFn: async () => {
      const response = await fetch("/api/promo-codes/active");
      if (!response.ok) {
        throw new Error("Failed to fetch promo codes");
      }
      const data = await response.json();
      return data.data;
    },
  });
};

// Hook để validate mã giảm giá
export const useValidatePromoCode = () => {
  return useMutation({
    mutationFn: async ({
      code,
      orderAmount,
    }: {
      code: string;
      orderAmount: number;
    }) => {
      const response = await fetch("/api/promo-codes/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          order_amount: orderAmount,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error);
      }

      return data.data;
    },
  });
};

// Sử dụng trong component
function CheckoutPage() {
  const { data: promoCodes, isLoading } = useActivePromoCodes();
  const { mutate: validateCode, isPending } = useValidatePromoCode();

  const handleApplyPromoCode = (code: string) => {
    validateCode(
      { code, orderAmount: 150000 },
      {
        onSuccess: (data) => {
          console.log("Discount applied:", data.discount_amount);
        },
        onError: (error) => {
          console.error("Invalid promo code:", error.message);
        },
      }
    );
  };

  return <div>{/* UI code */}</div>;
}
```

---

## Lưu ý

1. **Thời gian**: Tất cả thời gian đều theo chuẩn ISO 8601 (UTC)
2. **Tiền tệ**: Tất cả số tiền đều tính bằng VNĐ
3. **Validation**: Client nên validate mã giảm giá trước khi submit đơn hàng
4. **Cache**: Có thể cache danh sách mã giảm giá đang hoạt động trong 5-10 phút
5. **Error Handling**: Luôn xử lý các trường hợp lỗi và hiển thị thông báo phù hợp cho người dùng

---

## Status Codes

| Code | Description                          |
| ---- | ------------------------------------ |
| 200  | Success                              |
| 400  | Bad Request (Invalid input)          |
| 404  | Not Found (Promo code doesn't exist) |
| 500  | Internal Server Error                |
