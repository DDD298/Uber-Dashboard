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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
  IconSearch,
  IconX,
  IconPlus,
  IconEdit,
  IconTrash,
  IconPercentage,
  IconCurrencyDollar,
  IconCalendar,
  IconUsers,
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";

interface PromoCode {
  id: number;
  code: string;
  description: string;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  max_discount_amount?: number;
  min_order_amount?: number;
  usage_limit?: number;
  used_count: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export default function PromoCodesPage() {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedPromoCode, setSelectedPromoCode] = useState<PromoCode | null>(
    null
  );
  const pageSize = 10;

  // Form state
  const [formData, setFormData] = useState({
    code: "",
    description: "",
    discount_type: "percentage" as "percentage" | "fixed",
    discount_value: "",
    max_discount_amount: "",
    min_order_amount: "",
    usage_limit: "",
    start_date: "",
    end_date: "",
    is_active: true,
  });

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
  const { mutate: deletePromoCode } = useDeletePromoCode();

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const handleCreatePromoCode = () => {
    createPromoCode(
      {
        code: formData.code,
        description: formData.description,
        discount_type: formData.discount_type,
        discount_value: parseFloat(formData.discount_value),
        max_discount_amount: formData.max_discount_amount
          ? parseFloat(formData.max_discount_amount)
          : undefined,
        min_order_amount: formData.min_order_amount
          ? parseFloat(formData.min_order_amount)
          : undefined,
        usage_limit: formData.usage_limit
          ? parseInt(formData.usage_limit)
          : undefined,
        start_date: formData.start_date,
        end_date: formData.end_date,
        is_active: formData.is_active,
      },
      {
        onSuccess: () => {
          setIsCreateDialogOpen(false);
          resetForm();
          refetch();
        },
      }
    );
  };

  const handleUpdatePromoCode = () => {
    if (!selectedPromoCode) return;

    updatePromoCode(
      {
        id: selectedPromoCode.id,
        data: {
          code: formData.code,
          description: formData.description,
          discount_type: formData.discount_type,
          discount_value: parseFloat(formData.discount_value),
          max_discount_amount: formData.max_discount_amount
            ? parseFloat(formData.max_discount_amount)
            : undefined,
          min_order_amount: formData.min_order_amount
            ? parseFloat(formData.min_order_amount)
            : undefined,
          usage_limit: formData.usage_limit
            ? parseInt(formData.usage_limit)
            : undefined,
          start_date: formData.start_date,
          end_date: formData.end_date,
          is_active: formData.is_active,
        },
      },
      {
        onSuccess: () => {
          setIsEditDialogOpen(false);
          setSelectedPromoCode(null);
          resetForm();
          refetch();
        },
      }
    );
  };

  const handleDeletePromoCode = (id: number) => {
    if (confirm("Bạn có chắc chắn muốn xóa mã giảm giá này?")) {
      deletePromoCode(id, {
        onSuccess: () => {
          refetch();
        },
      });
    }
  };

  const openEditDialog = (promoCode: PromoCode) => {
    setSelectedPromoCode(promoCode);
    setFormData({
      code: promoCode.code,
      description: promoCode.description,
      discount_type: promoCode.discount_type,
      discount_value: promoCode.discount_value.toString(),
      max_discount_amount: promoCode.max_discount_amount?.toString() || "",
      min_order_amount: promoCode.min_order_amount?.toString() || "",
      usage_limit: promoCode.usage_limit?.toString() || "",
      start_date: promoCode.start_date,
      end_date: promoCode.end_date,
      is_active: promoCode.is_active,
    });
    setIsEditDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      code: "",
      description: "",
      discount_type: "percentage",
      discount_value: "",
      max_discount_amount: "",
      min_order_amount: "",
      usage_limit: "",
      start_date: "",
      end_date: "",
      is_active: true,
    });
  };

  const displayPromoCodes = promoCodesData?.data || [];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy");
    } catch {
      return dateString;
    }
  };

  const isExpired = (endDate: string) => {
    return new Date(endDate) < new Date();
  };

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
              <h1 className="text-2xl font-bold text-gray-700">
                Quản lý Mã Giảm Giá
              </h1>
              <p className="text-sm text-gray-700 mt-1">
                Tạo và quản lý các mã giảm giá cho khách hàng
              </p>
            </div>
            <Button
              onClick={() => {
                resetForm();
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
                <TabsTrigger value="inactive">Đã tắt</TabsTrigger>
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
                <Card
                  key={promoCode.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg font-bold text-gray-700 mb-2">
                          {promoCode.code}
                        </CardTitle>
                        <CardDescription className="text-sm">
                          {promoCode.description}
                        </CardDescription>
                      </div>
                      <div className="flex gap-1">
                        {promoCode.is_active &&
                        !isExpired(promoCode.end_date) ? (
                          <Badge variant="default" className="bg-green-600">
                            Hoạt động
                          </Badge>
                        ) : isExpired(promoCode.end_date) ? (
                          <Badge variant="destructive">Hết hạn</Badge>
                        ) : (
                          <Badge variant="secondary">Đã tắt</Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {/* Discount Value */}
                    <div className="flex items-center gap-2 text-2xl font-bold text-green-600">
                      {promoCode.discount_type === "percentage" ? (
                        <>
                          <IconPercentage size={24} />
                          <span>{promoCode.discount_value}%</span>
                        </>
                      ) : (
                        <>
                          <IconCurrencyDollar size={24} />
                          <span>
                            {formatCurrency(promoCode.discount_value)}
                          </span>
                        </>
                      )}
                    </div>

                    {/* Details */}
                    <div className="space-y-2 text-sm text-gray-700">
                      {promoCode.max_discount_amount && (
                        <div className="flex justify-between">
                          <span>Giảm tối đa:</span>
                          <span className="font-semibold">
                            {formatCurrency(promoCode.max_discount_amount)}
                          </span>
                        </div>
                      )}
                      {promoCode.min_order_amount && (
                        <div className="flex justify-between">
                          <span>Đơn tối thiểu:</span>
                          <span className="font-semibold">
                            {formatCurrency(promoCode.min_order_amount)}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-1">
                          <IconCalendar size={16} />
                          Thời hạn:
                        </span>
                        <span className="font-semibold">
                          {formatDate(promoCode.start_date)} -{" "}
                          {formatDate(promoCode.end_date)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-1">
                          <IconUsers size={16} />
                          Đã dùng:
                        </span>
                        <span className="font-semibold">
                          {promoCode.used_count}
                          {promoCode.usage_limit &&
                            ` / ${promoCode.usage_limit}`}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => openEditDialog(promoCode)}
                    >
                      <IconEdit size={16} className="mr-1" />
                      Sửa
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleDeletePromoCode(promoCode.id)}
                    >
                      <IconTrash size={16} className="mr-1" />
                      Xóa
                    </Button>
                  </CardFooter>
                </Card>
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
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tạo mã giảm giá mới</DialogTitle>
            <DialogDescription>
              Điền thông tin để tạo mã giảm giá mới
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="code">Mã giảm giá *</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      code: e.target.value.toUpperCase(),
                    })
                  }
                  placeholder="VD: WELCOME2026"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="discount_type">Loại giảm giá *</Label>
                <Select
                  value={formData.discount_type}
                  onValueChange={(value: "percentage" | "fixed") =>
                    setFormData({ ...formData, discount_type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Phần trăm (%)</SelectItem>
                    <SelectItem value="fixed">Số tiền cố định</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Mô tả *</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Mô tả mã giảm giá"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="discount_value">
                  Giá trị giảm *{" "}
                  {formData.discount_type === "percentage" ? "(%)" : "(VNĐ)"}
                </Label>
                <Input
                  id="discount_value"
                  type="number"
                  value={formData.discount_value}
                  onChange={(e) =>
                    setFormData({ ...formData, discount_value: e.target.value })
                  }
                  placeholder={
                    formData.discount_type === "percentage" ? "20" : "50000"
                  }
                />
              </div>
              {formData.discount_type === "percentage" && (
                <div className="space-y-2">
                  <Label htmlFor="max_discount_amount">Giảm tối đa (VNĐ)</Label>
                  <Input
                    id="max_discount_amount"
                    type="number"
                    value={formData.max_discount_amount}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        max_discount_amount: e.target.value,
                      })
                    }
                    placeholder="100000"
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="min_order_amount">Đơn tối thiểu (VNĐ)</Label>
                <Input
                  id="min_order_amount"
                  type="number"
                  value={formData.min_order_amount}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      min_order_amount: e.target.value,
                    })
                  }
                  placeholder="50000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="usage_limit">Giới hạn sử dụng</Label>
                <Input
                  id="usage_limit"
                  type="number"
                  value={formData.usage_limit}
                  onChange={(e) =>
                    setFormData({ ...formData, usage_limit: e.target.value })
                  }
                  placeholder="1000"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start_date">Ngày bắt đầu *</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) =>
                    setFormData({ ...formData, start_date: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end_date">Ngày kết thúc *</Label>
                <Input
                  id="end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={(e) =>
                    setFormData({ ...formData, end_date: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) =>
                  setFormData({ ...formData, is_active: e.target.checked })
                }
                className="w-4 h-4"
              />
              <Label htmlFor="is_active" className="cursor-pointer">
                Kích hoạt ngay
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateDialogOpen(false)}
            >
              Hủy
            </Button>
            <Button onClick={handleCreatePromoCode} disabled={isCreating}>
              {isCreating ? "Đang tạo..." : "Tạo mã"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa mã giảm giá</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin mã giảm giá
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Same form fields as create dialog */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-code">Mã giảm giá *</Label>
                <Input
                  id="edit-code"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      code: e.target.value.toUpperCase(),
                    })
                  }
                  placeholder="VD: WELCOME2026"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-discount_type">Loại giảm giá *</Label>
                <Select
                  value={formData.discount_type}
                  onValueChange={(value: "percentage" | "fixed") =>
                    setFormData({ ...formData, discount_type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Phần trăm (%)</SelectItem>
                    <SelectItem value="fixed">Số tiền cố định</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Mô tả *</Label>
              <Input
                id="edit-description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Mô tả mã giảm giá"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-discount_value">
                  Giá trị giảm *{" "}
                  {formData.discount_type === "percentage" ? "(%)" : "(VNĐ)"}
                </Label>
                <Input
                  id="edit-discount_value"
                  type="number"
                  value={formData.discount_value}
                  onChange={(e) =>
                    setFormData({ ...formData, discount_value: e.target.value })
                  }
                />
              </div>
              {formData.discount_type === "percentage" && (
                <div className="space-y-2">
                  <Label htmlFor="edit-max_discount_amount">
                    Giảm tối đa (VNĐ)
                  </Label>
                  <Input
                    id="edit-max_discount_amount"
                    type="number"
                    value={formData.max_discount_amount}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        max_discount_amount: e.target.value,
                      })
                    }
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-min_order_amount">
                  Đơn tối thiểu (VNĐ)
                </Label>
                <Input
                  id="edit-min_order_amount"
                  type="number"
                  value={formData.min_order_amount}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      min_order_amount: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-usage_limit">Giới hạn sử dụng</Label>
                <Input
                  id="edit-usage_limit"
                  type="number"
                  value={formData.usage_limit}
                  onChange={(e) =>
                    setFormData({ ...formData, usage_limit: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-start_date">Ngày bắt đầu *</Label>
                <Input
                  id="edit-start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) =>
                    setFormData({ ...formData, start_date: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-end_date">Ngày kết thúc *</Label>
                <Input
                  id="edit-end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={(e) =>
                    setFormData({ ...formData, end_date: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="edit-is_active"
                checked={formData.is_active}
                onChange={(e) =>
                  setFormData({ ...formData, is_active: e.target.checked })
                }
                className="w-4 h-4"
              />
              <Label htmlFor="edit-is_active" className="cursor-pointer">
                Kích hoạt
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditDialogOpen(false);
                setSelectedPromoCode(null);
              }}
            >
              Hủy
            </Button>
            <Button onClick={handleUpdatePromoCode} disabled={isUpdating}>
              {isUpdating ? "Đang cập nhật..." : "Cập nhật"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
