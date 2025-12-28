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
    clerk_id: driver?.clerk_id || "",
    first_name: driver?.first_name || "",
    last_name: driver?.last_name || "",
    email: driver?.email || "",
    phone_number: driver?.phone_number || "",
    license_plate: driver?.license_plate || "",
    vehicle_type: driver?.vehicle_type || "",
    vehicle_model: driver?.vehicle_model || "",
    vehicle_year: driver?.vehicle_year?.toString() || "",
    active: driver?.active !== undefined ? driver.active : true,
  });

  const createDriverMutation = useCreateDriver();
  const updateDriverMutation = useUpdateDriver();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      ...formData,
      vehicle_year: formData.vehicle_year
        ? parseInt(formData.vehicle_year)
        : undefined,
    };

    if (driver) {
      // Update existing driver
      updateDriverMutation.mutate(
        {
          id: driver.clerk_id || driver._id || driver.id || "",
          data,
        },
        {
          onSuccess: () => {
            onClose();
          },
        }
      );
    } else {
      // Create new driver
      createDriverMutation.mutate(data as any, {
        onSuccess: () => {
          onClose();
        },
      });
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
          <Label htmlFor="phone_number">Số điện thoại</Label>
          <Input
            id="phone_number"
            type="tel"
            value={formData.phone_number}
            onChange={(e) => handleChange("phone_number", e.target.value)}
          />
        </div>

        {!driver && (
          <div className="space-y-2">
            <Label htmlFor="clerk_id">Clerk ID *</Label>
            <Input
              id="clerk_id"
              value={formData.clerk_id}
              onChange={(e) => handleChange("clerk_id", e.target.value)}
              required
            />
          </div>
        )}

        {/* Vehicle Information */}
        <div className="space-y-2">
          <Label htmlFor="license_plate">Biển số xe</Label>
          <Input
            id="license_plate"
            value={formData.license_plate}
            onChange={(e) => handleChange("license_plate", e.target.value)}
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
              <SelectItem value="sedan">Sedan</SelectItem>
              <SelectItem value="suv">SUV</SelectItem>
              <SelectItem value="van">Van</SelectItem>
              <SelectItem value="motorcycle">Xe máy</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="vehicle_model">Mẫu xe</Label>
          <Input
            id="vehicle_model"
            value={formData.vehicle_model}
            onChange={(e) => handleChange("vehicle_model", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="vehicle_year">Năm sản xuất</Label>
          <Input
            id="vehicle_year"
            type="number"
            min="1900"
            max={new Date().getFullYear() + 1}
            value={formData.vehicle_year}
            onChange={(e) => handleChange("vehicle_year", e.target.value)}
          />
        </div>

        {/* Status */}
        <div className="space-y-2">
          <Label htmlFor="active">Trạng thái</Label>
          <Select
            value={formData.active ? "true" : "false"}
            onValueChange={(value) => handleChange("active", value === "true")}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Hoạt động</SelectItem>
              <SelectItem value="false">Không hoạt động</SelectItem>
            </SelectContent>
          </Select>
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
