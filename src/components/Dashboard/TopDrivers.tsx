import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, TrendingUp, ArrowRight } from "lucide-react";
import Link from "next/link";

interface TopDriversProps {
  drivers: Array<{
    id: number;
    first_name: string;
    last_name: string;
    average_rating: number;
    rating_count: number;
    total_rides: number;
    total_earnings: number;
  }>;
}

export default function TopDrivers({ drivers }: TopDriversProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getMedalColor = (index: number) => {
    switch (index) {
      case 0:
        return "bg-gradient-to-br from-yellow-400 to-yellow-500";
      case 1:
        return "bg-gradient-to-br from-gray-400 to-gray-500";
      case 2:
        return "bg-gradient-to-br from-orange-400 to-orange-500";
      case 3:
        return "bg-gradient-to-br from-green-400 to-green-500";
      default:
        return "bg-gradient-to-br from-green-400 to-green-500";
    }
  };

  return (
    <Card className="p-6 shadow-md">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-1">
            Tài xế hàng đầu
          </h3>
          <p className="text-sm text-gray-500">
            Thu nhập cao nhất trong kỳ này
          </p>
        </div>
        <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
          <TrendingUp className="text-green-700" size={20} />
        </div>
      </div>

      <div className="space-y-3">
        {drivers.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="font-medium">Không có dữ liệu tài xế</p>
          </div>
        ) : (
          drivers.slice(0, 5).map((driver, index) => (
            <Link
              key={driver.id}
              href={`/admin/drivers/${driver.id}`}
              className="block"
            >
              <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-all cursor-pointer group">
                {/* Rank Badge */}
                <div
                  className={`w-10 h-10 rounded-full ${getMedalColor(
                    index
                  )} flex items-center justify-center text-white font-bold text-base shadow-sm flex-shrink-0`}
                >
                  {index + 1}
                </div>

                {/* Avatar */}
                <Avatar className="h-11 w-11 border-2 border-white shadow-sm flex-shrink-0">
                  <AvatarImage
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${driver.first_name}${driver.last_name}`}
                  />
                  <AvatarFallback className="bg-gray-200 text-gray-700 font-semibold">
                    {getInitials(driver.first_name, driver.last_name)}
                  </AvatarFallback>
                </Avatar>

                {/* Driver Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm truncate mb-1">
                    {driver.first_name} {driver.last_name}
                  </p>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="flex items-center gap-1">
                      <Star
                        size={12}
                        className="text-yellow-500 fill-yellow-500"
                      />
                      <span className="font-medium text-gray-700">
                        {Number(driver.average_rating).toFixed(2)}
                      </span>
                      <span className="text-gray-400">
                        ({driver.rating_count})
                      </span>
                    </div>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-600">
                      {driver.total_rides} chuyến
                    </span>
                  </div>
                </div>

                {/* Earnings */}
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-green-700 text-base">
                    {formatCurrency(Number(driver.total_earnings))}
                  </p>
                  <p className="text-sm text-gray-400">thu nhập</p>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>

      {drivers.length > 0 && (
        <div className="mt-5 pt-4 border-t border-gray-100">
          <Link
            href="/admin/drivers"
            className="text-sm text-green-700 hover:text-green-700 font-semibold flex items-center justify-center gap-2 group transition-colors"
          >
            Xem tất cả tài xế
            <ArrowRight
              size={16}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </div>
      )}
    </Card>
  );
}
