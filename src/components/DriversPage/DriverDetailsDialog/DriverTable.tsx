"use client";

import { Badge } from "@/components/ui/badge";
import type { IDriver } from "@/interface/auth";
import {
  IconCar,
  IconMail,
  IconPhone,
  IconCalendar,
} from "@tabler/icons-react";

interface DriverTableProps {
  driver: IDriver;
}

export default function DriverTable({ driver }: DriverTableProps) {
  const getStatusBadge = (active?: boolean) => {
    if (active === undefined) return <Badge variant="outline">Không rõ</Badge>;
    return active ? (
      <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
        Hoạt động
      </Badge>
    ) : (
      <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
        Không hoạt động
      </Badge>
    );
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Avatar and Basic Info */}
      <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-200 flex-shrink-0">
          <img
            src={
              driver.avatar ||
              `https://api.dicebear.com/7.x/avataaars/svg?seed=${driver.first_name}${driver.last_name}`
            }
            alt={`${driver.first_name} ${driver.last_name}`}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900">
            {driver.first_name} {driver.last_name}
          </h3>
          <p className="text-gray-500">{driver.email}</p>
          <div className="mt-2">{getStatusBadge(driver.active)}</div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="space-y-3">
        <h4 className="font-semibold text-gray-900">Thông tin liên hệ</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <IconMail className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Email</p>
              <p className="font-medium">{driver.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <IconPhone className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Số điện thoại</p>
              <p className="font-medium">{driver.phone_number || "N/A"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Vehicle Information */}
      <div className="space-y-3">
        <h4 className="font-semibold text-gray-900">Thông tin xe</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <IconCar className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Biển số xe</p>
              <p className="font-medium">{driver.license_plate || "N/A"}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <IconCar className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Loại xe</p>
              <p className="font-medium">{driver.vehicle_type || "N/A"}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <IconCar className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Mẫu xe</p>
              <p className="font-medium">{driver.vehicle_model || "N/A"}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <IconCar className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Năm sản xuất</p>
              <p className="font-medium">{driver.vehicle_year || "N/A"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Stats */}
      <div className="space-y-3">
        <h4 className="font-semibold text-gray-900">Thống kê hoạt động</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-sm text-blue-600 mb-1">Tổng chuyến đi</p>
            <p className="text-2xl font-bold text-blue-700">
              {driver.total_rides || 0}
            </p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border border-green-100">
            <p className="text-sm text-green-600 mb-1">Tổng thu nhập</p>
            <p className="text-2xl font-bold text-green-700">
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
                minimumFractionDigits: 0,
              }).format(driver.total_earnings || 0)}
            </p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100">
            <p className="text-sm text-yellow-600 mb-1">Đánh giá TB</p>
            <p className="text-2xl font-bold text-yellow-700">
              {driver.average_rating
                ? Number(driver.average_rating).toFixed(2)
                : "N/A"}
            </p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
            <p className="text-sm text-purple-600 mb-1">Lượt đánh giá</p>
            <p className="text-2xl font-bold text-purple-700">
              {driver.rating_count || 0}
            </p>
          </div>
        </div>
      </div>

      {/* Account Information */}
      <div className="space-y-3">
        <h4 className="font-semibold text-gray-900">Thông tin tài khoản</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <IconCalendar className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Ngày tạo</p>
              <p className="font-medium">{formatDate(driver.created_at)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <IconCalendar className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Cập nhật lần cuối</p>
              <p className="font-medium">{formatDate(driver.updated_at)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
