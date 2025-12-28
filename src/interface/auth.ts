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
  _id?: string;
  clerk_id?: string;
  id?: number;
  first_name: string;
  last_name: string;
  email?: string;
  phone_number?: string;
  avatar?: string | null;
  profile_image_url?: string | null;
  car_image_url?: string | null;
  car_seats?: number;
  license_plate?: string;
  vehicle_type?: string;
  vehicle_model?: string;
  vehicle_year?: number;
  rating?: number;
  average_rating?: number;
  rating_count?: number;
  total_rides?: number | string;
  completed_rides?: number | string;
  total_earnings?: number | string | null;
  active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ICreateDriverBody {
  clerk_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;
  avatar?: string;
  license_plate?: string;
  vehicle_type?: string;
  vehicle_model?: string;
  vehicle_year?: number;
  active?: boolean;
}

export interface IUpdateDriverBody {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone_number?: string;
  avatar?: string;
  license_plate?: string;
  vehicle_type?: string;
  vehicle_model?: string;
  vehicle_year?: number;
  active?: boolean;
}

