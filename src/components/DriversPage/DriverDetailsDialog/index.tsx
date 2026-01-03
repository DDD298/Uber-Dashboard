"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import {
  MapPin,
  DollarSign,
  Star,
  MessageSquare,
  History,
  Car,
} from "lucide-react";

import type { IDriver } from "@/interface/auth";
import DriverForm from "./DriverForm";
import DriverTable from "./DriverTable";

interface DriverDetailsDialogProps {
  driver: IDriver | null;
  isOpen: boolean;
  onClose: () => void;
  isEditMode: boolean;
}

export default function DriverDetailsDialog({
  driver,
  isOpen,
  onClose,
  isEditMode,
}: DriverDetailsDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        size="medium"
        className="max-h-[90vh] overflow-y-auto bg-[#eee]"
      >
        <DialogHeader>
          <DialogTitle className="text-gray-700">
            {isEditMode
              ? driver
                ? "Chỉnh sửa tài xế"
                : "Thêm tài xế mới"
              : "Chi tiết tài xế"}
          </DialogTitle>
        </DialogHeader>

        {isEditMode ? (
          <Card>
            <DriverForm driver={driver} onClose={onClose} />
          </Card>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left Column: Driver Info & Vehicle */}
              <div className="md:col-span-1 space-y-4">
                <Card className="p-4 shadow-sm border-gray-100 h-full">
                  {driver && <DriverTable driver={driver} />}
                </Card>
              </div>

              {/* Right Column: Stats & History */}
              <div className="md:col-span-2 space-y-4">
                {/* Statistics Section */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-green-700 flex items-center gap-2">
                    <Car size={18} className="text-green-700" />
                    Thống kê hoạt động
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {/* Total Rides */}
                    <Card className="p-4 border-gray-100 hover:shadow-md transition-all duration-300 group">
                      <div className="flex items-start justify-between">
                        <p className="text-sm font-medium text-gray-700 uppercase tracking-wide">
                          Tổng chuyến đi
                        </p>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
                          <MapPin size={14} className="text-white" />
                        </div>
                      </div>
                      <div>
                        <p className="text-2xl font-semibold text-gray-700">
                          {driver?.total_rides || 0}
                        </p>
                        <p className="text-sm text-gray-700 mt-1">
                          chuyến hoàn thành
                        </p>
                      </div>
                    </Card>

                    {/* Earnings */}
                    <Card className="p-4 border-gray-100 hover:shadow-md transition-all duration-300 group">
                      <div className="flex items-start justify-between">
                        <p className="text-sm font-medium text-gray-700 uppercase tracking-wide">
                          Tổng thu nhập
                        </p>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
                          <DollarSign size={14} className="text-white" />
                        </div>
                      </div>
                      <div>
                        <p className="text-2xl font-semibold text-gray-700">
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                            maximumFractionDigits: 0,
                          }).format(Number(driver?.total_earnings) || 0)}
                        </p>
                        <p className="text-sm text-gray-700 mt-1">
                          doanh thu tích lũy
                        </p>
                      </div>
                    </Card>

                    {/* Rating */}
                    <Card className="p-4 border-gray-100 hover:shadow-md transition-all duration-300 group">
                      <div className="flex items-start justify-between">
                        <p className="text-sm font-medium text-gray-700 uppercase tracking-wide">
                          Đánh giá TB
                        </p>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
                          <Star size={14} className="text-white fill-white" />
                        </div>
                      </div>
                      <div>
                        <p className="text-2xl font-semibold text-gray-700">
                          {driver?.average_rating
                            ? Number(driver.average_rating).toFixed(2)
                            : "N/A"}
                        </p>
                        <p className="text-sm text-gray-700 mt-1">
                          điểm trung bình
                        </p>
                      </div>
                    </Card>

                    {/* Rating Count */}
                    <Card className="p-4 border-gray-100 hover:shadow-md transition-all duration-300 group">
                      <div className="flex items-start justify-between">
                        <p className="text-sm font-medium text-gray-700 uppercase tracking-wide">
                          Lượt đánh giá
                        </p>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
                          <MessageSquare size={14} className="text-white" />
                        </div>
                      </div>
                      <div>
                        <p className="text-2xl font-semibold text-gray-700">
                          {driver?.rating_count || 0}
                        </p>
                        <p className="text-sm text-gray-700 mt-1">
                          phản hồi từ khách
                        </p>
                      </div>
                    </Card>
                  </div>
                </div>

                {/* History Section */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-green-700 flex items-center gap-2">
                    <History size={18} className="text-green-700" />
                    Lịch sử chuyến đi
                  </h3>
                  <Card className="bg-white p-4 border-dashed border-2 border-gray-200 shadow-none">
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                        <History size={24} className="text-gray-400" />
                      </div>
                      <h4 className="font-medium text-gray-700 mb-1">
                        Chưa có lịch sử chuyến đi
                      </h4>
                      <p className="text-sm text-gray-700 max-w-xs">
                        Tài xế này chưa thực hiện chuyến đi nào hoặc lịch sử
                        chưa được cập nhật.
                      </p>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
