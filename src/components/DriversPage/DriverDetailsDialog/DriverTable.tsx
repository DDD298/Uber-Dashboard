"use client";

import type { IDriver } from "@/interface/auth";
import { IconCar, IconArmchair } from "@tabler/icons-react";

interface DriverTableProps {
  driver: IDriver;
}

export default function DriverTable({ driver }: DriverTableProps) {
  return (
    <div className="space-y-4">
      {/* Basic Info */}
      <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-200 flex-shrink-0">
          <img
            src={
              driver.profile_image_url ||
              `https://api.dicebear.com/7.x/avataaars/svg?seed=${driver.first_name}${driver.last_name}`
            }
            alt={`${driver.first_name} ${driver.last_name}`}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 pt-2">
          <h3 className="text-xl font-semibold text-gray-700">
            {driver.first_name} {driver.last_name}
          </h3>
          <p className="text-gray-700 text-sm mt-1">
            {driver.vehicle_type || "N/A"} Driver
          </p>
        </div>
      </div>

      {/* Vehicle Information */}
      <div className="space-y-3">
        <h4 className="font-semibold text-gray-700">Thông tin phương tiện</h4>

        {/* Car Image */}
        {driver.car_image_url && (
          <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden mb-4 border border-gray-200">
            <img
              src={driver.car_image_url}
              alt="Vehicle"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <IconCar className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-700">Loại xe</p>
              <p className="font-medium">{driver.vehicle_type || "N/A"}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <IconArmchair className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-700">Số chỗ</p>
              <p className="font-medium">{driver.car_seats || "N/A"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
