"use client";

import { useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IconSearch, IconX } from "@tabler/icons-react";
import RideTable from "./RideTable";
import RideDetailsDialog from "./RideDetailsDialog";
import { useAdminRides, useDeleteRide } from "@/hooks/useAdmin";
import { DeleteDialog } from "@/components/ui/delete-dialog";

export default function RidesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRide, setSelectedRide] = useState<any | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [rideToDelete, setRideToDelete] = useState<string | null>(null);

  const { data: ridesData, isLoading } = useAdminRides({
    page: currentPage,
    limit: 10,
    search: searchQuery,
    status: statusFilter !== "all" ? statusFilter : undefined,
    payment_status:
      paymentStatusFilter !== "all" ? paymentStatusFilter : undefined,
  });

  const { mutate: deleteRide, isPending: isDeleting } = useDeleteRide();

  const handleView = (rideId: string) => {
    const ride = ridesData?.data.find(
      (r: any) => r.id?.toString() === rideId || r.ride_id === rideId
    );
    if (ride) {
      setSelectedRide(ride);
      setIsDetailsDialogOpen(true);
    }
  };

  const handleDelete = (rideId: string) => {
    setRideToDelete(rideId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!rideToDelete) {
      return Promise.resolve();
    }

    try {
      deleteRide(rideToDelete);
      setIsDeleteDialogOpen(false);
      setRideToDelete(null);
      return Promise.resolve();
    } catch (error) {
      throw error;
    }
  };

  const handleCloseDetailsDialog = () => {
    setIsDetailsDialogOpen(false);
    setSelectedRide(null);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const rides =
    ridesData?.data.map((ride: any) => ({
      ...ride,
      id: ride.ride_id,
      status: ride.ride_status,
    })) || [];
  const pagination = ridesData?.pagination;

  return (
    <div className="space-y-4 bg-[#EFF0F7] p-4 rounded-lg border border-lightBorderV1">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Quản lý chuyến đi</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Tìm kiếm theo mã chuyến, khách hàng, tài xế..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-10"
          />
          {searchQuery && (
            <button
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-700 hover:text-red-500 transition-colors"
              type="button"
            >
              <IconX className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="pending">Chờ xác nhận</SelectItem>
              <SelectItem value="accepted">Đã nhận</SelectItem>
              <SelectItem value="in_progress">Đang đi</SelectItem>
              <SelectItem value="completed">Hoàn thành</SelectItem>
              <SelectItem value="cancelled">Đã hủy</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={paymentStatusFilter}
            onValueChange={setPaymentStatusFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Thanh toán" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả thanh toán</SelectItem>
              <SelectItem value="pending">Chờ thanh toán</SelectItem>
              <SelectItem value="completed">Đã thanh toán</SelectItem>
              <SelectItem value="failed">Thất bại</SelectItem>
              <SelectItem value="refunded">Đã hoàn tiền</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <RideTable
        rides={rides}
        isLoading={isLoading}
        onView={handleView}
        onDelete={handleDelete}
        pagination={pagination}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />

      <RideDetailsDialog
        ride={selectedRide}
        isOpen={isDetailsDialogOpen}
        onClose={handleCloseDetailsDialog}
      />

      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        isDeleting={isDeleting}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setRideToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Xóa chuyến đi"
        description="Bạn có chắc chắn muốn xóa chuyến đi này? Hành động này không thể được hoàn tác."
        confirmText="Xóa chuyến đi"
        successMessage="Xóa chuyến đi thành công!"
        errorMessage="Lỗi khi xóa chuyến đi."
        warningMessage="Điều này sẽ vĩnh viễn xóa chuyến đi và tất cả dữ liệu liên quan."
      />
    </div>
  );
}
