export type UserRole = 'CUSTOMER' | 'DRIVER' | 'ADMIN' | 'DISPATCHER';

export interface IDepartment {
  _id: string;
  name: string;
  code: string;
}

export interface IUser {
  _id?: string;
  clerk_id: string;
  id?: string;
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
  total_rides?: number;
  completed_rides?: number;
  total_spent?: number;
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

export interface ICreateUserBody {
  clerk_id: string;
  name: string;
  email: string;
  phone?: string;
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
  total_warnings?: number | string;
  active_warnings?: number | string;
  current_latitude?: number | null;
  current_longitude?: number | null;
  last_location_update?: string | null;
  recentRides?: any[];
  recentRatings?: any[];
  created_at?: string;
  updated_at?: string;
  _id?: string;
  phone_number?: string;
  license_plate?: string;
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

