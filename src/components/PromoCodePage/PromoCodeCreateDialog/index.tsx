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
import { useState } from "react";
import { PromoCodeFormData } from "../types";

interface PromoCodeCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: PromoCodeFormData) => void;
  isSubmitting: boolean;
}

export default function PromoCodeCreateDialog({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting,
}: PromoCodeCreateDialogProps) {
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

  const handleSubmit = () => {
    onSubmit(formData);
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

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        if (!val) resetForm();
        onOpenChange(val);
      }}
    >
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Đang tạo..." : "Tạo mã"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
