export type UserRole = 'CUSTOMER' | 'DRIVER' | 'ADMIN' | 'DISPATCHER';

export interface IDepartment {
  _id: string;
  name: string;
  code: string;
}

export interface IUser {
  _id?: string; // For compatibility with old code
  clerk_id: string; // Primary identifier from the API
  id?: string; // Some endpoints use id, others use _id
  phone?: string;
  email: string;
  name: string;
  role?: UserRole;
  avatar?: string | null;
  walletBalance?: number;
  rating?: number;
  created_at?: string;
  createdAt?: string;
  updatedAt?: string;
  // Additional fields from the users API
  total_rides?: number;
  completed_rides?: number;
  total_spent?: number;
  // Additional fields for admin user management (legacy)
  studentId?: string;
  fullName?: string;
  phoneNumber?: string;
  gender?: string;
  department?: IDepartment;
  active?: boolean;
}

export interface IAuthResponse {
  statusCode: number;
  message: string;
  data: {
    accessToken: string;
    user: IUser;
  };
}

export interface IProfileResponse {
  statusCode: number;
  message: string;
  data: IUser;
}

// Request interfaces for user management
export interface ICreateUserBody {
  clerk_id: string;
  name: string;
  email: string;
  phone?: string;
  // Legacy fields for compatibility
  password?: string;
  studentId?: string;
  fullName?: string;
  phoneNumber?: string;
  avatar?: string;
  role?: string;
  department?: string;
  active?: boolean;
}

export interface IUpdateUserBody {
  name?: string;
  email?: string;
  phone?: string;
  // Legacy fields for compatibility
  password?: string;
  studentId?: string;
  fullName?: string;
  phoneNumber?: string;
  avatar?: string;
  role?: string;
  department?: string;
  active?: boolean;
}

// Upload response interface
export interface IUploadResponse {
  status: boolean;
  message: string;
  data: {
    url: string;
    filename?: string;
    size?: number;
  };
}

// Driver interfaces
export interface IDriver {
  id: number;
  first_name: string;
  last_name: string;
  profile_image_url?: string | null;
  car_image_url?: string | null;
  car_seats: number;
  rating?: number;
  vehicle_type: string;
  rating_count?: number;
  average_rating?: number;
  clerk_id?: string;
  email?: string;
  phone?: string;
  license_number?: string;
  approval_status?: string;
  status?: string;
  total_rides?: number;
  completed_rides?: number;
  cancelled_rides?: number;
  total_earnings?: number;
  warning_count?: number;
  current_latitude?: number;
  current_longitude?: number;
  last_location_update?: string;
  created_at?: string;
  updated_at?: string;
  
  // Legacy fields compatibility (optional)
  _id?: string;
  phone_number?: string; // mapping to phone
  license_plate?: string; // mapping to license_number
  active?: boolean;
}

export interface ICreateDriverBody {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  clerk_id?: string;
  profile_image_url?: string;
  car_image_url?: string;
  car_seats: number;
  vehicle_type: string;
  license_number?: string;
}

export interface IUpdateDriverBody {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  profile_image_url?: string;
  car_image_url?: string;
  car_seats?: number;
  vehicle_type?: string;
  license_number?: string;
  status?: string;
  approval_status?: string;
}

