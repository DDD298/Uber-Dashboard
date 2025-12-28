import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

// GET - List rides with advanced filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status") || "all";
    const paymentStatus = searchParams.get("paymentStatus") || "all";
    const driverId = searchParams.get("driverId");
    const userId = searchParams.get("userId");
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");
    const minFare = searchParams.get("minFare");
    const maxFare = searchParams.get("maxFare");
    const search = searchParams.get("search") || "";

    const offset = (page - 1) * limit;

    // Build WHERE conditions
    let conditions = [];
    let values: any[] = [];
    let paramIndex = 1;

    if (status !== "all") {
      conditions.push(`r.ride_status = $${paramIndex++}`);
      values.push(status);
    }
    if (paymentStatus !== "all") {
      conditions.push(`r.payment_status = $${paramIndex++}`);
      values.push(paymentStatus);
    }
    if (driverId) {
      conditions.push(`r.driver_id = $${paramIndex++}`);
      values.push(parseInt(driverId));
    }
    if (userId) {
      conditions.push(`r.user_id = $${paramIndex++}`);
      values.push(userId);
    }
    if (dateFrom) {
      conditions.push(`r.created_at >= $${paramIndex++}`);
      values.push(dateFrom);
    }
    if (dateTo) {
      conditions.push(`r.created_at <= $${paramIndex++}`);
      values.push(dateTo);
    }
    if (minFare) {
      conditions.push(`r.fare_price >= $${paramIndex++}`);
      values.push(parseFloat(minFare));
    }
    if (maxFare) {
      conditions.push(`r.fare_price <= $${paramIndex++}`);
      values.push(parseFloat(maxFare));
    }
    if (search) {
      conditions.push(`(r.origin_address ILIKE $${paramIndex} OR r.destination_address ILIKE $${paramIndex})`);
      values.push(`%${search}%`);
      paramIndex++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    // Get total count
    const countResult = await sql(
      `SELECT COUNT(*) as total FROM rides r ${whereClause}`,
      values
    );
    const total = parseInt(countResult[0].total);

    // Get rides with driver and user info
    const rides = await sql(
      `SELECT 
        r.*,
        json_build_object(
          'driver_id', d.id,
          'first_name', d.first_name,
          'last_name', d.last_name,
          'profile_image_url', d.profile_image_url,
          'car_image_url', d.car_image_url,
          'car_seats', d.car_seats,
          'rating', d.rating,
          'vehicle_type', d.vehicle_type
        ) as driver,
        json_build_object(
          'clerk_id', u.clerk_id,
          'name', u.name,
          'email', u.email,
          'phone', u.phone
        ) as user,
        CASE 
          WHEN rat.id IS NOT NULL THEN json_build_object(
            'id', rat.id,
            'stars', rat.stars,
            'comment', rat.comment,
            'created_at', rat.created_at
          )
          ELSE NULL
        END as rating
      FROM rides r
      INNER JOIN drivers d ON r.driver_id = d.id
      INNER JOIN users u ON r.user_id = u.clerk_id
      LEFT JOIN ratings rat ON r.ride_id = rat.ride_id
      ${whereClause}
      ORDER BY r.created_at DESC
      LIMIT $${paramIndex}
      OFFSET $${paramIndex + 1}`,
      [...values, limit, offset]
    );

    return NextResponse.json({
      success: true,
      data: rides,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

// POST - Create ride (manual booking by admin)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      origin_address,
      destination_address,
      origin_latitude,
      origin_longitude,
      destination_latitude,
      destination_longitude,
      ride_time,
      fare_price,
      driver_id,
      user_id,
      payment_status = "pending",
      ride_status = "confirmed",
    } = body;

    const result = await sql(
      `INSERT INTO rides (
        origin_address, destination_address,
        origin_latitude, origin_longitude,
        destination_latitude, destination_longitude,
        ride_time, fare_price,
        driver_id, user_id,
        payment_status, ride_status,
        created_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW())
      RETURNING *`,
      [
        origin_address,
        destination_address,
        origin_latitude,
        origin_longitude,
        destination_latitude,
        destination_longitude,
        ride_time,
        fare_price,
        driver_id,
        user_id,
        payment_status,
        ride_status,
      ]
    );

    return NextResponse.json(
      {
        success: true,
        data: result[0],
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
