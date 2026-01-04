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
import type { IDriver } from "@/interface/auth";
import { useCreateDriver, useUpdateDriver } from "@/hooks/useAdmin";

interface DriverFormProps {
  driver: IDriver | null;
  onClose: () => void;
}

export default function DriverForm({ driver, onClose }: DriverFormProps) {
  const [formData, setFormData] = useState({
    first_name: driver?.first_name || "",
    last_name: driver?.last_name || "",
    email: driver?.email || "",
    phone: driver?.phone || driver?.phone_number || "",
    car_seats: driver?.car_seats?.toString() || "",
    vehicle_type: driver?.vehicle_type || "",
    license_number: driver?.license_number || driver?.license_plate || "",
    profile_image_url: driver?.profile_image_url || "",
    car_image_url: driver?.car_image_url || "",
    status: driver?.status || "offline",
    approval_status: driver?.approval_status || "pending",
  });

  const createDriverMutation = useCreateDriver();
  const updateDriverMutation = useUpdateDriver();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      phone: formData.phone,
      car_seats: formData.car_seats ? parseInt(formData.car_seats) : undefined,
      vehicle_type: formData.vehicle_type,
      license_number: formData.license_number,
      profile_image_url: formData.profile_image_url,
      car_image_url: formData.car_image_url,
      status: formData.status,
      approval_status: formData.approval_status,
    };

    if (driver?.id) {
      // Update existing driver
      updateDriverMutation.mutate(
        {
          id: String(driver.id),
          data,
        },
        {
          onSuccess: () => {
            onClose();
          },
        }
      );
    } else {
      console.error("Create driver not implemented in this form");
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Basic Information */}
        <div className="space-y-2">
          <Label htmlFor="first_name">Tên *</Label>
          <Input
            id="first_name"
            value={formData.first_name}
            onChange={(e) => handleChange("first_name", e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="last_name">Họ *</Label>
          <Input
            id="last_name"
            value={formData.last_name}
            onChange={(e) => handleChange("last_name", e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Số điện thoại</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="license_number">Giấy phép / Biển số</Label>
          <Input
            id="license_number"
            value={formData.license_number}
            onChange={(e) => handleChange("license_number", e.target.value)}
          />
        </div>

        {/* Vehicle Information */}
        <div className="space-y-2">
          <Label htmlFor="car_seats">Số chỗ ngồi</Label>
          <Input
            id="car_seats"
            type="number"
            min="1"
            max="20"
            value={formData.car_seats}
            onChange={(e) => handleChange("car_seats", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="vehicle_type">Loại xe</Label>
          <Select
            value={formData.vehicle_type}
            onValueChange={(value) => handleChange("vehicle_type", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn loại xe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Car">Car</SelectItem>
              <SelectItem value="Bike">Bike</SelectItem>
              <SelectItem value="Scooter">Scooter</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Status Fields */}
        <div className="space-y-2">
          <Label htmlFor="status">Trạng thái hoạt động</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => handleChange("status", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="online">Online</SelectItem>
              <SelectItem value="offline">Offline</SelectItem>
              <SelectItem value="busy">Bận</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="approval_status">Trạng thái duyệt</Label>
          <Select
            value={formData.approval_status}
            onValueChange={(value) => handleChange("approval_status", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn trạng thái duyệt" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Chờ duyệt</SelectItem>
              <SelectItem value="approved">Đã duyệt</SelectItem>
              <SelectItem value="rejected">Từ chối</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Image URLs */}
        <div className="col-span-1 md:col-span-2 space-y-2">
          <Label htmlFor="profile_image_url">Ảnh đại diện (URL)</Label>
          <Input
            id="profile_image_url"
            value={formData.profile_image_url}
            onChange={(e) => handleChange("profile_image_url", e.target.value)}
          />
        </div>

        <div className="col-span-1 md:col-span-2 space-y-2">
          <Label htmlFor="car_image_url">Ảnh xe (URL)</Label>
          <Input
            id="car_image_url"
            value={formData.car_image_url}
            onChange={(e) => handleChange("car_image_url", e.target.value)}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onClose}>
          Hủy
        </Button>
        <Button
          type="submit"
          disabled={
            createDriverMutation.isPending || updateDriverMutation.isPending
          }
        >
          {createDriverMutation.isPending || updateDriverMutation.isPending
            ? "Đang xử lý..."
            : driver
            ? "Cập nhật"
            : "Tạo mới"}
        </Button>
      </div>
    </form>
  );
}
