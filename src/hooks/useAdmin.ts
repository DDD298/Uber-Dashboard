import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { IDriver } from "@/interface/auth";
import { IRide } from "@/interface/ride";

// Types
interface User {
  clerk_id: string;
  name: string;
  email: string;
  phone?: string;
  created_at: string;
  total_rides: number;
  completed_rides: number;
  total_spent?: number;
}

interface UsersResponse {
  success: boolean;
  data: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface UserResponse {
  success: boolean;
  data: User;
}

interface CreateUserData {
  name: string;
  email: string;
  phone?: string;
}

interface UpdateUserData {
  name?: string;
  email?: string;
  phone?: string;
}

interface UsersQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  sortBy?: string;
  sortOrder?: string;
  approval_status?: string;
}

// Fetch users list
export const useAdminUsers = (params: UsersQueryParams = {}) => {
  const queryParams = new URLSearchParams();
  
  if (params.page) queryParams.append("page", params.page.toString());
  if (params.limit) queryParams.append("limit", params.limit.toString());
  if (params.search) queryParams.append("search", params.search);
  if (params.role) queryParams.append("role", params.role);
  if (params.sortBy) queryParams.append("sortBy", params.sortBy);
  if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);

  return useQuery<UsersResponse>({
    queryKey: ["admin-users", params],
    queryFn: async () => {
      const response = await fetch(`/api/admin/users?${queryParams.toString()}`);
      if (!response.ok) {
        throw new Error("Lỗi khi lấy danh sách người dùng");
      }
      return response.json();
    },
  });
};

// Fetch single user by ID
export const useGetUserById = (userId: string) => {
  return useQuery<UserResponse>({
    queryKey: ["admin-user", userId],
    queryFn: async () => {
      const response = await fetch(`/api/admin/users/${userId}`);
      if (!response.ok) {
        throw new Error("Lỗi khi lấy thông tin người dùng");
      }
      return response.json();
    },
    enabled: !!userId,
  });
};

// Create user
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateUserData) => {
      const response = await fetch("/api/admin/users/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Lỗi khi tạo người dùng");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
  });
};

// Update user
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateUserData }) => {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Lỗi khi cập nhật người dùng");
      }

      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      queryClient.invalidateQueries({ queryKey: ["admin-user", variables.id] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Lỗi khi xóa người dùng");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("Xóa người dùng thành công!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Lỗi khi xóa người dùng");
    },
  });
};

interface DriversResponse {
  success: boolean;
  data: IDriver[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface DriverResponse {
  success: boolean;
  data: IDriver;
}

interface CreateDriverData {
  clerk_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;
  license_plate?: string;
  vehicle_type?: string;
  vehicle_model?: string;
  vehicle_year?: number;
}

interface UpdateDriverData {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone_number?: string;
  license_plate?: string;
  vehicle_type?: string;
  vehicle_model?: string;
  vehicle_year?: number;
  active?: boolean;
}

// Fetch drivers list
export const useAdminDrivers = (params: UsersQueryParams = {}) => {
  const queryParams = new URLSearchParams();
  
  if (params.page) queryParams.append("page", params.page.toString());
  if (params.limit) queryParams.append("limit", params.limit.toString());
  if (params.search) queryParams.append("search", params.search);
  if (params.sortBy) queryParams.append("sortBy", params.sortBy);
  if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);
  if (params.approval_status) queryParams.append("approval_status", params.approval_status);

  return useQuery<DriversResponse>({
    queryKey: ["admin-drivers", params],
    queryFn: async () => {
      const response = await fetch(`/api/admin/drivers?${queryParams.toString()}`);
      if (!response.ok) {
        throw new Error("Lỗi khi lấy danh sách tài xế");
      }
      return response.json();
    },
  });
};

// Fetch single driver by ID
export const useGetDriverById = (driverId: string) => {
  return useQuery<DriverResponse>({
    queryKey: ["admin-driver", driverId],
    queryFn: async () => {
      const response = await fetch(`/api/admin/drivers/${driverId}`);
      if (!response.ok) {
        throw new Error("Lỗi khi lấy thông tin tài xế");
      }
      return response.json();
    },
    enabled: !!driverId,
  });
};

// Create driver
export const useCreateDriver = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateDriverData) => {
      const response = await fetch("/api/admin/drivers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Lỗi khi tạo tài xế");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-drivers"] });
      toast.success("Tạo tài xế thành công!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Lỗi khi tạo tài xế");
    },
  });
};

// Update driver
export const useUpdateDriver = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateDriverData }) => {
      const response = await fetch(`/api/admin/drivers/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Lỗi khi cập nhật tài xế");
      }

      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin-drivers"] });
      queryClient.invalidateQueries({ queryKey: ["admin-driver", variables.id] });
      toast.success("Cập nhật tài xế thành công!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Lỗi khi cập nhật tài xế");
    },
  });
};

// Delete driver
export const useDeleteDriver = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (driverId: string) => {
      const response = await fetch(`/api/admin/drivers/${driverId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Lỗi khi xóa tài xế");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-drivers"] });
      toast.success("Xóa tài xế thành công!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Lỗi khi xóa tài xế");
    },
  });
};

// Promo Code hooks
interface PromoCode {
  id: number;
  code: string;
  description: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  max_discount_amount?: number;
  min_order_amount?: number;
  usage_limit?: number;
  used_count: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface PromoCodesResponse {
  success: boolean;
  data: PromoCode[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface PromoCodeResponse {
  success: boolean;
  data: PromoCode;
}

interface CreatePromoCodeData {
  code: string;
  description: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  max_discount_amount?: number;
  min_order_amount?: number;
  usage_limit?: number;
  start_date: string;
  end_date: string;
  is_active?: boolean;
}

interface UpdatePromoCodeData {
  code?: string;
  description?: string;
  discount_type?: 'percentage' | 'fixed';
  discount_value?: number;
  max_discount_amount?: number;
  min_order_amount?: number;
  usage_limit?: number;
  start_date?: string;
  end_date?: string;
  is_active?: boolean;
}

interface PromoCodesQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  is_active?: boolean;
}

// Fetch promo codes list
export const useAdminPromoCodes = (params: PromoCodesQueryParams = {}) => {
  const queryParams = new URLSearchParams();
  
  if (params.page) queryParams.append("page", params.page.toString());
  if (params.limit) queryParams.append("limit", params.limit.toString());
  if (params.search) queryParams.append("search", params.search);
  if (params.is_active !== undefined) queryParams.append("is_active", params.is_active.toString());

  return useQuery<PromoCodesResponse>({
    queryKey: ["admin-promo-codes", params],
    queryFn: async () => {
      const response = await fetch(`/api/admin/promo-codes?${queryParams.toString()}`);
      if (!response.ok) {
        throw new Error("Lỗi khi lấy danh sách mã giảm giá");
      }
      return response.json();
    },
  });
};

// Fetch single promo code by ID
export const useGetPromoCodeById = (promoCodeId: string) => {
  return useQuery<PromoCodeResponse>({
    queryKey: ["admin-promo-code", promoCodeId],
    queryFn: async () => {
      const response = await fetch(`/api/admin/promo-codes/${promoCodeId}`);
      if (!response.ok) {
        throw new Error("Lỗi khi lấy thông tin mã giảm giá");
      }
      return response.json();
    },
    enabled: !!promoCodeId,
  });
};

// Create promo code
export const useCreatePromoCode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreatePromoCodeData) => {
      const response = await fetch("/api/admin/promo-codes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Lỗi khi tạo mã giảm giá");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-promo-codes"] });
      toast.success("Tạo mã giảm giá thành công!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Lỗi khi tạo mã giảm giá");
    },
  });
};

// Update promo code
export const useUpdatePromoCode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdatePromoCodeData }) => {
      const response = await fetch(`/api/admin/promo-codes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Lỗi khi cập nhật mã giảm giá");
      }

      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin-promo-codes"] });
      queryClient.invalidateQueries({ queryKey: ["admin-promo-code", variables.id.toString()] });
      toast.success("Cập nhật mã giảm giá thành công!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Lỗi khi cập nhật mã giảm giá");
    },
  });
};

// Delete promo code
export const useDeletePromoCode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (promoCodeId: number) => {
      const response = await fetch(`/api/admin/promo-codes/${promoCodeId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Lỗi khi xóa mã giảm giá");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-promo-codes"] });
      toast.success("Xóa mã giảm giá thành công!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Lỗi khi xóa mã giảm giá");
    },
  });
};

// Driver Approval hooks

// Fetch pending drivers
export const usePendingDrivers = (params: UsersQueryParams = {}) => {
  const queryParams = new URLSearchParams();
  
  if (params.page) queryParams.append("page", params.page.toString());
  if (params.limit) queryParams.append("limit", params.limit.toString());

  return useQuery<DriversResponse>({
    queryKey: ["pending-drivers", params],
    queryFn: async () => {
      const response = await fetch(`/api/admin/drivers/pending?${queryParams.toString()}`);
      if (!response.ok) {
        throw new Error("Lỗi khi lấy danh sách tài xế chờ duyệt");
      }
      return response.json();
    },
  });
};

// Approve or reject driver
export const useApproveDriver = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      driverId, 
      approval_status, 
      rejection_reason 
    }: { 
      driverId: number; 
      approval_status: 'approved' | 'rejected';
      rejection_reason?: string;
    }) => {
      const response = await fetch(`/api/admin/drivers/${driverId}/approve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ approval_status, rejection_reason }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Lỗi khi duyệt tài xế");
      }

      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["pending-drivers"] });
      queryClient.invalidateQueries({ queryKey: ["admin-drivers"] });
      
      if (data.data.approval_status === 'approved') {
        toast.success("Đã duyệt tài xế thành công!");
      } else {
        toast.success("Đã từ chối tài xế!");
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "Lỗi khi duyệt tài xế");
    },
  });
};

// Ticket hooks
interface Ticket {
  _id: string;
  userId?: {
    name: string;
  };
  subject: string;
  content: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  assignedTo?: string;
  resolution?: string;
  createdAt: string;
  updatedAt: string;
}

interface TicketsResponse {
  success: boolean;
  data: Ticket[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface TicketsQueryParams {
  status?: string;
  page?: number;
  limit?: number;
  search?: string;
}

interface UpdateTicketStatusData {
  status?: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  resolution?: string;
  assignedTo?: string;
}

// Fetch tickets list
export const useAdminTickets = (params: TicketsQueryParams = {}) => {
  const queryParams = new URLSearchParams();
  
  if (params.page) queryParams.append("page", params.page.toString());
  if (params.limit) queryParams.append("limit", params.limit.toString());
  if (params.search) queryParams.append("search", params.search);
  if (params.status) queryParams.append("status", params.status);

  return useQuery<TicketsResponse>({
    queryKey: ["admin-tickets", params],
    queryFn: async () => {
      const response = await fetch(`/api/admin/tickets?${queryParams.toString()}`);
      if (!response.ok) {
        throw new Error("Lỗi khi lấy danh sách tickets");
      }
      return response.json();
    },
  });
};

// Update ticket status
export const useUpdateTicketStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateTicketStatusData }) => {
      const response = await fetch(`/api/admin/tickets/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Lỗi khi cập nhật ticket");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-tickets"] });
      toast.success("Cập nhật ticket thành công!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Lỗi khi cập nhật ticket");
    },
  });
};

// Ride hooks

interface RidesResponse {
  success: boolean;
  data: IRide[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface RideResponse {
  success: boolean;
  data: IRide;
}

interface RidesQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  payment_status?: string;
  sortBy?: string;
  sortOrder?: string;
}

interface UpdateRideData {
  status?: IRide['status'];
  payment_status?: IRide['payment_status'];
  driver_id?: string;
  cancellation_reason?: string;
  driver_rating?: number;
  user_rating?: number;
  notes?: string;
}

export const useAdminRides = (params: RidesQueryParams = {}) => {
  const queryParams = new URLSearchParams();
  
  if (params.page) queryParams.append("page", params.page.toString());
  if (params.limit) queryParams.append("limit", params.limit.toString());
  if (params.search) queryParams.append("search", params.search);
  if (params.status) queryParams.append("status", params.status);
  if (params.payment_status) queryParams.append("payment_status", params.payment_status);
  if (params.sortBy) queryParams.append("sortBy", params.sortBy);
  if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);

  return useQuery<RidesResponse>({
    queryKey: ["admin-rides", params],
    queryFn: async () => {
      const response = await fetch(`/api/admin/rides?${queryParams.toString()}`);
      if (!response.ok) {
        throw new Error("Lỗi khi lấy danh sách chuyến đi");
      }
      return response.json();
    },
  });
};

// Fetch single ride by ID
export const useGetRideById = (rideId: string) => {
  return useQuery<RideResponse>({
    queryKey: ["admin-ride", rideId],
    queryFn: async () => {
      const response = await fetch(`/api/admin/rides/${rideId}`);
      if (!response.ok) {
        throw new Error("Lỗi khi lấy thông tin chuyến đi");
      }
      return response.json();
    },
    enabled: !!rideId,
  });
};

// Update ride
export const useUpdateRide = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string | number; data: UpdateRideData }) => {
      const response = await fetch(`/api/admin/rides/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Lỗi khi cập nhật chuyến đi");
      }

      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin-rides"] });
      queryClient.invalidateQueries({ queryKey: ["admin-ride", variables.id.toString()] });
      toast.success("Cập nhật chuyến đi thành công!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Lỗi khi cập nhật chuyến đi");
    },
  });
};

// Delete ride
export const useDeleteRide = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (rideId: string | number) => {
      const response = await fetch(`/api/admin/rides/${rideId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Lỗi khi xóa chuyến đi");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-rides"] });
      toast.success("Xóa chuyến đi thành công!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Lỗi khi xóa chuyến đi");
    },
  });
};
