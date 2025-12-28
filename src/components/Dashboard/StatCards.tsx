import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Users,
  Car,
  MapPin,
  DollarSign,
  TrendingUp,
  Star,
  AlertCircle,
  CheckCircle,
  Banknote,
} from "lucide-react";

interface StatCardsProps {
  stats: {
    total_users: number;
    total_drivers: number;
    active_drivers: number;
    total_rides: number;
    completed_rides: number;
    cancelled_rides: number;
    total_revenue: number;
    average_rating: number;
  };
  period: {
    period_rides: number;
    period_completed: number;
    period_revenue: number;
    new_users: number;
    new_drivers: number;
  };
}

const StatCard = ({
  link,
  title,
  value,
  icon: Icon,
  iconBg,
  delay = 0,
  trendValue,
  trendLabel,
  subtitle,
}: {
  link: string;
  title: string;
  value: string | number;
  icon: any;
  iconBg: string;
  delay?: number;
  trendValue?: string;
  trendLabel?: string;
  subtitle?: string;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="w-full"
    >
      <Link href={link}>
        <Card className="group cursor-pointer relative overflow-hidden p-5 h-full flex flex-col bg-white transition-all duration-300 shadow-md border border-gray-100">
          {/* Header with title and icon */}
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
              {title}
            </h3>
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${iconBg}`}
            >
              <Icon size={20} className="text-white" />
            </div>
          </div>

          {/* Main value */}
          <div className="mb-2">
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            {subtitle && (
              <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
            )}
          </div>

          {/* Trend indicator */}
          {trendValue && (
            <div className="flex items-center gap-1.5 mt-auto pt-2">
              <TrendingUp size={14} className="text-green-600" />
              <span className="text-sm font-semibold text-green-600">
                {trendValue}
              </span>
              {trendLabel && (
                <span className="text-sm text-gray-500">{trendLabel}</span>
              )}
            </div>
          )}
        </Card>
      </Link>
    </motion.div>
  );
};

export default function StatCards({ stats, period }: StatCardsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("vi-VN").format(num);
  };

  const calculateCompletionRate = () => {
    if (stats.total_rides === 0) return "0%";
    return ((stats.completed_rides / stats.total_rides) * 100).toFixed(1) + "%";
  };

  const calculateCancellationRate = () => {
    if (stats.total_rides === 0) return "0%";
    return ((stats.cancelled_rides / stats.total_rides) * 100).toFixed(1) + "%";
  };

  const statCards = [
    {
      title: "Tổng người dùng",
      value: formatNumber(stats.total_users),
      icon: Users,
      iconBg: "bg-gradient-to-br from-green-400 to-green-600",
      link: "/admin/users",
      trendValue: `+${formatNumber(period.new_users)}`,
      trendLabel: "kỳ này",
      subtitle: "Khách hàng hoạt động",
    },
    {
      title: "Tài xế hoạt động",
      value: formatNumber(stats.active_drivers),
      icon: Car,
      iconBg: "bg-gradient-to-br from-green-400 to-green-600",
      link: "/admin/drivers",
      trendValue: `+${formatNumber(period.new_drivers)}`,
      trendLabel: "hoạt động ngay",
      subtitle: `${formatNumber(stats.total_drivers)} tổng tài xế`,
    },
    {
      title: "Tổng chuyến đi",
      value: formatNumber(stats.total_rides),
      icon: MapPin,
      iconBg: "bg-gradient-to-br from-green-400 to-green-600",
      link: "/admin/rides",
      trendValue: `+${formatNumber(period.period_rides)}`,
      trendLabel: "chuyến mới",
      subtitle: `${calculateCompletionRate()} tỷ lệ hoàn thành`,
    },
    {
      title: "Tổng doanh thu",
      value: formatCurrency(stats.total_revenue),
      icon: DollarSign,
      iconBg: "bg-gradient-to-br from-green-400 to-green-600",
      link: "/admin/rides",
      trendValue: formatCurrency(period.period_revenue),
      trendLabel: "tăng",
      subtitle: "Thu nhập tất cả thời gian",
    },
    {
      title: "Chuyến hoàn thành",
      value: formatNumber(stats.completed_rides),
      icon: CheckCircle,
      iconBg: "bg-gradient-to-br from-green-400 to-green-600",
      link: "/admin/rides",
      trendValue: `+${formatNumber(period.period_completed)}`,
      trendLabel: "tháng này",
      subtitle: "Hoàn thành thành công",
    },
    {
      title: "Chuyến bị hủy",
      value: formatNumber(stats.cancelled_rides),
      icon: AlertCircle,
      iconBg: "bg-gradient-to-br from-gray-400 to-gray-600",
      link: "/admin/rides",
      trendValue: calculateCancellationRate(),
      trendLabel: "vs tuần trước",
      subtitle: "Tỷ lệ hủy chuyến",
    },
    {
      title: "Đánh giá trung bình",
      value: Number(stats.average_rating).toFixed(2),
      icon: Star,
      iconBg: "bg-gradient-to-br from-green-400 to-green-600",
      link: "/admin/ratings",
      trendValue: "Tổng thể",
      trendLabel: "chất lượng cao",
      subtitle: "Đánh giá tài xế",
    },
    {
      title: "Doanh thu kỳ này",
      value: formatCurrency(period.period_revenue),
      icon: Banknote,
      iconBg: "bg-gradient-to-br from-green-400 to-green-600",
      link: "/admin/rides",
      trendValue: `${formatNumber(period.period_completed)}`,
      trendLabel: "chuyến",
      subtitle: "Kỳ này",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat, index) => (
        <StatCard
          key={stat.title}
          link={stat.link}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          iconBg={stat.iconBg}
          delay={index * 0.05}
          trendValue={stat.trendValue}
          trendLabel={stat.trendLabel}
          subtitle={stat.subtitle}
        />
      ))}
    </div>
  );
}
