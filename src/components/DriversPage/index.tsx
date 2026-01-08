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
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IconPlus, IconRefresh, IconSearch } from "@tabler/icons-react";
import { DeleteDialog } from "@/components/ui/delete-dialog";
import DriverTable from "./DriverTable";
import DriverDetailsDialog from "./DriverDetailsDialog";
import { DriverCreateDialog } from "./DriverCreateDialog";
import { useAdminDrivers, useDeleteDriver } from "@/hooks/useAdmin";
import type { IDriver } from "@/interface/auth";

export default function DriversPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [approvalStatus, setApprovalStatus] = useState<string>("all");
  const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [driverToDelete, setDriverToDelete] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const {
    data: driversData,
    isLoading,
    refetch,
  } = useAdminDrivers({
    page: currentPage,
    limit: 10,
    search: searchQuery,
    approval_status: approvalStatus === "all" ? undefined : approvalStatus,
  });

  const deleteDriverMutation = useDeleteDriver();

  const handleEdit = (driverId: string) => {
    setSelectedDriverId(driverId);
    setIsEditMode(true);
    setIsDetailsDialogOpen(true);
  };

  const handleView = (driverId: string) => {
    setSelectedDriverId(driverId);
    setIsEditMode(false);
    setIsDetailsDialogOpen(true);
  };

  const handleDelete = async (driverId: string) => {
    setDriverToDelete(driverId);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (driverToDelete) {
      await deleteDriverMutation.mutateAsync(driverToDelete);
    }
  };

  const handleAddDriver = () => {
    setIsCreateDialogOpen(true);
  };

  const handleCloseDetailsDialog = () => {
    setIsDetailsDialogOpen(false);
    setSelectedDriverId(null);
    setIsEditMode(false);
  };

  const handleCloseCreateDialog = () => {
    setIsCreateDialogOpen(false);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
      await new Promise((resolve) => setTimeout(resolve, 500));
    } finally {
      setIsRefreshing(false);
    }
  };

  const drivers = (driversData?.data || []) as unknown as IDriver[];
  const pagination = driversData?.pagination;

  return (
    <div className="space-y-4 bg-[#EFF0F7] p-4 rounded-lg border border-lightBorderV1">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Quản lý tài xế</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative flex-1 max-w-md">
            <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600" />
            <Input
              type="text"
              placeholder="Tìm kiếm theo tên hoặc email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={approvalStatus} onValueChange={setApprovalStatus}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Trạng thái duyệt" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="pending">Chờ duyệt</SelectItem>
              <SelectItem value="approved">Đã duyệt</SelectItem>
              <SelectItem value="rejected">Từ chối</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handleRefresh}
            variant="outline"
            className="gap-2"
            disabled={isRefreshing}
          >
            <IconRefresh
              className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Làm mới
          </Button>

          <Button onClick={handleAddDriver} className="gap-2">
            <IconPlus className="h-4 w-4" />
            Thêm tài xế
          </Button>
        </div>
      </div>

      <DriverTable
        drivers={drivers}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        pagination={pagination}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />

      <DriverDetailsDialog
        driverId={selectedDriverId}
        isOpen={isDetailsDialogOpen}
        onClose={handleCloseDetailsDialog}
        isEditMode={isEditMode}
      />

      <DriverCreateDialog
        isOpen={isCreateDialogOpen}
        onClose={handleCloseCreateDialog}
      />

      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        isDeleting={deleteDriverMutation.isPending}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Xóa tài xế"
        description="Bạn có chắc chắn muốn xóa tài xế này? Hành động này không thể hoàn tác."
        confirmText="Xóa"
        successMessage="Xóa tài xế thành công"
        errorMessage="Không thể xóa tài xế. Vui lòng thử lại."
        warningMessage="Lưu ý: Không thể xóa tài xế nếu họ đã có lịch sử chuyến đi. Hãy thử vô hiệu hóa tài khoản thay thế."
      />
    </div>
  );
}
