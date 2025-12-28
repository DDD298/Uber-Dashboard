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
import { IconLoader2, IconPlus } from "@tabler/icons-react";
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
    clerk_id: "",
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    license_plate: "",
    vehicle_type: "",
    vehicle_model: "",
    vehicle_year: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { mutate: createDriverMutation, isPending } = useCreateDriver();

  const handleChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.clerk_id.trim()) {
      newErrors.clerk_id = "Clerk ID là bắt buộc";
    }

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

    if (
      formData.phone_number &&
      !/^[\d\s\-+()]+$/.test(formData.phone_number)
    ) {
      newErrors.phone_number = "Số điện thoại không hợp lệ";
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
      clerk_id: "",
      first_name: "",
      last_name: "",
      email: "",
      phone_number: "",
      license_plate: "",
      vehicle_type: "",
      vehicle_model: "",
      vehicle_year: "",
    });
    setErrors({});
    onClose();
  };

  const generateClerkId = () => {
    const prefix = "driver_";
    const randomString =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    setFormData((prev) => ({ ...prev, clerk_id: prefix + randomString }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        size="medium"
        className="max-h-[90vh] overflow-y-auto bg-white max-w-2xl"
      >
        <DialogHeader>
          <DialogTitle className="text-gray-800">Thêm tài xế mới</DialogTitle>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Clerk ID */}
            <div className="space-y-2">
              <Label htmlFor="clerk_id" className="text-gray-800">
                Clerk ID <span className="text-red-500">*</span>
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="clerk_id"
                  name="clerk_id"
                  value={formData.clerk_id}
                  onChange={(e) => handleChange("clerk_id", e.target.value)}
                  placeholder="Nhập clerk ID hoặc tạo tự động"
                  className={`${
                    errors.clerk_id ? "border-red-500" : "border-lightBorderV1"
                  } focus:border-mainTextHoverV1`}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={generateClerkId}
                  className="whitespace-nowrap"
                >
                  Tạo ID
                </Button>
              </div>
              {errors.clerk_id && (
                <p className="text-red-500 text-sm">{errors.clerk_id}</p>
              )}
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name" className="text-gray-800">
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
                <Label htmlFor="last_name" className="text-gray-800">
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
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-800">
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

              <div className="space-y-2">
                <Label htmlFor="phone_number" className="text-gray-800">
                  Số điện thoại
                </Label>
                <Input
                  id="phone_number"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={(e) => handleChange("phone_number", e.target.value)}
                  placeholder="Nhập số điện thoại"
                  className={`${
                    errors.phone_number
                      ? "border-red-500"
                      : "border-lightBorderV1"
                  } focus:border-mainTextHoverV1`}
                />
                {errors.phone_number && (
                  <p className="text-red-500 text-sm">{errors.phone_number}</p>
                )}
              </div>
            </div>

            {/* Vehicle Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="license_plate" className="text-gray-800">
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
                <Label htmlFor="vehicle_type" className="text-gray-800">
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
                <Label htmlFor="vehicle_model" className="text-gray-800">
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
                <Label htmlFor="vehicle_year" className="text-gray-800">
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
