"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGetUserById, useUpdateUser } from "@/hooks/useAdmin";
import { toast } from "react-toastify";
import { IconEdit, IconLoader2 } from "@tabler/icons-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface UserDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  onSuccess?: () => void;
}

export const UserDetailsDialog = ({
  isOpen,
  onClose,
  userId,
  onSuccess,
}: UserDetailsDialogProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: userData, isLoading: isLoadingUser } = useGetUserById(userId);
  const { mutate: updateUserMutation, isPending: isUpdating } = useUpdateUser();

  useEffect(() => {
    if (userData?.data) {
      const user = userData.data;
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [userData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email?.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email is not valid";
    }

    if (formData.phone && !/^[\d\s\-+()]+$/.test(formData.phone)) {
      newErrors.phone = "Phone number is not valid";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    updateUserMutation(
      { id: userId, data: formData },
      {
        onSuccess: (_response: any) => {
          toast.success("User updated successfully!");
          setIsEditing(false);
          onSuccess?.();
        },
        onError: (error: any) => {
          toast.error(
            error?.message || "An error occurred while updating user!"
          );
        },
      }
    );
  };

  const handleClose = () => {
    setIsEditing(false);
    setErrors({});
    onClose();
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setErrors({});
    if (userData?.data) {
      const user = userData.data;
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        size="medium"
        className="max-h-[90vh] overflow-y-auto bg-white"
      >
        <DialogHeader>
          <DialogTitle className="text-gray-800">
            {isEditing
              ? `Sửa thông tin người dùng: ${userData?.data?.name}`
              : "Chi tiết người dùng"}
          </DialogTitle>
        </DialogHeader>

        {isLoadingUser ? (
          <div className="space-y-4">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {isEditing ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-800">
                    Tên <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter name"
                    className={`${
                      errors.name ? "border-red-500" : "border-lightBorderV1"
                    } focus:border-mainTextHoverV1`}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm">{errors.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-800">
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email"
                    className={`${
                      errors.email ? "border-red-500" : "border-lightBorderV1"
                    } focus:border-mainTextHoverV1`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-gray-800">
                    Số điện thoại
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    className={`${
                      errors.phone ? "border-red-500" : "border-lightBorderV1"
                    } focus:border-mainTextHoverV1`}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm">{errors.phone}</p>
                  )}
                </div>

                <div className="flex gap-2 justify-end pt-4">
                  <Button
                    variant="outline"
                    onClick={handleCancelEdit}
                    disabled={isUpdating}
                  >
                    Hủy
                  </Button>
                  <Button onClick={handleSubmit} disabled={isUpdating}>
                    {isUpdating ? (
                      <>
                        <IconLoader2 className="h-4 w-4 animate-spin" />
                        Đang cập nhật...
                      </>
                    ) : (
                      "Lưu thay đổi"
                    )}
                  </Button>
                </div>
              </>
            ) : (
              <>
                {userData?.data && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Clerk ID</p>
                        <p className="font-semibold text-gray-800">
                          {userData.data.clerk_id}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Tên</p>
                        <p className="font-semibold text-gray-800">
                          {userData.data.name}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-semibold text-gray-800">
                          {userData.data.email}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Số điện thoại</p>
                        <p className="font-semibold text-gray-800">
                          {userData.data.phone || "-"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Tổng chuyến đi</p>
                        <Badge variant="blue">
                          {userData.data.total_rides || 0}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">
                          Chuyến đi hoàn thành
                        </p>
                        <Badge variant="green">
                          {userData.data.completed_rides || 0}
                        </Badge>
                      </div>
                      {userData.data.total_spent !== undefined && (
                        <div>
                          <p className="text-sm text-gray-500">Tổng chi tiêu</p>
                          <p className="font-semibold text-gray-800">
                            ${Number(userData.data.total_spent).toFixed(2)}
                          </p>
                        </div>
                      )}
                      <div>
                        <p className="text-sm text-gray-500">Ngày tạo</p>
                        <p className="font-semibold text-gray-800">
                          {userData.data.created_at
                            ? new Date(
                                userData.data.created_at
                              ).toLocaleDateString()
                            : "-"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                <div className="flex gap-2 justify-end pt-4">
                  <Button variant="outline" onClick={handleClose}>
                    Đóng
                  </Button>
                  <Button onClick={handleEdit}>
                    <IconEdit className="h-4 w-4" />
                    Sửa thông tin người dùng
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
