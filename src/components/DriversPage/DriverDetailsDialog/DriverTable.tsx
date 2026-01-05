"use client";

import type { IDriver } from "@/interface/auth";
import {
  IconCar,
  IconArmchair,
  IconMail,
  IconPhone,
  IconFileText,
} from "@tabler/icons-react";

interface DriverTableProps {
  driver: IDriver;
}

export default function DriverTable({ driver }: DriverTableProps) {
  return (
    <div className="space-y-4">
      {/* Basic Info */}
      <div className="flex flex-col gap-4 p-4 bg-[#EEF6EF] rounded-xl border border-green-200 shadow-sm transition-all hover:bg-[#EEF6EF]/90">
        <div className="w-20 h-20 self-center rounded-full overflow-hidden border-2 border-green-300 flex-shrink-0 shadow-sm">
          <img
            src={
              driver.profile_image_url ||
              `https://api.dicebear.com/7.x/avataaars/svg?seed=${driver.first_name}${driver.last_name}`
            }
            alt={`${driver.first_name} ${driver.last_name}`}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-green-700">
            {driver.first_name} {driver.last_name}
          </h3>
          <p className="text-gray-600 text-sm font-semibold mt-1 capitalize px-3 w-fit bg-slate-200 rounded-full flex items-center gap-1">
            <IconCar size={16} />
            {driver.vehicle_type || "N/A"} Driver
          </p>
          <div className="mt-3 space-y-1.5">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <IconMail size={16} className="text-green-600" />
              <span className="truncate text-base">
                {driver.email || "N/A"}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <IconPhone size={16} className="text-green-600" />
              <span className="text-base">{driver.phone || "N/A"}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <IconFileText size={16} className="text-green-600" />
              <span className="text-base">
                {driver.license_number || driver.license_plate || "N/A"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Vehicle Information */}
      <div className="space-y-3">
        <h4 className="font-bold text-gray-800 flex items-center gap-2">
          <IconCar size={18} className="text-green-600" />
          Thông tin phương tiện
        </h4>

        {/* Car Image */}
        {driver.car_image_url && (
          <div className="w-full h-40 bg-gray-100 rounded-xl overflow-hidden mb-4 border border-gray-200 shadow-inner group relative">
            <img
              src={driver.car_image_url}
              alt="Vehicle"
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
            />
            <div className="absolute top-2 right-2">
              <span className="bg-black/50 text-white text-sm px-2 py-0.5 rounded-full backdrop-blur-sm">
                Ảnh xe
              </span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100 shadow-sm">
            <div className="bg-[#EEF6EF] p-2 h-9 w-9 rounded-lg flex items-center justify-center">
              <IconCar className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600 uppercase font-bold">
                Loại xe
              </p>
              <p className="text-sm font-semibold capitalize">
                {driver.vehicle_type || "N/A"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100 shadow-sm">
            <div className="bg-[#EEF6EF] p-2 h-9 w-9 rounded-lg flex items-center justify-center">
              <IconArmchair className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600 uppercase font-bold">
                Số chỗ
              </p>
              <p className="text-sm font-semibold capitalize">
                {driver.car_seats || "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
