"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUpdateUser } from "@/hooks/useAdmin";
import { toast } from "react-toastify";
import { IconEdit, IconLoader2 } from "@tabler/icons-react";

import type { IUser } from "@/interface/auth";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { formatPhoneNumber } from "@/utils/phoneFormat";

interface UserDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user: IUser | null;
  onSuccess?: () => void;
}

export const UserDetailsDialog = ({
  isOpen,
  onClose,
  user,
  onSuccess,
}: UserDetailsDialogProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { mutate: updateUserMutation, isPending: isUpdating } = useUpdateUser();

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm() || !user) {
      return;
    }

    // Determine the correct ID to use (clerk_id, _id, or id)
    const userId = user.clerk_id || user._id || user.id;

    if (!userId) {
      toast.error("Cannot find user ID for update");
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
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        size="medium"
        className="max-h-[90vh] overflow-y-auto bg-white"
      >
        <DialogHeader>
          <DialogTitle className="text-gray-700">
            {isEditing
              ? `Sửa thông tin người dùng: ${user.name}`
              : "Chi tiết người dùng"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {isEditing ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-700">
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
                <Label htmlFor="email" className="text-gray-700">
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
                <Label htmlFor="phone" className="text-gray-700">
                  Số điện thoại
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Nhập số điện thoại"
                  className="border-lightBorderV1 focus:border-mainTextHoverV1"
                />
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
              <div className="overflow-hidden rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <tbody className="divide-y divide-gray-200 bg-white">
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-700 bg-gray-50 w-1/3">
                        Clerk ID
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                          {user.clerk_id}
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-700 bg-gray-50">
                        Họ tên
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 font-semibold">
                        {user.name}
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-700 bg-gray-50">
                        Email
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <a
                          href={`mailto:${user.email}`}
                          className="text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {user.email}
                        </a>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-700 bg-gray-50">
                        Số điện thoại
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {user.phone ? (
                          <a
                            href={`tel:${user.phone}`}
                            className="text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            {formatPhoneNumber(user.phone)}
                          </a>
                        ) : (
                          <span className="text-gray-400 italic">
                            Chưa cập nhật
                          </span>
                        )}
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-700 bg-gray-50">
                        Tổng chuyến đi
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <Badge variant="blue">{user.total_rides || 0}</Badge>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-700 bg-gray-50">
                        Chuyến đi hoàn thành
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <Badge variant="green">
                          {user.completed_rides || 0}
                        </Badge>
                      </td>
                    </tr>
                    {user.total_spent !== undefined &&
                      user.total_spent !== null && (
                        <tr className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 text-sm font-medium text-gray-700 bg-gray-50">
                            Tổng chi tiêu
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            <span className="font-semibold text-green-600">
                              {new Intl.NumberFormat("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              }).format(user.total_spent)}
                            </span>
                          </td>
                        </tr>
                      )}
                  </tbody>
                </table>
              </div>
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
      </DialogContent>
    </Dialog>
  );
};
