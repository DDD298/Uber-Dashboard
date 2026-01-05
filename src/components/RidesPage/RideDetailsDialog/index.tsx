"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  MapPin,
  DollarSign,
  Clock,
  User,
  Car,
  Star,
  Calendar,
} from "lucide-react";
import { useState } from "react";
import { useUpdateRide } from "@/hooks/useAdmin";
import { toast } from "react-toastify";

import { IRide } from "@/interface/ride";
import { formatCurrency, formatDate } from "@/lib/utils";

interface RideDetailsDialogProps {
  ride: IRide | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function RideDetailsDialog({
  ride,
  isOpen,
  onClose,
}: RideDetailsDialogProps) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [status, setStatus] = useState(ride?.status || "pending");
  const [paymentStatus, setPaymentStatus] = useState(
    ride?.payment_status || "pending"
  );

  const { mutate: updateRide, isPending } = useUpdateRide();

  const handleSave = () => {
    if (!ride) return;

    updateRide(
      {
        id: ride.id,
        data: {
          status: status as any,
          payment_status: paymentStatus as any,
        },
      },
      {
        onSuccess: () => {
          setIsEditMode(false);
          toast.success("Cập nhật chuyến đi thành công!");
        },
      }
    );
  };

  if (!ride) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        size="large"
        className="max-h-[90vh] overflow-y-auto bg-[#EFF0F7]"
      >
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-gray-700">
              Chi tiết chuyến đi #
              {ride.ride_id ? String(ride.ride_id).substring(0, 8) : ride.id}
            </DialogTitle>
            {!isEditMode && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditMode(true)}
              >
                Chỉnh sửa
              </Button>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-4">
              <Label className="text-gray-700 mb-2 block">
                Trạng thái chuyến đi
              </Label>
              {isEditMode ? (
                <Select
                  value={status}
                  onValueChange={(value) =>
                    setStatus(
                      value as
                        | "pending"
                        | "accepted"
                        | "in_progress"
                        | "completed"
                        | "cancelled"
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Chờ xác nhận</SelectItem>
                    <SelectItem value="accepted">Đã nhận</SelectItem>
                    <SelectItem value="in_progress">Đang đi</SelectItem>
                    <SelectItem value="completed">Hoàn thành</SelectItem>
                    <SelectItem value="cancelled">Đã hủy</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Badge
                  variant={
                    ride.status === "completed"
                      ? "green"
                      : ride.status === "cancelled"
                      ? "red"
                      : "blue"
                  }
                >
                  {ride.status}
                </Badge>
              )}
            </Card>

            <Card className="p-4">
              <Label className="text-gray-700 mb-2 block">
                Trạng thái thanh toán
              </Label>
              {isEditMode ? (
                <Select
                  value={paymentStatus}
                  onValueChange={(value) =>
                    setPaymentStatus(
                      value as "pending" | "completed" | "failed" | "refunded"
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Chờ thanh toán</SelectItem>
                    <SelectItem value="completed">Đã thanh toán</SelectItem>
                    <SelectItem value="failed">Thất bại</SelectItem>
                    <SelectItem value="refunded">Đã hoàn tiền</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Badge
                  variant={
                    ride.payment_status === "completed"
                      ? "green"
                      : ride.payment_status === "failed"
                      ? "red"
                      : "yellow"
                  }
                >
                  {ride.payment_status}
                </Badge>
              )}
            </Card>
          </div>

          {/* Main Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Customer Info */}
            <Card className="p-4">
              <h3 className="font-semibold text-gray-700 flex items-center gap-2 mb-3">
                <User size={18} className="text-green-700" />
                Thông tin khách hàng
              </h3>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-gray-700">Tên</p>
                  <p className="font-medium text-gray-700">
                    {ride.user?.name || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-700">Email</p>
                  <p className="font-medium text-gray-700">
                    {ride.user?.email || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-700">Clerk ID</p>
                  <p className="font-mono text-sm text-gray-700">
                    {ride.user?.clerk_id || "N/A"}
                  </p>
                </div>
              </div>
            </Card>

            {/* Driver Info */}
            <Card className="p-4">
              <h3 className="font-semibold text-gray-700 flex items-center gap-2 mb-3">
                <Car size={18} className="text-green-700" />
                Thông tin tài xế
              </h3>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-gray-700">Tên</p>
                  <p className="font-medium text-gray-700">
                    {ride.driver
                      ? `${ride.driver.first_name} ${ride.driver.last_name}`
                      : "Chưa có tài xế"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-700">Email</p>
                  <p className="font-medium text-gray-700">
                    {ride.driver?.email || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-700">Phương tiện</p>
                  <p className="font-medium text-gray-700">
                    {ride.driver?.vehicle_type || "N/A"} -{" "}
                    {ride.driver?.license_plate || "N/A"}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Route Info */}
          <Card className="p-4">
            <h3 className="font-semibold text-gray-700 flex items-center gap-2 mb-3">
              <MapPin size={18} className="text-green-700" />
              Thông tin tuyến đường
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-700 flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-green-500"></span>
                  Điểm đón
                </p>
                <p className="font-medium text-gray-700 ml-4">
                  {ride.origin_address}
                </p>
                <p className="text-sm text-gray-700 ml-4">
                  ({ride.origin_latitude}, {ride.origin_longitude})
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-700 flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-red-500"></span>
                  Điểm đến
                </p>
                <p className="font-medium text-gray-700 ml-4">
                  {ride.destination_address}
                </p>
                <p className="text-sm text-gray-700 ml-4">
                  ({ride.destination_latitude}, {ride.destination_longitude})
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-700 flex items-center gap-1">
                  <Clock size={16} />
                  Thời gian dự kiến
                </p>
                <p className="font-medium text-gray-700 ml-4">
                  {ride.ride_time} phút
                </p>
              </div>
            </div>
          </Card>

          {/* Pricing Info */}
          <Card className="p-4">
            <h3 className="font-semibold text-gray-700 flex items-center gap-2 mb-3">
              <DollarSign size={18} className="text-green-700" />
              Thông tin giá
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <p className="text-gray-700">Giá gốc</p>
                <p className="font-medium text-gray-700">
                  {formatCurrency(ride.fare_price)}
                </p>
              </div>
              {ride.discount_amount && ride.discount_amount > 0 && (
                <div className="flex justify-between text-red-600">
                  <p>Giảm giá</p>
                  <p className="font-medium">
                    -{formatCurrency(ride.discount_amount)}
                  </p>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t">
                <p className="font-semibold text-gray-700">Tổng thanh toán</p>
                <p className="font-semibold text-green-700 text-lg">
                  {formatCurrency(ride.final_price)}
                </p>
              </div>
            </div>
          </Card>

          {/* Timestamps */}
          <Card className="p-4">
            <h3 className="font-semibold text-gray-700 flex items-center gap-2 mb-3">
              <Calendar size={18} className="text-green-700" />
              Thời gian
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-700">Tạo lúc</p>
                <p className="font-medium text-gray-700">
                  {formatDate(ride.created_at)}
                </p>
              </div>
              {ride.started_at && (
                <div>
                  <p className="text-sm text-gray-700">Bắt đầu lúc</p>
                  <p className="font-medium text-gray-700">
                    {formatDate(ride.started_at)}
                  </p>
                </div>
              )}
              {ride.completed_at && (
                <div>
                  <p className="text-sm text-gray-700">Hoàn thành lúc</p>
                  <p className="font-medium text-gray-700">
                    {formatDate(ride.completed_at)}
                  </p>
                </div>
              )}
              {ride.cancelled_at && (
                <div>
                  <p className="text-sm text-gray-700">Hủy lúc</p>
                  <p className="font-medium text-gray-700">
                    {formatDate(ride.cancelled_at)}
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Ratings */}
          {(ride.driver_rating || ride.user_rating) && (
            <Card className="p-4">
              <h3 className="font-semibold text-gray-700 flex items-center gap-2 mb-3">
                <Star size={18} className="text-yellow-500 fill-yellow-500" />
                Đánh giá
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {ride.driver_rating && (
                  <div>
                    <p className="text-sm text-gray-700">Đánh giá tài xế</p>
                    <p className="font-medium text-gray-700 flex items-center gap-1">
                      <Star
                        size={16}
                        className="text-yellow-500 fill-yellow-500"
                      />
                      {ride.driver_rating}/5
                    </p>
                  </div>
                )}
                {ride.user_rating && (
                  <div>
                    <p className="text-sm text-gray-700">Đánh giá khách hàng</p>
                    <p className="font-medium text-gray-700 flex items-center gap-1">
                      <Star
                        size={16}
                        className="text-yellow-500 fill-yellow-500"
                      />
                      {ride.user_rating}/5
                    </p>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Cancellation Reason */}
          {ride.cancellation_reason && (
            <Card className="p-4 bg-red-50 border-red-200">
              <h3 className="font-semibold text-red-700 mb-2">Lý do hủy</h3>
              <p className="text-gray-700">{ride.cancellation_reason}</p>
            </Card>
          )}

          {/* Action Buttons */}
          {isEditMode && (
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditMode(false);
                  setStatus(ride.status);
                  setPaymentStatus(ride.payment_status);
                }}
                disabled={isPending}
              >
                Hủy
              </Button>
              <Button onClick={handleSave} disabled={isPending}>
                {isPending ? "Đang lưu..." : "Lưu thay đổi"}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
