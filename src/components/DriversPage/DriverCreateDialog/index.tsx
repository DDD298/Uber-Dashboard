"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateDriver } from "@/hooks/useAdmin";
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

interface DriverCreateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const DriverCreateDialog = ({
  isOpen,
  onClose,
  onSuccess,
}: DriverCreateDialogProps) => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    license_plate: "",
    vehicle_type: "",
    vehicle_model: "",
    vehicle_year: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);

  const { mutate: createDriverMutation, isPending } = useCreateDriver();

  const handleChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.first_name.trim()) {
      newErrors.first_name = "Tên là bắt buộc";
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = "Họ là bắt buộc";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email là bắt buộc";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Mật khẩu là bắt buộc";
    } else if (formData.password.length < 8) {
      newErrors.password = "Mật khẩu phải có ít nhất 8 ký tự";
    }

    if (formData.vehicle_year) {
      const year = parseInt(formData.vehicle_year);
      const currentYear = new Date().getFullYear();
      if (isNaN(year) || year < 1900 || year > currentYear + 1) {
        newErrors.vehicle_year = `Năm phải từ 1900 đến ${currentYear + 1}`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const submitData = {
      ...formData,
      vehicle_year: formData.vehicle_year
        ? parseInt(formData.vehicle_year)
        : undefined,
    };

    createDriverMutation(submitData as any, {
      onSuccess: (_response: any) => {
        toast.success("Tạo tài xế thành công!");
        handleClose();
        onSuccess?.();
      },
      onError: (error: any) => {
        toast.error(error?.message || "Có lỗi khi tạo tài xế!");
      },
    });
  };

  const handleClose = () => {
    setFormData({
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      license_plate: "",
      vehicle_type: "",
      vehicle_model: "",
      vehicle_year: "",
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
          <DialogTitle className="text-gray-700">Thêm tài xế mới</DialogTitle>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Password Field */}
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
                  onChange={(e) => handleChange("password", e.target.value)}
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

            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name" className="text-gray-700">
                  Tên <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="first_name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={(e) => handleChange("first_name", e.target.value)}
                  placeholder="Nhập tên"
                  className={`${
                    errors.first_name
                      ? "border-red-500"
                      : "border-lightBorderV1"
                  } focus:border-mainTextHoverV1`}
                />
                {errors.first_name && (
                  <p className="text-red-500 text-sm">{errors.first_name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="last_name" className="text-gray-700">
                  Họ <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="last_name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={(e) => handleChange("last_name", e.target.value)}
                  placeholder="Nhập họ"
                  className={`${
                    errors.last_name ? "border-red-500" : "border-lightBorderV1"
                  } focus:border-mainTextHoverV1`}
                />
                {errors.last_name && (
                  <p className="text-red-500 text-sm">{errors.last_name}</p>
                )}
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="Nhập email"
                className={`${
                  errors.email ? "border-red-500" : "border-lightBorderV1"
                } focus:border-mainTextHoverV1`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>

            {/* Vehicle Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="license_plate" className="text-gray-700">
                  Biển số xe
                </Label>
                <Input
                  id="license_plate"
                  name="license_plate"
                  value={formData.license_plate}
                  onChange={(e) =>
                    handleChange("license_plate", e.target.value)
                  }
                  placeholder="Nhập biển số xe"
                  className="border-lightBorderV1 focus:border-mainTextHoverV1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="vehicle_type" className="text-gray-700">
                  Loại xe
                </Label>
                <Select
                  value={formData.vehicle_type}
                  onValueChange={(value) => handleChange("vehicle_type", value)}
                >
                  <SelectTrigger className="border-lightBorderV1">
                    <SelectValue placeholder="Chọn loại xe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedan">Sedan</SelectItem>
                    <SelectItem value="suv">SUV</SelectItem>
                    <SelectItem value="van">Van</SelectItem>
                    <SelectItem value="motorcycle">Xe máy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vehicle_model" className="text-gray-700">
                  Mẫu xe
                </Label>
                <Input
                  id="vehicle_model"
                  name="vehicle_model"
                  value={formData.vehicle_model}
                  onChange={(e) =>
                    handleChange("vehicle_model", e.target.value)
                  }
                  placeholder="Nhập mẫu xe"
                  className="border-lightBorderV1 focus:border-mainTextHoverV1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="vehicle_year" className="text-gray-700">
                  Năm sản xuất
                </Label>
                <Input
                  id="vehicle_year"
                  name="vehicle_year"
                  type="number"
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  value={formData.vehicle_year}
                  onChange={(e) => handleChange("vehicle_year", e.target.value)}
                  placeholder="Nhập năm sản xuất"
                  className={`${
                    errors.vehicle_year
                      ? "border-red-500"
                      : "border-lightBorderV1"
                  } focus:border-mainTextHoverV1`}
                />
                {errors.vehicle_year && (
                  <p className="text-red-500 text-sm">{errors.vehicle_year}</p>
                )}
              </div>
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
                    Tạo tài xế
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
