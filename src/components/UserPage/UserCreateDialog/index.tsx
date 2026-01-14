"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateUser } from "@/hooks/useAdmin";
import { toast } from "react-toastify";
import {
  IconLoader2,
  IconPlus,
  IconEye,
  IconEyeOff,
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface UserCreateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const UserCreateDialog = ({
  isOpen,
  onClose,
  onSuccess,
}: UserCreateDialogProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);

  const { mutate: createUserMutation, isPending } = useCreateUser();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email is not valid";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    createUserMutation(formData, {
      onSuccess: (response: any) => {
        toast.success("User created successfully!");
        handleClose();
        onSuccess?.();
      },
      onError: (error: any) => {
        toast.error(error?.message || "There was an error creating the user!");
      },
    });
  };

  const handleClose = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      phone: "",
    });
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        size="medium"
        className="max-h-[90vh] overflow-y-auto bg-white max-w-2xl"
      >
        <DialogHeader>
          <DialogTitle className="text-gray-700">
            Thêm người dùng mới
          </DialogTitle>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-700">
                Tên <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter user name"
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

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700">
                Mật khẩu <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Tối thiểu 8 ký tự"
                  className={`${
                    errors.password ? "border-red-500" : "border-lightBorderV1"
                  } focus:border-mainTextHoverV1 pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  {showPassword ? (
                    <IconEyeOff className="h-4 w-4" />
                  ) : (
                    <IconEye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password}</p>
              )}
            </div>

            <div className="flex gap-2 pt-4 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isPending}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <IconLoader2 className="h-4 w-4 animate-spin" />
                    Đang tạo...
                  </>
                ) : (
                  <>
                    <IconPlus className="h-4 w-4" />
                    Tạo người dùng
                  </>
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};
