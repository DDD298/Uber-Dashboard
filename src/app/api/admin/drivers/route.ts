import { NextRequest, NextResponse } from "next/server";
import { executeSql } from "@/lib/db";

// GET - List drivers with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const minRating = parseFloat(searchParams.get("minRating") || "0");
    const sortBy = searchParams.get("sortBy") || "id";
    const sortOrder = searchParams.get("sortOrder") || "DESC";

    const offset = (page - 1) * limit;

    // Validate sortBy to prevent SQL injection
    const allowedSortFields = ["id", "first_name", "last_name", "average_rating"];
    const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : "id";
    const safeSortOrder = sortOrder.toUpperCase() === "ASC" ? "ASC" : "DESC";

    // Build WHERE conditions
    const conditions: string[] = [];
    const values: (string | number)[] = [];
    let paramIndex = 1;

    if (search) {
      conditions.push(`(first_name ILIKE $${paramIndex} OR last_name ILIKE $${paramIndex})`);
      values.push(`%${search}%`);
      paramIndex++;
    }
    if (minRating > 0) {
      conditions.push(`average_rating >= $${paramIndex}`);
      values.push(minRating);
      paramIndex++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    // Get total count
    const countResult = await executeSql<{ total: string }>(
      `SELECT COUNT(*) as total FROM drivers ${whereClause}`,
      values
    );
    const total = parseInt(countResult[0].total);

    // Get drivers with ride stats
    const drivers = await executeSql(
      `SELECT 
        d.*,
        (SELECT COUNT(*) FROM rides WHERE driver_id = d.id) as total_rides,
        (SELECT COUNT(*) FROM rides WHERE driver_id = d.id AND ride_status = 'completed') as completed_rides,
        (SELECT SUM(fare_price) FROM rides WHERE driver_id = d.id AND payment_status = 'paid') as total_earnings
      FROM drivers d
      ${whereClause}
      ORDER BY ${safeSortBy} ${safeSortOrder}
      LIMIT $${paramIndex}
      OFFSET $${paramIndex + 1}`,
      [...values, limit, offset]
    );

    return NextResponse.json({
      success: true,
      data: drivers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error fetching drivers:", errorMessage);
    return NextResponse.json(
      { success: false, error: "Internal server error", details: errorMessage },
      { status: 500 }
    );
  }
}

// POST - Create driver
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      first_name,
      last_name,
      profile_image_url,
      car_image_url,
      car_seats,
      vehicle_type,
    } = body;

    // Validate required fields
    if (!first_name || !last_name) {
      return NextResponse.json(
        { success: false, error: "First name and last name are required" },
        { status: 400 }
      );
    }

    const result = await executeSql(
      `INSERT INTO drivers (
        first_name, last_name,
        profile_image_url, car_image_url, car_seats, vehicle_type,
        rating, rating_count, average_rating
      )
      VALUES ($1, $2, $3, $4, $5, $6, 5.0, 0, 5.0)
      RETURNING *`,
      [
        first_name,
        last_name,
        profile_image_url || null,
        car_image_url || null,
        car_seats || 4,
        vehicle_type || "Car",
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
    console.error("Error creating driver:", error.message);
    return NextResponse.json(
      { success: false, error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

