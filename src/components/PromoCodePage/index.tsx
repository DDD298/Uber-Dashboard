"use client";

import { useState } from "react";
import {
  useAdminPromoCodes,
  useCreatePromoCode,
  useUpdatePromoCode,
  useDeletePromoCode,
} from "@/hooks/useAdmin";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { IconSearch, IconX, IconPlus } from "@tabler/icons-react";
import { motion } from "framer-motion";
import { PromoCode, PromoCodeFormData } from "./types";
import PromoCodeCard from "./PromoCodeCard";
import PromoCodeCreateDialog from "./PromoCodeCreateDialog";
import PromoCodeEditDialog from "./PromoCodeEditDialog";
import { DeleteDialog } from "@/components/ui/delete-dialog";

export default function PromoCodesPage() {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPromoCode, setSelectedPromoCode] = useState<PromoCode | null>(
    null
  );
  const [promoCodeToDelete, setPromoCodeToDelete] = useState<PromoCode | null>(
    null
  );
  const pageSize = 10;

  const {
    data: promoCodesData,
    isLoading,
    refetch,
  } = useAdminPromoCodes({
    page: currentPage,
    limit: pageSize,
    search: searchQuery,
    is_active: activeFilter === "all" ? undefined : activeFilter === "active",
  });

  const { mutate: createPromoCode, isPending: isCreating } =
    useCreatePromoCode();
  const { mutate: updatePromoCode, isPending: isUpdating } =
    useUpdatePromoCode();
  const { mutateAsync: deletePromoCodeAsync, isPending: isDeleting } =
    useDeletePromoCode();

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const handleCreatePromoCode = (data: PromoCodeFormData) => {
    createPromoCode(
      {
        code: data.code,
        description: data.description,
        discount_type: data.discount_type,
        discount_value: parseFloat(data.discount_value),
        max_discount_amount: data.max_discount_amount
          ? parseFloat(data.max_discount_amount)
          : undefined,
        min_order_amount: data.min_order_amount
          ? parseFloat(data.min_order_amount)
          : undefined,
        usage_limit: data.usage_limit ? parseInt(data.usage_limit) : undefined,
        start_date: data.start_date,
        end_date: data.end_date,
        is_active: data.is_active,
      },
      {
        onSuccess: () => {
          setIsCreateDialogOpen(false);
          refetch();
        },
      }
    );
  };

  const handleUpdatePromoCode = (data: PromoCodeFormData) => {
    if (!selectedPromoCode) return;

    updatePromoCode(
      {
        id: selectedPromoCode.id,
        data: {
          code: data.code,
          description: data.description,
          discount_type: data.discount_type,
          discount_value: parseFloat(data.discount_value),
          max_discount_amount: data.max_discount_amount
            ? parseFloat(data.max_discount_amount)
            : undefined,
          min_order_amount: data.min_order_amount
            ? parseFloat(data.min_order_amount)
            : undefined,
          usage_limit: data.usage_limit
            ? parseInt(data.usage_limit)
            : undefined,
          start_date: data.start_date,
          end_date: data.end_date,
          is_active: data.is_active,
        },
      },
      {
        onSuccess: () => {
          setIsEditDialogOpen(false);
          setSelectedPromoCode(null);
          refetch();
        },
      }
    );
  };

  const handleDeletePromoCode = (promoCode: PromoCode) => {
    setPromoCodeToDelete(promoCode);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeletePromoCode = async () => {
    if (!promoCodeToDelete) return;
    await deletePromoCodeAsync(promoCodeToDelete.id);
    refetch();
    setIsDeleteDialogOpen(false);
    setPromoCodeToDelete(null);
  };

  const openEditDialog = (promoCode: PromoCode) => {
    setSelectedPromoCode(promoCode);
    setIsEditDialogOpen(true);
  };

  const displayPromoCodes = promoCodesData?.data || [];

  return (
    <div className="space-y-4 bg-[#eee] p-4 rounded-lg border border-lightBorderV1">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Quản lý mã giảm giá</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col gap-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-700">
                Quản lý Mã Giảm Giá
              </h1>
              <p className="text-base text-gray-700 mt-1">
                Tạo và quản lý các mã giảm giá cho khách hàng
              </p>
            </div>
            <Button
              onClick={() => {
                setIsCreateDialogOpen(true);
              }}
              className="gap-2"
            >
              <IconPlus size={20} />
              Tạo mã mới
            </Button>
          </div>

          {/* Filters */}
          <div className="flex items-center justify-between gap-4">
            <div className="relative w-full md:w-96">
              <Input
                placeholder="Tìm kiếm mã giảm giá..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10 py-2 w-full border-lightBorderV1 focus:border-mainTextHoverV1 text-gray-800"
              />
              <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-800 w-5 h-5" />
              {searchQuery && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-800 hover:text-red-500 transition-colors"
                  type="button"
                >
                  <IconX className="w-5 h-5" />
                </button>
              )}
            </div>
            <Tabs value={activeFilter} onValueChange={setActiveFilter}>
              <TabsList>
                <TabsTrigger value="all">Tất cả</TabsTrigger>
                <TabsTrigger value="active">Đang hoạt động</TabsTrigger>
                <TabsTrigger value="inactive">Đã hết hạn</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Promo Codes List */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, index) => (
                <Card key={index}>
                  <CardHeader>
                    <Skeleton className="h-6 w-full" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-20 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : displayPromoCodes.length === 0 ? (
            <div className="text-center py-12 text-gray-700">
              <p className="text-lg font-semibold mb-2">
                Không tìm thấy mã giảm giá
              </p>
              <p className="text-sm">Hãy tạo mã giảm giá đầu tiên của bạn</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayPromoCodes.map((promoCode: PromoCode) => (
                <PromoCodeCard
                  key={promoCode.id}
                  promoCode={promoCode}
                  onEdit={openEditDialog}
                  onDelete={handleDeletePromoCode}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {promoCodesData && promoCodesData.pagination.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              <Button
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                Trước
              </Button>
              <span className="flex items-center px-4 text-sm text-gray-700">
                Trang {currentPage} / {promoCodesData.pagination.totalPages}
              </span>
              <Button
                variant="outline"
                disabled={currentPage === promoCodesData.pagination.totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                Sau
              </Button>
            </div>
          )}
        </div>
      </motion.div>

      {/* Create Dialog */}
      <PromoCodeCreateDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreatePromoCode}
        isSubmitting={isCreating}
      />

      {/* Edit Dialog */}
      <PromoCodeEditDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSubmit={handleUpdatePromoCode}
        isSubmitting={isUpdating}
        initialData={selectedPromoCode}
      />

      {/* Delete Dialog */}
      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        isDeleting={isDeleting}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDeletePromoCode}
        title="Xóa mã giảm giá"
        description={`Bạn có chắc chắn muốn xóa mã giảm giá "${promoCodeToDelete?.code}"? hành động này không thể hoàn tác.`}
        confirmText="Xóa mã"
        successMessage="Đã xóa mã giảm giá thành công"
        errorMessage="Không thể xóa mã giảm giá"
        warningMessage="Hành động này sẽ xóa vĩnh viễn mã giảm giá khỏi hệ thống. Các đơn hàng đã áp dụng mã này sẽ không bị ảnh hưởng."
      />
    </div>
  );
}
