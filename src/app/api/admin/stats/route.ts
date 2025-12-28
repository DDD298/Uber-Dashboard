import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "7d"; // 7d, 30d, 90d, 1y

    // Calculate date range
    const now = new Date();
    let startDate = new Date();
    switch (period) {
      case "7d":
        startDate.setDate(now.getDate() - 7);
        break;
      case "30d":
        startDate.setDate(now.getDate() - 30);
        break;
      case "90d":
        startDate.setDate(now.getDate() - 90);
        break;
      case "1y":
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    // Get overview stats
    const overview = await sql(
      `SELECT
        (SELECT COUNT(*) FROM users) as total_users,
        (SELECT COUNT(*) FROM drivers) as total_drivers,
        (SELECT COUNT(*) FROM drivers WHERE status = 'active') as active_drivers,
        (SELECT COUNT(*) FROM rides) as total_rides,
        (SELECT COUNT(*) FROM rides WHERE ride_status = 'completed') as completed_rides,
        (SELECT COUNT(*) FROM rides WHERE ride_status = 'cancelled') as cancelled_rides,
        (SELECT COALESCE(SUM(fare_price), 0) FROM rides WHERE payment_status = 'paid') as total_revenue,
        (SELECT COALESCE(AVG(stars), 0) FROM ratings) as average_rating`
    );

    // Get period stats
    const periodStats = await sql(
      `SELECT
        (SELECT COUNT(*) FROM rides WHERE created_at >= $1) as period_rides,
        (SELECT COUNT(*) FROM rides WHERE created_at >= $1 AND ride_status = 'completed') as period_completed,
        (SELECT COALESCE(SUM(fare_price), 0) FROM rides WHERE created_at >= $1 AND payment_status = 'paid') as period_revenue,
        (SELECT COUNT(*) FROM users WHERE created_at >= $1) as new_users,
        (SELECT COUNT(*) FROM drivers WHERE created_at >= $1) as new_drivers`,
      [startDate.toISOString()]
    );

    // Get daily stats for chart
    const dailyStats = await sql(
      `SELECT 
        DATE(created_at) as date,
        COUNT(*) as rides,
        COUNT(CASE WHEN ride_status = 'completed' THEN 1 END) as completed,
        COALESCE(SUM(CASE WHEN payment_status = 'paid' THEN fare_price ELSE 0 END), 0) as revenue
      FROM rides
      WHERE created_at >= $1
      GROUP BY DATE(created_at)
      ORDER BY date ASC`,
      [startDate.toISOString()]
    );

    // Get top drivers
    const topDrivers = await sql(
      `SELECT 
        d.id,
        d.first_name,
        d.last_name,
        d.average_rating,
        d.rating_count,
        COUNT(r.ride_id) as total_rides,
        COALESCE(SUM(CASE WHEN r.ride_status = 'completed' THEN r.fare_price ELSE 0 END), 0) as total_earnings
      FROM drivers d
      LEFT JOIN rides r ON d.id = r.driver_id AND r.created_at >= $1
      GROUP BY d.id
      ORDER BY total_earnings DESC
      LIMIT 10`,
      [startDate.toISOString()]
    );

    return NextResponse.json({
      success: true,
      data: {
        overview: overview[0],
        period: periodStats[0],
        dailyStats,
        topDrivers,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
