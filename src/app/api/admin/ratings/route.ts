import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

// GET - List ratings with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const driverId = searchParams.get("driverId");
    const userId = searchParams.get("userId");
    const minStars = searchParams.get("minStars");
    const maxStars = searchParams.get("maxStars");
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");
    const hasComment = searchParams.get("hasComment");

    const offset = (page - 1) * limit;

    // Build WHERE conditions
    let conditions = [];
    let values: any[] = [];
    let paramIndex = 1;

    if (driverId) {
      conditions.push(`rat.driver_id = $${paramIndex++}`);
      values.push(parseInt(driverId));
    }
    if (userId) {
      conditions.push(`rat.user_id = $${paramIndex++}`);
      values.push(userId);
    }
    if (minStars) {
      conditions.push(`rat.stars >= $${paramIndex++}`);
      values.push(parseInt(minStars));
    }
    if (maxStars) {
      conditions.push(`rat.stars <= $${paramIndex++}`);
      values.push(parseInt(maxStars));
    }
    if (dateFrom) {
      conditions.push(`rat.created_at >= $${paramIndex++}`);
      values.push(dateFrom);
    }
    if (dateTo) {
      conditions.push(`rat.created_at <= $${paramIndex++}`);
      values.push(dateTo);
    }
    if (hasComment === "true") {
      conditions.push(`rat.comment IS NOT NULL AND rat.comment != ''`);
    } else if (hasComment === "false") {
      conditions.push(`(rat.comment IS NULL OR rat.comment = '')`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    // Get total count
    const countResult = await sql(
      `SELECT COUNT(*) as total FROM ratings rat ${whereClause}`,
      values
    );
    const total = parseInt(countResult[0].total);

    // Get ratings with related data
    const ratings = await sql(
      `SELECT 
        rat.*,
        json_build_object(
          'driver_id', d.id,
          'first_name', d.first_name,
          'last_name', d.last_name,
          'profile_image_url', d.profile_image_url,
          'average_rating', d.average_rating
        ) as driver,
        json_build_object(
          'clerk_id', u.clerk_id,
          'name', u.name,
          'email', u.email
        ) as user,
        json_build_object(
          'ride_id', r.ride_id,
          'origin_address', r.origin_address,
          'destination_address', r.destination_address,
          'fare_price', r.fare_price,
          'created_at', r.created_at
        ) as ride
      FROM ratings rat
      INNER JOIN drivers d ON rat.driver_id = d.id
      INNER JOIN users u ON rat.user_id = u.clerk_id
      INNER JOIN rides r ON rat.ride_id = r.ride_id
      ${whereClause}
      ORDER BY rat.created_at DESC
      LIMIT $${paramIndex}
      OFFSET $${paramIndex + 1}`,
      [...values, limit, offset]
    );

    return NextResponse.json({
      success: true,
      data: ratings,
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

// POST - Create rating
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ride_id, user_id, driver_id, stars, comment } = body;

    // Check if rating already exists
    const existing = await sql(
      `SELECT id FROM ratings WHERE ride_id = $1`,
      [ride_id]
    );

    if (existing.length > 0) {
      return NextResponse.json(
        { success: false, error: "Rating already exists for this ride" },
        { status: 400 }
      );
    }

    const result = await sql(
      `INSERT INTO ratings (ride_id, user_id, driver_id, stars, comment, created_at)
       VALUES ($1, $2, $3, $4, $5, NOW())
       RETURNING *`,
      [ride_id, user_id, driver_id, stars, comment || null]
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
