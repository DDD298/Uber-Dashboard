# 📚 Hướng Dẫn Tích Hợp API cho Admin Dashboard

## 🗄️ Database Schema

### **Tables Chính**

#### 1. **users**

```typescript
interface User {
  clerk_id: string; // Primary Key từ Clerk Auth
  name: string;
  email: string;
  phone?: string;
  created_at: timestamp;
}
```

#### 2. **drivers**

```typescript
interface Driver {
  id: number;              // Primary Key
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  profile_image_url: string;
  car_image_url: string;
  car_seats: number;
  rating: number;
  vehicle_type: string;
  // Rating system fields
  rating_count: number;
  average_rating: decimal(3,2);
  bad_ratings_count: number;
  // Warning system fields
  status: enum('active', 'warned', 'suspended', 'under_review', 'banned');
  warning_count: number;
  last_warning_at: timestamp;
  suspended_at: timestamp;
  suspension_reason: text;
}
```

#### 3. **rides**

```typescript
interface Ride {
  ride_id: number; // Primary Key
  origin_address: string;
  destination_address: string;
  origin_latitude: number;
  origin_longitude: number;
  destination_latitude: number;
  destination_longitude: number;
  ride_time: number; // minutes
  fare_price: number;
  payment_status: string; // 'paid', 'pending', 'refunded'
  ride_status: enum; // 'confirmed', 'driver_arrived', 'in_progress', 'completed', 'cancelled', 'no_show'
  driver_id: number; // FK -> drivers.id
  user_id: string; // FK -> users.clerk_id
  payment_intent_id: string;
  created_at: timestamp;
  cancelled_at: timestamp;
  cancel_reason: text;
}
```

#### 4. **ratings**

```typescript
interface Rating {
  id: number; // Primary Key
  ride_id: number; // FK -> rides.ride_id (UNIQUE)
  user_id: string; // FK -> users.clerk_id
  driver_id: number; // FK -> drivers.id
  stars: number; // 1-5
  comment: text;
  created_at: timestamp;
}
```

#### 5. **driver_warnings**
