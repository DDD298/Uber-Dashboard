"use client";

import { useState, useEffect } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import StatCards from "./StatCards";
import RevenueChart from "./RevenueChart";
import TopDrivers from "./TopDrivers";
import RecentActivity from "./RecentActivity";
import { toast } from "react-toastify";
import { IconCalendar, IconFile } from "@tabler/icons-react";

interface StatsData {
  overview: {
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
  dailyStats: Array<{
    date: string;
    rides: number;
    completed: number;
    revenue: number;
  }>;
  topDrivers: Array<{
    id: number;
    first_name: string;
    last_name: string;
    average_rating: number;
    rating_count: number;
    total_rides: number;
    total_earnings: number;
  }>;
}

export default function DashboardPage() {
  const [period, setPeriod] = useState<string>("7d");
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async (selectedPeriod: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/stats?period=${selectedPeriod}`);
      const data = await response.json();

      if (data.success) {
        setStats(data.data);
      } else {
        toast.error("Failed to load statistics");
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
      toast.error("Error loading dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats(period);
  }, [period]);

  const handlePeriodChange = (newPeriod: string) => {
    setPeriod(newPeriod);
  };

  return (
    <div className="space-y-4 bg-[#EFF0F7] p-4 rounded-lg border border-lightBorderV1">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Overview</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Dashboard Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-semibold text-gray-700 mb-1">
            Tổng quan Dashboard
          </h1>
          <p className="text-base text-gray-700">
            Thống kê thời gian thực cho nền tảng gọi xe
          </p>
        </div>

        {/* Period Selector & Export */}
        <div className="flex items-center gap-3">
          <Select value={period} onValueChange={handlePeriodChange}>
            <SelectTrigger className="w-[180px] bg-mainTextHoverV1 hover:bg-primary/90 text-white">
              <div className="flex items-center gap-2">
                <IconCalendar className="h-4 w-4" />
                <SelectValue placeholder="Chọn khoảng thời gian" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 ngày qua</SelectItem>
              <SelectItem value="30d">30 ngày qua</SelectItem>
              <SelectItem value="90d">90 ngày qua</SelectItem>
              <SelectItem value="1y">1 năm qua</SelectItem>
            </SelectContent>
          </Select>

          <Button className="bg-mainTextHoverV1 hover:bg-primary/90 text-white">
            <IconFile className="h-4 w-4" />
            Xuất báo cáo
          </Button>
        </div>
      </div>

      {/* Stat Cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-40 bg-gray-100 animate-pulse rounded-lg"
            />
          ))}
        </div>
      ) : (
        stats && <StatCards stats={stats.overview} period={stats.period} />
      )}

      <div className="w-full mt-4">
        {loading ? (
          <div className="h-96 bg-gray-100 animate-pulse rounded-lg" />
        ) : (
          stats && <RevenueChart data={stats.dailyStats} period={period} />
        )}
      </div>

      <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
        {stats && <TopDrivers drivers={stats.topDrivers} />}
        <RecentActivity />
      </div>
    </div>
  );
}
