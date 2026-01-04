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
import { IconPlus, IconSearch } from "@tabler/icons-react";
import { DeleteDialog } from "@/components/ui/delete-dialog";
import DriverTable from "./DriverTable";
import DriverDetailsDialog from "./DriverDetailsDialog";
import { DriverCreateDialog } from "./DriverCreateDialog";
import { useAdminDrivers, useDeleteDriver } from "@/hooks/useAdmin";
import type { IDriver } from "@/interface/auth";

export default function DriversPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDriver, setSelectedDriver] = useState<IDriver | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Delete Dialog state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [driverToDelete, setDriverToDelete] = useState<string | null>(null);

  const { data: driversData, isLoading } = useAdminDrivers({
    page: currentPage,
    limit: 10,
    search: searchQuery,
  });

  const deleteDriverMutation = useDeleteDriver();

  const handleEdit = (driverId: string) => {
    // Cast to IDriver explicitly to fix type mismatch
    const drivers = (driversData?.data || []) as unknown as IDriver[];
    const driver = drivers.find(
      (d) =>
        d.clerk_id === driverId ||
        d._id === driverId ||
        String(d.id) === driverId
    );
    if (driver) {
      setSelectedDriver(driver);
      setIsEditMode(true);
      setIsDetailsDialogOpen(true);
    }
  };

  const handleView = (driverId: string) => {
    // Cast to IDriver explicitly
    const drivers = (driversData?.data || []) as unknown as IDriver[];
    const driver = drivers.find(
      (d) =>
        d.clerk_id === driverId ||
        d._id === driverId ||
        String(d.id) === driverId
    );
    if (driver) {
      setSelectedDriver(driver);
      setIsEditMode(false);
      setIsDetailsDialogOpen(true);
    }
  };

  const handleDelete = async (driverId: string) => {
    setDriverToDelete(driverId);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (driverToDelete) {
      await deleteDriverMutation.mutateAsync(driverToDelete);
      // Dialog will be closed by onSuccess of mutation or manually here if needed,
      // but DeleteDialog calls onClose automatically on success if we passed it correctly?
      // Actually DeleteDialog implementation calls onClose() after onConfirm() succeeds.
      // So we just need to return the promise.
    }
  };

  const handleAddDriver = () => {
    setIsCreateDialogOpen(true);
  };

  const handleCloseDetailsDialog = () => {
    setIsDetailsDialogOpen(false);
    setSelectedDriver(null);
    setIsEditMode(false);
  };

  const handleCloseCreateDialog = () => {
    setIsCreateDialogOpen(false);
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
        <div className="relative flex-1 max-w-md">
          <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Tìm kiếm theo tên hoặc email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Button onClick={handleAddDriver} className="gap-2">
          <IconPlus className="h-4 w-4" />
          Thêm tài xế
        </Button>
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
        driver={selectedDriver}
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
