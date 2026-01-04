"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IconTrash, IconMenu3, IconMapPin } from "@tabler/icons-react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

interface Ride {
  id: number;
  ride_id: string;
  user?: {
    clerk_id: string;
    name: string;
    email: string;
  };
  driver?: {
    clerk_id: string;
    first_name: string;
    last_name: string;
    email: string;
    vehicle_type?: string;
    license_plate?: string;
  };
  origin_address: string;
  destination_address: string;
  ride_time: number;
  fare_price: number;
  final_price: number;
  payment_status: "pending" | "completed" | "failed" | "refunded";
  status: "pending" | "accepted" | "in_progress" | "completed" | "cancelled";
  created_at: string;
}

interface RideTableProps {
  rides: Ride[];
  isLoading: boolean;
  onView: (rideId: string) => void;
  onDelete: (rideId: string) => void;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  currentPage: number;
  onPageChange: (page: number) => void;
}

export default function RideTable({
  rides,
  isLoading,
  onView,
  onDelete,
  pagination,
  currentPage,
  onPageChange,
}: RideTableProps) {
  const formatCurrency = (amount: number | string | null | undefined) => {
    if (!amount) return "0₫";
    const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(numAmount);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge variant="green">Hoàn thành</Badge>;
      case "in_progress":
        return <Badge variant="blue">Đang đi</Badge>;
      case "accepted":
        return <Badge variant="blue">Đã nhận</Badge>;
      case "pending":
        return <Badge variant="yellow">Chờ xác nhận</Badge>;
      case "cancelled":
        return <Badge variant="red">Đã hủy</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
      case "completed":
        return <Badge variant="green">Đã thanh toán</Badge>;
      case "pending":
        return <Badge variant="yellow">Chờ thanh toán</Badge>;
      case "failed":
        return <Badge variant="red">Thất bại</Badge>;
      case "refunded":
        return <Badge variant="blue">Đã hoàn tiền</Badge>;
      case "cancelled":
        return <Badge variant="red">Đã hủy</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-green-50 hover:bg-[#EEF6EF]">
              <TableHead className="font-semibold text-gray-700 text-nowrap w-[60px]">
                STT
              </TableHead>
              <TableHead className="font-semibold text-gray-700 text-nowrap">
                Mã chuyến
              </TableHead>
              <TableHead className="font-semibold text-gray-700 text-nowrap">
                Khách hàng
              </TableHead>
              <TableHead className="font-semibold text-gray-700 text-nowrap">
                Tài xế
              </TableHead>
              <TableHead className="font-semibold text-gray-700 text-nowrap">
                Tuyến đường
              </TableHead>
              <TableHead className="font-semibold text-gray-700 text-nowrap">
                Giá
              </TableHead>
              <TableHead className="font-semibold text-gray-700 text-nowrap">
                Trạng thái
              </TableHead>
              <TableHead className="font-semibold text-gray-700 text-nowrap">
                Thanh toán
              </TableHead>
              <TableHead className="font-semibold text-gray-700 text-nowrap">
                Thời gian
              </TableHead>
              <TableHead className="font-semibold text-gray-700 text-nowrap">
                Hành động
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rides.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={10}
                  className="text-center py-8 text-gray-700"
                >
                  Không tìm thấy chuyến đi nào
                </TableCell>
              </TableRow>
            ) : (
              rides.map((ride, index) => {
                const rowNumber = (currentPage - 1) * 10 + index + 1;
                const rideId = ride.id?.toString() || ride.ride_id || "";

                return (
                  <TableRow
                    key={rideId}
                    className="hover:bg-[#EEF6EF] transition-colors"
                  >
                    <TableCell className="text-center font-medium text-gray-700">
                      {rowNumber}
                    </TableCell>
                    <TableCell>
                      <div className="font-mono text-sm text-gray-700">
                        #
                        {ride.ride_id
                          ? String(ride.ride_id).substring(0, 8)
                          : ride.id}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-semibold text-gray-700">
                          {ride.user?.name || "N/A"}
                        </p>
                        <p className="text-sm text-gray-700">
                          {ride.user?.email}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="whitespace-nowrap">
                        <p className="font-semibold text-gray-700">
                          {ride.driver
                            ? `${ride.driver.first_name} ${ride.driver.last_name}`
                            : "Chưa có"}
                        </p>
                        {ride.driver?.vehicle_type && (
                          <p className="text-sm text-gray-700">
                            {ride.driver.vehicle_type} -{" "}
                            {ride.driver.license_plate}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="min-w-[260px] max-w-[260px] w-[260px]">
                      <div className="flex items-start gap-1">
                        <IconMapPin className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <div className="text-sm">
                          <p className="text-gray-700">{ride.origin_address}</p>
                          <p className="text-gray-700">
                            → {ride.destination_address}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-green-700">
                          {formatCurrency(ride.final_price)}
                        </p>
                        {ride.final_price !== ride.fare_price && (
                          <p className="text-sm text-gray-700 line-through">
                            {formatCurrency(ride.fare_price)}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(ride.status)}</TableCell>
                    <TableCell>
                      {getPaymentStatusBadge(ride.payment_status)}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-700">
                        {formatDate(ride.created_at)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => onView(rideId)}
                            className="text-gray-700 hover:text-mainTextHoverV1 hover:bg-transparent"
                          >
                            <IconMenu3 className="h-4 w-4" />
                          </Button>
                        </motion.div>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => onDelete(rideId)}
                            className="text-gray-700 hover:text-mainDangerV1 hover:bg-transparent"
                          >
                            <IconTrash className="h-4 w-4" />
                          </Button>
                        </motion.div>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-700">
            Hiển thị {(currentPage - 1) * pagination.limit + 1} -{" "}
            {Math.min(currentPage * pagination.limit, pagination.total)} trong
            tổng số {pagination.total} chuyến đi
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Trước
            </Button>
            {[...Array(pagination.totalPages)].map((_, i) => (
              <Button
                key={i}
                variant={currentPage === i + 1 ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(i + 1)}
              >
                {i + 1}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === pagination.totalPages}
            >
              Sau
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
