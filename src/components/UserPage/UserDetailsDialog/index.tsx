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
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { mutate: updateUserMutation, isPending: isUpdating } = useUpdateUser();

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
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
          <DialogTitle className="text-gray-800">
            {isEditing
              ? `Sửa thông tin người dùng: ${user.name}`
              : "Chi tiết người dùng"}
          </DialogTitle>
        </DialogHeader>

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
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Clerk ID</p>
                    <p className="font-semibold text-gray-800">
                      {user.clerk_id}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Tên</p>
                    <p className="font-semibold text-gray-800">{user.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-semibold text-gray-800">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Tổng chuyến đi</p>
                    <Badge variant="blue">{user.total_rides || 0}</Badge>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">
                      Chuyến đi hoàn thành
                    </p>
                    <Badge variant="green">{user.completed_rides || 0}</Badge>
                  </div>
                </div>
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
