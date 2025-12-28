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
import { IconTrash, IconMenu3, IconCar } from "@tabler/icons-react";
import type { IDriver } from "@/interface/auth";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

interface DriverTableProps {
  drivers: IDriver[];
  isLoading: boolean;
  onEdit: (driverId: string) => void;
  onDelete: (driverId: string) => void;
  onView: (driverId: string) => void;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  currentPage: number;
  onPageChange: (page: number) => void;
}

export default function DriverTable({
  drivers,
  isLoading,
  onEdit,
  onDelete,
  onView,
  pagination,
  currentPage,
  onPageChange,
}: DriverTableProps) {
  const formatCurrency = (amount: number | string | null | undefined) => {
    if (!amount) return "0₫";
    const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(numAmount);
  };

  const getVehicleTypeBadge = (type: string) => {
    if (type === "Bike") {
      return <Badge variant="blue">Xe máy</Badge>;
    }
    return <Badge variant="green">Ô tô</Badge>;
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
            <TableRow className="bg-green-50 hover:bg-gray-50">
              <TableHead className="font-semibold text-gray-800 text-nowrap w-[60px]">
                STT
              </TableHead>
              <TableHead className="font-semibold text-gray-800 text-nowrap">
                Thông tin tài xế
              </TableHead>
              <TableHead className="font-semibold text-gray-800 text-nowrap">
                Loại xe
              </TableHead>
              <TableHead className="font-semibold text-gray-800 text-nowrap">
                Số chỗ
              </TableHead>
              <TableHead className="font-semibold text-gray-800 text-nowrap">
                Đánh giá
              </TableHead>
              <TableHead className="font-semibold text-gray-800 text-nowrap">
                Tổng chuyến
              </TableHead>
              <TableHead className="font-semibold text-gray-800 text-nowrap">
                Hoàn thành
              </TableHead>
              <TableHead className="font-semibold text-gray-800 text-nowrap">
                Thu nhập
              </TableHead>
              <TableHead className="font-semibold text-gray-800 text-nowrap">
                Hành động
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {drivers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="text-center py-8 text-gray-800"
                >
                  Không tìm thấy tài xế nào
                </TableCell>
              </TableRow>
            ) : (
              drivers.map((driver, index) => {
                const rowNumber = (currentPage - 1) * 10 + index + 1;
                const driverId =
                  driver.id?.toString() || driver.clerk_id || driver._id || "";

                return (
                  <TableRow
                    key={driverId}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <TableCell className="text-center font-medium text-gray-800">
                      {rowNumber}
                    </TableCell>
                    <TableCell className="flex items-center gap-2">
                      <div className="w-10 h-10 flex-shrink-0 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center overflow-hidden">
                        <img
                          src={
                            driver.profile_image_url ||
                            `https://api.dicebear.com/7.x/avataaars/svg?seed=${driver.first_name}${driver.last_name}`
                          }
                          alt={`${driver.first_name} ${driver.last_name}`}
                          className="w-full h-full object-cover flex-shrink-0"
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">
                          {driver.first_name} {driver.last_name}
                        </p>
                        <p className="text-sm text-gray-500">
                          ID: {driverId.toString().substring(0, 8)}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getVehicleTypeBadge(driver.vehicle_type || "Car")}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <IconCar className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-800">
                          {driver.car_seats || 4}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-500">★</span>
                        <span className="font-medium text-gray-800">
                          {driver.average_rating
                            ? Number(driver.average_rating).toFixed(2)
                            : "5.00"}
                        </span>
                        <span className="text-xs text-gray-400">
                          ({driver.rating_count || 0})
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="blue">{driver.total_rides || 0}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="green">
                        {driver.completed_rides || 0}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium text-green-600">
                        {formatCurrency(driver.total_earnings)}
                      </span>
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
                            onClick={() => onView(driverId)}
                            className="text-gray-800 hover:text-mainTextHoverV1 hover:bg-transparent"
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
                            onClick={() => onDelete(driverId)}
                            className="text-gray-800 hover:text-mainDangerV1 hover:bg-transparent"
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
          <p className="text-sm text-gray-500">
            Hiển thị {(currentPage - 1) * pagination.limit + 1} -{" "}
            {Math.min(currentPage * pagination.limit, pagination.total)} trong
            tổng số {pagination.total} tài xế
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
