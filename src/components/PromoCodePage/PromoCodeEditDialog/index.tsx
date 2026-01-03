import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { PromoCode, PromoCodeFormData } from "../types";

interface PromoCodeEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: PromoCodeFormData) => void;
  isSubmitting: boolean;
  initialData: PromoCode | null;
}

export default function PromoCodeEditDialog({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting,
  initialData,
}: PromoCodeEditDialogProps) {
  const [formData, setFormData] = useState<PromoCodeFormData>({
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

  useEffect(() => {
    if (initialData) {
      setFormData({
        code: initialData.code,
        description: initialData.description,
        discount_type: initialData.discount_type,
        discount_value: initialData.discount_value.toString(),
        max_discount_amount: initialData.max_discount_amount?.toString() || "",
        min_order_amount: initialData.min_order_amount?.toString() || "",
        usage_limit: initialData.usage_limit?.toString() || "",
        start_date: initialData.start_date,
        end_date: initialData.end_date,
        is_active: initialData.is_active,
      });
    }
  }, [initialData]);

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa mã giảm giá</DialogTitle>
          <DialogDescription>Cập nhật thông tin mã giảm giá</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
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
              <Label htmlFor="edit-min_order_amount">Đơn tối thiểu (VNĐ)</Label>
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
              onOpenChange(false);
            }}
          >
            Hủy
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Đang cập nhật..." : "Cập nhật"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
