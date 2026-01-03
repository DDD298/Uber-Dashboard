"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, User, Car } from "lucide-react";
import Link from "next/link";
import { MapPinIcon } from "lucide-react";

interface RecentRide {
  ride_id: number;
  origin_address: string;
  destination_address: string;
  fare_price: number;
  ride_status: string;
  created_at: string;
  user_id: string;
  driver_id: number;
}

export default function RecentActivity() {
  const [recentRides, setRecentRides] = useState<RecentRide[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentRides();
  }, []);

  const fetchRecentRides = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/rides?limit=5&page=1");
      const data = await response.json();

      if (data.success) {
        setRecentRides(data.data);
      }
    } catch (error) {
      console.error("Error fetching recent rides:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return <Badge variant="success">Completed</Badge>;
      case "in_progress":
        return <Badge variant="info">In Progress</Badge>;
      case "confirmed":
        return <Badge variant="warning">Confirmed</Badge>;
      case "cancelled":
        return <Badge variant="danger">Cancelled</Badge>;
      default:
        return (
          <Badge className="bg-gray-100 border-gray-400 text-gray-700 hover:bg-gray-200 border text-sm font-medium uppercase">
            {status}
          </Badge>
        );
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Vừa xong";
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays < 7) return `${diffDays} ngày trước`;
    return date.toLocaleDateString("vi-VN");
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const truncateAddress = (address: string, maxLength: number = 35) => {
    if (address.length <= maxLength) return address;
    return address.substring(0, maxLength) + "...";
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-1">
            Hoạt động gần đây
          </h3>
          <p className="text-sm text-gray-700">
            Các chuyến đi mới nhất trên nền tảng
          </p>
        </div>
        <Link
          href="/admin/rides"
          className="text-sm text-green-700 hover:text-green-700 font-medium"
        >
          Xem tất cả
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-20 bg-gray-100 animate-pulse rounded-lg"
            />
          ))}
        </div>
      ) : recentRides.length === 0 ? (
        <div className="text-center py-16 text-gray-700">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <MapPinIcon size={32} className="text-gray-300" />
          </div>
          <p className="font-medium text-gray-700 mb-1">
            Không có chuyến đi gần đây
          </p>
          <p className="text-sm text-gray-700">
            Chưa có chuyến đi nào để hiển thị trong khoảng thời gian đã chọn.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {recentRides.map((ride) => (
            <Link
              key={ride.ride_id}
              href={`/admin/rides/${ride.ride_id}`}
              className="block"
            >
              <div className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 hover:border-green-300 transition-all cursor-pointer group">
                {/* Icon */}
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Car size={20} className="text-white" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  {/* Addresses */}
                  <div className="mb-2">
                    <div className="flex items-start gap-2 mb-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-900 mt-1.5 flex-shrink-0" />
                      <p className="text-sm font-semibold text-gray-700 line-clamp-1">
                        {truncateAddress(ride.origin_address, 40)}
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700 line-clamp-1">
                        {truncateAddress(ride.destination_address, 40)}
                      </p>
                    </div>
                  </div>

                  {/* Meta Info */}
                  <div className="flex items-center gap-3 flex-wrap">
                    {getStatusBadge(ride.ride_status)}
                    <div className="flex items-center gap-1 text-sm text-gray-700">
                      <Clock size={12} />
                      <span>{formatTime(ride.created_at)}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-700">
                      <User size={12} />
                      <span>#{ride.ride_id}</span>
                    </div>
                  </div>
                </div>

                {/* Price */}
                <div className="text-right flex-shrink-0">
                  <div className="text-base font-bold text-green-700">
                    {formatCurrency(Number(ride.fare_price))}
                  </div>
                  <p className="text-sm text-gray-400 mt-0.5">
                    #{ride.ride_id}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </Card>
  );
}
