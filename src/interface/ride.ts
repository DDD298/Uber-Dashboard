// Ride-related interfaces
export interface IRide {
  id: number;
  ride_id: string;
  
  // User and Driver info
  user_id: string;
  driver_id: string;
  user?: {
    clerk_id: string;
    name: string;
    email: string;
    phone_number?: string;
  };
  driver?: {
    clerk_id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone_number?: string;
    vehicle_type?: string;
    license_plate?: string;
  };
  
  // Location info
  origin_address: string;
  destination_address: string;
  origin_latitude: number;
  origin_longitude: number;
  destination_latitude: number;
  destination_longitude: number;
  
  // Ride details
  ride_time: number; // in minutes
  fare_price: number;
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded';
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
  
  // Promo code
  promo_code_id?: number;
  promo_code?: {
    code: string;
    discount_value: number;
    discount_type: 'percentage' | 'fixed';
  };
  discount_amount?: number;
  final_price: number;
  
  // Timestamps
  created_at: string;
  updated_at: string;
  started_at?: string;
  completed_at?: string;
  cancelled_at?: string;
  
  // Additional info
  cancellation_reason?: string;
  driver_rating?: number;
  user_rating?: number;
  notes?: string;
}

export interface IRideCreateInput {
  user_id: string;
  driver_id: string;
  origin_address: string;
  destination_address: string;
  origin_latitude: number;
  origin_longitude: number;
  destination_latitude: number;
  destination_longitude: number;
  ride_time: number;
  fare_price: number;
  promo_code_id?: number;
}

export interface IRideUpdateInput {
  status?: IRide['status'];
  payment_status?: IRide['payment_status'];
  driver_id?: string;
  cancellation_reason?: string;
  driver_rating?: number;
  user_rating?: number;
  notes?: string;
}
