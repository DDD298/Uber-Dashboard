export interface IDriver {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  profile_image_url: string;
  car_image_url: string;
  car_seats: number;
  rating: number;
  vehicle_type: string;
  license_plate: string; // Biển số xe
  
  // Rating system fields
  rating_count: number;
  average_rating: number;
  bad_ratings_count: number;
  
  // Approval & Status fields
  status: 'pending' | 'active' | 'warned' | 'suspended' | 'under_review' | 'banned' | 'rejected';
  approval_status: 'pending' | 'approved' | 'rejected';
  approval_date?: string;
  approved_by?: string;
  rejection_reason?: string;
  
  // Warning system fields
  warning_count: number;
  last_warning_at?: string;
  suspended_at?: string;
  suspension_reason?: string;
  
  // Trip statistics
  total_trips: number;
  completed_trips: number;
  cancelled_trips: number;
  
  created_at: string;
  updated_at: string;
}

export interface IDriverCreateInput {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  profile_image_url: string;
  car_image_url: string;
  car_seats: number;
  vehicle_type: string;
  license_plate: string;
}

export interface IDriverUpdateInput {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  profile_image_url?: string;
  car_image_url?: string;
  car_seats?: number;
  vehicle_type?: string;
  license_plate?: string;
  status?: IDriver['status'];
}

export interface IDriverApprovalInput {
  driver_id: number;
  approval_status: 'approved' | 'rejected';
  rejection_reason?: string;
}
