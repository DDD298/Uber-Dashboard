"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  DollarSign,
  Star,
  MessageSquare,
  History,
  Car,
  Edit,
  X,
  Loader2,
  AlertTriangle,
  ShieldCheck,
  Clock8,
} from "lucide-react";

import { useGetDriverById } from "@/hooks/useAdmin";
import type { IDriver } from "@/interface/auth";
import DriverForm from "./DriverForm";
import DriverTable from "./DriverTable";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface DriverDetailsDialogProps {
  driverId: string | null;
  isOpen: boolean;
  onClose: () => void;
  isEditMode?: boolean;
}

export default function DriverDetailsDialog({
  driverId,
  isOpen,
  onClose,
  isEditMode: initialEditMode = false,
}: DriverDetailsDialogProps) {
  const [isEditMode, setIsEditMode] = useState(initialEditMode);
  const { data: driverResponse, isLoading } = useGetDriverById(driverId || "");
  const driver = (driverResponse?.data as unknown as IDriver) || null;

  const handleClose = () => {
    setIsEditMode(false);
    onClose();
  };

  const handleEditToggle = () => {
    setIsEditMode(!isEditMode);
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "online":
      case "active":
        return <Badge variant="green">Hoạt động</Badge>;
      case "offline":
        return <Badge variant="secondary">Ngoại tuyến</Badge>;
      case "busy":
        return <Badge variant="yellow">Đang bận</Badge>;
      default:
        return <Badge variant="secondary">{status || "N/A"}</Badge>;
    }
  };

  const getApprovalBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return <Badge variant="green">Đã duyệt</Badge>;
      case "pending":
        return <Badge variant="blue">Chờ duyệt</Badge>;
      case "rejected":
        return <Badge variant="red">Từ chối</Badge>;
      default:
        return <Badge variant="secondary">{status || "N/A"}</Badge>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        size="medium"
        className="max-h-[90vh] overflow-y-auto bg-[#EFF0F7]"
      >
        <DialogHeader>
          <div className="flex items-center justify-between w-full">
            <DialogTitle className="text-gray-700 flex items-center gap-2">
              {isEditMode
                ? driver
                  ? "Chỉnh sửa tài xế"
                  : "Thêm tài xế mới"
                : "Chi tiết tài xế"}
              {!isEditMode && driver && (
                <div className="flex gap-2">
                  {getStatusBadge(driver.status || "")}
                  {getApprovalBadge(driver.approval_status || "")}
                </div>
              )}
            </DialogTitle>
          </div>
        </DialogHeader>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <Loader2 className="w-10 h-10 animate-spin text-green-600" />
            <p className="text-gray-600">Đang tải thông tin tài xế...</p>
          </div>
        ) : !driver && driverId ? (
          <div className="text-center py-12 text-gray-600">
            Không tìm thấy thông tin tài xế.
          </div>
        ) : (
          <>
            {isEditMode ? (
              <Card>
                <DriverForm
                  driver={driver}
                  onClose={() => setIsEditMode(false)}
                />
              </Card>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Left Column: Driver Info & Vehicle */}
                  <div className="md:col-span-1 space-y-4">
                    <Card className="p-4 shadow-sm border-gray-100 h-full">
                      {driver && <DriverTable driver={driver} />}
                      {driver && (
                        <div className="mt-4 pt-4 border-t space-y-4">
                          <h4 className="font-bold text-gray-800 flex items-center gap-2">
                            <ShieldCheck size={18} className="text-green-600" />
                            Thông tin hệ thống
                          </h4>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-gray-600 font-bold uppercase">
                                Trạng thái
                              </span>
                              {getStatusBadge(driver.status || "")}
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-gray-600 font-bold uppercase">
                                Xét duyệt
                              </span>
                              {getApprovalBadge(driver.approval_status || "")}
                            </div>
                            <div className="flex justify-between items-center">
                              <p className="text-xs text-gray-600 font-bold uppercase">
                                Ngày tham gia
                              </p>
                              <p className="text-xs font-medium">
                                {formatDate(driver.created_at)}
                              </p>
                            </div>
                            <div className="flex justify-between items-center">
                              <p className="text-xs text-gray-600 font-bold uppercase">
                                Cập nhật cuối
                              </p>
                              <p className="text-xs font-medium">
                                {formatDate(driver.updated_at)}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </Card>
                  </div>

                  {/* Right Column: Stats & History */}
                  <div className="md:col-span-2 space-y-4">
                    {/* Statistics Section */}
                    <div className="space-y-4">
                      <h3 className="font-bold text-green-700 flex items-center gap-2">
                        <Car size={20} className="text-green-700" />
                        Thống kê hoạt động
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        {/* Total Rides */}
                        <Card className="p-4 border-gray-100 hover:shadow-md transition-all duration-300 group bg-white">
                          <div className="flex items-start justify-between">
                            <p className="text-sm font-bold text-gray-600 uppercase tracking-widest">
                              Tổng chuyến đi
                            </p>
                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center transition-colors group-hover:bg-blue-100">
                              <MapPin size={16} className="text-blue-600" />
                            </div>
                          </div>
                          <div className="mt-2">
                            <p className="text-3xl font-bold text-gray-800">
                              {driver?.total_rides || 0}
                            </p>
                            <div className="flex items-center gap-1 mt-1">
                              <span className="text-sm text-green-600 font-bold">
                                {driver?.completed_rides || 0} thành công
                              </span>
                              <span className="text-sm text-gray-300">|</span>
                              <span className="text-sm text-red-500 font-bold">
                                {driver?.cancelled_rides || 0} hủy
                              </span>
                            </div>
                          </div>
                        </Card>

                        {/* Earnings */}
                        <Card className="p-4 border-gray-100 hover:shadow-md transition-all duration-300 group bg-white">
                          <div className="flex items-start justify-between">
                            <p className="text-sm font-bold text-gray-600 uppercase tracking-widest">
                              Tổng thu nhập
                            </p>
                            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center transition-colors group-hover:bg-green-100">
                              <DollarSign
                                size={16}
                                className="text-green-600"
                              />
                            </div>
                          </div>
                          <div className="mt-2">
                            <p className="text-3xl font-bold text-gray-800">
                              {formatCurrency(driver?.total_earnings)}
                            </p>
                            <p className="text-sm text-gray-600 mt-1 font-medium">
                              Doanh thu tích lũy
                            </p>
                          </div>
                        </Card>

                        {/* Rating */}
                        <Card className="p-4 border-gray-100 hover:shadow-md transition-all duration-300 group bg-white">
                          <div className="flex items-start justify-between">
                            <p className="text-sm font-bold text-gray-600 uppercase tracking-widest">
                              Đánh giá & Phản hồi
                            </p>
                            <div className="w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center transition-colors group-hover:bg-yellow-100">
                              <Star
                                size={16}
                                className="text-yellow-600 fill-yellow-600"
                              />
                            </div>
                          </div>
                          <div className="mt-2">
                            <div className="flex items-baseline gap-2">
                              <p className="text-3xl font-bold text-gray-800">
                                {driver?.average_rating
                                  ? Number(driver.average_rating).toFixed(1)
                                  : "5.0"}
                              </p>
                              <p className="text-xs text-gray-600 font-medium">
                                / 5.0
                              </p>
                            </div>
                            <p className="text-sm text-gray-600 mt-1 font-medium italic">
                              Từ {driver?.rating_count || 0} lượt phản hồi
                            </p>
                          </div>
                        </Card>

                        {/* Warnings */}
                        <Card className="p-4 border-gray-100 hover:shadow-md transition-all duration-300 group bg-white">
                          <div className="flex items-start justify-between">
                            <p className="text-sm font-bold text-gray-600 uppercase tracking-widest">
                              Cảnh báo vi phạm
                            </p>
                            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center transition-colors group-hover:bg-red-100">
                              <AlertTriangle
                                size={16}
                                className="text-red-600"
                              />
                            </div>
                          </div>
                          <div className="mt-2">
                            <p className="text-3xl font-bold text-gray-800">
                              {driver?.active_warnings || 0}
                            </p>
                            <div className="flex items-center gap-1 mt-1">
                              <span className="text-sm text-red-600 font-bold">
                                Hiện tại
                              </span>
                              <span className="text-sm text-gray-300">|</span>
                              <span className="text-sm text-gray-600 font-bold">
                                {driver?.total_warnings || 0} tổng số
                              </span>
                            </div>
                          </div>
                        </Card>
                      </div>
                    </div>

                    {/* History Section */}
                    <div className="space-y-4">
                      <h3 className="font-bold text-green-700 flex items-center gap-2">
                        <Clock8 size={20} className="text-green-700" />
                        Lịch sử hoạt động gần đây
                      </h3>
                      <Card className="bg-white p-8 border-dashed border-2 border-gray-200 shadow-none rounded-xl">
                        <div className="flex flex-col items-center justify-center text-center">
                          <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-4">
                            <History size={28} className="text-gray-300" />
                          </div>
                          <h4 className="font-bold text-gray-800 mb-1">
                            Chưa có lịch sử chuyến đi
                          </h4>
                          <p className="text-sm text-gray-600 max-w-xs">
                            Hệ thống chưa ghi nhận các chuyến đi gần đây của tài
                            xế này.
                          </p>
                        </div>
                      </Card>
                    </div>
                  </div>
                </div>
                <div className="flex w-full justify-end">
                  {!isEditMode && driver && (
                    <Button onClick={handleEditToggle}>
                      <Edit size={16} />
                      Chỉnh sửa thông tin
                    </Button>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
