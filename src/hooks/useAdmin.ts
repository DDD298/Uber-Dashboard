import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

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
  clerk_id: string;
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
      const response = await fetch("/api/admin/users", {
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

// Driver hooks
interface Driver {
  clerk_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;
  license_plate?: string;
  vehicle_type?: string;
  vehicle_model?: string;
  vehicle_year?: number;
  average_rating?: number;
  rating_count?: number;
  total_rides?: number;
  total_earnings?: number;
  active?: boolean;
  created_at?: string;
}

interface DriversResponse {
  success: boolean;
  data: Driver[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface DriverResponse {
  success: boolean;
  data: Driver;
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

