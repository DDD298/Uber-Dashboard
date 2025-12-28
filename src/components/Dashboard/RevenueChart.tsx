"use client";

import { Card } from "@/components/ui/card";
import { Line } from "react-chartjs-2";
import { Calendar, TrendingUp } from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface RevenueChartProps {
  data: Array<{
    date: string;
    rides: number;
    completed: number;
    revenue: number;
  }>;
  period: string;
}

export default function RevenueChart({ data, period }: RevenueChartProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", { month: "short", day: "numeric" });
  };

  const chartData = {
    labels: data.map((item) => formatDate(item.date)),
    datasets: [
      {
        label: "Doanh thu (VND)",
        data: data.map((item) => Number(item.revenue)),
        borderColor: "rgb(16, 185, 129)",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        fill: true,
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointBackgroundColor: "rgb(16, 185, 129)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        borderWidth: 3,
      },
      {
        label: "Chuyến đi hoàn thành",
        data: data.map((item) => Number(item.completed)),
        borderColor: "rgb(34, 197, 94)",
        backgroundColor: "rgba(34, 197, 94, 0.08)",
        fill: true,
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointBackgroundColor: "rgb(34, 197, 94)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        borderWidth: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: "top" as const,
        align: "end" as const,
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
          padding: 15,
          font: {
            size: 12,
            weight: 500,
            family: "'Inter', sans-serif",
          },
          color: "#374151",
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(17, 24, 39, 0.95)",
        padding: 12,
        titleFont: {
          size: 13,
          weight: 600,
          family: "'Inter', sans-serif",
        },
        bodyFont: {
          size: 13,
          family: "'Inter', sans-serif",
        },
        borderColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          title: function (context: any) {
            return context[0].label;
          },
          label: function (context: any) {
            let label = context.dataset.label || "";
            if (context.parsed.y !== null) {
              if (context.datasetIndex === 0) {
                return `${label}: ${new Intl.NumberFormat("vi-VN").format(
                  context.parsed.y
                )}M VND`;
              } else {
                return `${label}: ${context.parsed.y.toLocaleString("vi-VN")}`;
              }
            }
            return label;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.04)",
          drawBorder: false,
        },
        border: {
          display: false,
        },
        ticks: {
          font: {
            size: 11,
            family: "'Inter', sans-serif",
          },
          color: "#9CA3AF",
          padding: 8,
          callback: function (value: any) {
            if (value >= 1000000) {
              return (value / 1000000).toFixed(0) + "M";
            }
            return value.toLocaleString("vi-VN");
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
        ticks: {
          font: {
            size: 11,
            family: "'Inter', sans-serif",
          },
          color: "#9CA3AF",
          maxRotation: 0,
          minRotation: 0,
        },
      },
    },
  };

  const getPeriodLabel = () => {
    const startDate = data.length > 0 ? new Date(data[0].date) : new Date();
    const endDate =
      data.length > 0 ? new Date(data[data.length - 1].date) : new Date();

    const formatDateRange = (start: Date, end: Date) => {
      const options: Intl.DateTimeFormatOptions = {
        month: "short",
        day: "numeric",
        year: "numeric",
      };
      return `${start.toLocaleDateString("vi-VN", {
        month: "short",
        day: "numeric",
      })} - ${end.toLocaleDateString("vi-VN", options)}`;
    };

    switch (period) {
      case "7d":
        return `7 ngày qua (${formatDateRange(startDate, endDate)})`;
      case "30d":
        return `30 ngày qua (${formatDateRange(startDate, endDate)})`;
      case "90d":
        return `90 ngày qua (${formatDateRange(startDate, endDate)})`;
      case "1y":
        return `1 năm qua (${formatDateRange(startDate, endDate)})`;
      default:
        return formatDateRange(startDate, endDate);
    }
  };

  const totalRevenue = data.reduce(
    (sum, item) => sum + Number(item.revenue),
    0
  );
  const totalRides = data.reduce(
    (sum, item) => sum + Number(item.completed),
    0
  );

  // Calculate growth percentage (mock data - you can calculate from actual previous period)
  const revenueGrowth = 12;
  const ridesGrowth = 5;

  return (
    <Card className="p-6">
      <div className="mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Tổng quan Doanh thu & Chuyến đi
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar size={16} />
              <span>{getPeriodLabel()}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mt-4">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg border border-green-100">
            <p className="text-sm text-gray-600 mb-1">Tổng doanh thu</p>
            <div className="flex items-end gap-3">
              <p className="text-2xl font-bold text-green-700">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(totalRevenue)}
              </p>
              <div className="flex items-center gap-1 text-green-700 text-sm font-medium mb-1">
                <TrendingUp size={14} />
                <span>+{revenueGrowth}%</span>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg border border-green-100">
            <p className="text-sm text-gray-600 mb-1">
              Tổng chuyến đi hoàn thành
            </p>
            <div className="flex items-end gap-3">
              <p className="text-2xl font-bold text-green-700">
                {totalRides.toLocaleString("vi-VN")} chuyến
              </p>
              <div className="flex items-center gap-1 text-green-700 text-sm font-medium mb-1">
                <TrendingUp size={14} />
                <span>+{ridesGrowth}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ height: "320px" }}>
        <Line data={chartData} options={options} />
      </div>
    </Card>
  );
}
