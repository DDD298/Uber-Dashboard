"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { IDriver } from "@/interface/auth";
import DriverForm from "./DriverForm";
import DriverTable from "./DriverTable";

interface DriverDetailsDialogProps {
  driver: IDriver | null;
  isOpen: boolean;
  onClose: () => void;
  isEditMode: boolean;
}

export default function DriverDetailsDialog({
  driver,
  isOpen,
  onClose,
  isEditMode,
}: DriverDetailsDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditMode
              ? driver
                ? "Chỉnh sửa tài xế"
                : "Thêm tài xế mới"
              : "Chi tiết tài xế"}
          </DialogTitle>
        </DialogHeader>

        {isEditMode ? (
          <DriverForm driver={driver} onClose={onClose} />
        ) : (
          <Tabs defaultValue="info" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="info">Thông tin</TabsTrigger>
              <TabsTrigger value="stats">Thống kê</TabsTrigger>
              <TabsTrigger value="history">Lịch sử</TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="mt-4">
              {driver && <DriverTable driver={driver} />}
            </TabsContent>

            <TabsContent value="stats" className="mt-4">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">Tổng chuyến đi</p>
                    <p className="text-2xl font-bold">
                      {driver?.total_rides || 0}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">Tổng thu nhập</p>
                    <p className="text-2xl font-bold">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(Number(driver?.total_earnings) || 0)}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">Đánh giá trung bình</p>
                    <p className="text-2xl font-bold">
                      {driver?.average_rating
                        ? Number(driver.average_rating).toFixed(2)
                        : "N/A"}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">Số lượt đánh giá</p>
                    <p className="text-2xl font-bold">
                      {driver?.rating_count || 0}
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="history" className="mt-4">
              <div className="text-center py-8 text-gray-500">
                <p>Lịch sử chuyến đi sẽ được hiển thị ở đây</p>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}
