import { NextRequest, NextResponse } from "next/server";
import { executeSql } from "@/lib/db";

// GET - List all users with pagination, search, filter
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const sortBy = searchParams.get("sortBy") || "created_at";
    const sortOrder = searchParams.get("sortOrder") || "DESC";

    const offset = (page - 1) * limit;

    // Validate sortBy to prevent SQL injection
    const allowedSortFields = ["clerk_id", "name", "email"];
    const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : "clerk_id";
    const safeSortOrder = sortOrder.toUpperCase() === "ASC" ? "ASC" : "DESC";

    // Build search condition
    let searchCondition = "";
    const searchValues: (string | number)[] = [];
    
    if (search) {
      searchCondition = "WHERE name ILIKE $1 OR email ILIKE $1";
      searchValues.push(`%${search}%`);
    }

    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM users ${searchCondition}`;
    const countResult = await executeSql<{ total: string }>(countQuery, searchValues);
    const total = parseInt(countResult[0].total);

    // Get users
    const usersQuery = `
      SELECT 
        clerk_id,
        name,
        email,
        (SELECT COUNT(*) FROM rides WHERE user_id = users.clerk_id) as total_rides,
        (SELECT COUNT(*) FROM rides WHERE user_id = users.clerk_id AND ride_status = 'completed') as completed_rides
      FROM users
      ${searchCondition}
      ORDER BY ${safeSortBy} ${safeSortOrder}
      LIMIT $${searchValues.length + 1}
      OFFSET $${searchValues.length + 2}
    `;
    
    const users = await executeSql(usersQuery, [...searchValues, limit, offset]);

    return NextResponse.json({
      success: true,
      data: users,
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

// POST - Create new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { clerk_id, name, email } = body;

    const result = await executeSql(
      `INSERT INTO users (clerk_id, name, email)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [clerk_id, name, email]
    );

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
