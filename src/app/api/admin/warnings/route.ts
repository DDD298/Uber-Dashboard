import { NextRequest, NextResponse } from "next/server";
import { executeSql } from "@/lib/db";

// GET - List warnings with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const driverId = searchParams.get("driverId");
    const severity = searchParams.get("severity");
    const warningType = searchParams.get("warningType");
    const resolved = searchParams.get("resolved");
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");

    const offset = (page - 1) * limit;

    // Build WHERE conditions
    const conditions: string[] = [];
    const values: (string | number)[] = [];
    let paramIndex = 1;

    if (driverId) {
      conditions.push(`w.driver_id = $${paramIndex++}`);
      values.push(parseInt(driverId));
    }
    if (severity) {
      conditions.push(`w.severity = $${paramIndex++}`);
      values.push(severity);
    }
    if (warningType) {
      conditions.push(`w.warning_type = $${paramIndex++}`);
      values.push(warningType);
    }
    if (resolved === "true") {
      conditions.push(`w.resolved_at IS NOT NULL`);
    } else if (resolved === "false") {
      conditions.push(`w.resolved_at IS NULL`);
    }
    if (dateFrom) {
      conditions.push(`w.created_at >= $${paramIndex++}`);
      values.push(dateFrom);
    }
    if (dateTo) {
      conditions.push(`w.created_at <= $${paramIndex++}`);
      values.push(dateTo);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    // Get total count
    const countResult = await executeSql<{ total: string }>(
      `SELECT COUNT(*) as total FROM driver_warnings w ${whereClause}`,
      values
    );
    const total = parseInt(countResult[0].total);

    // Get warnings with driver info
    const warnings = await executeSql(
      `SELECT 
        w.*,
        json_build_object(
          'driver_id', d.id,
          'first_name', d.first_name,
          'last_name', d.last_name,
          'average_rating', d.average_rating,
          'rating_count', d.rating_count
        ) as driver,
        CASE 
          WHEN w.rating_id IS NOT NULL THEN (
            SELECT json_build_object(
              'id', r.id,
              'stars', r.stars,
              'comment', r.comment,
              'ride_id', r.ride_id
            )
            FROM ratings r
            WHERE r.id = w.rating_id
          )
          ELSE NULL
        END as rating
      FROM driver_warnings w
      INNER JOIN drivers d ON w.driver_id = d.id
      ${whereClause}
      ORDER BY w.created_at DESC
      LIMIT $${paramIndex}
      OFFSET $${paramIndex + 1}`,
      [...values, limit, offset]
    );

    return NextResponse.json({
      success: true,
      data: warnings,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: "Internal server error", details: errorMessage },
      { status: 500 }
    );
  }
}

// POST - Create warning
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      driver_id,
      warning_type,
      severity,
      reason,
      rating_id,
      action_taken,
    } = body;

    const result = await executeSql(
      `INSERT INTO driver_warnings (
        driver_id, warning_type, severity, reason,
        rating_id, action_taken, created_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, NOW())
      RETURNING *`,
      [driver_id, warning_type, severity, reason, rating_id || null, action_taken]
    );

    // Note: warning_count and last_warning_at columns don't exist in current schema
    // Skipping driver update

    return NextResponse.json(
      {
        success: true,
        data: result[0],
      },
      { status: 201 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: "Internal server error", details: errorMessage },
      { status: 500 }
    );
  }
}
