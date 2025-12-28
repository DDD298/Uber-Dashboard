import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

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

    // Build search condition
    let searchCondition = "";
    let searchValues: any[] = [];
    
    if (search) {
      searchCondition = "WHERE name ILIKE $1 OR email ILIKE $1";
      searchValues = [`%${search}%`];
    }

    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM users ${searchCondition}`;
    const countResult = await sql(countQuery, searchValues);
    const total = parseInt(countResult[0].total);

    // Get users
    const usersQuery = `
      SELECT 
        clerk_id,
        name,
        email,
        phone,
        created_at,
        (SELECT COUNT(*) FROM rides WHERE user_id = users.clerk_id) as total_rides,
        (SELECT COUNT(*) FROM rides WHERE user_id = users.clerk_id AND ride_status = 'completed') as completed_rides
      FROM users
      ${searchCondition}
      ORDER BY ${sortBy} ${sortOrder}
      LIMIT $${searchValues.length + 1}
      OFFSET $${searchValues.length + 2}
    `;
    
    const users = await sql(usersQuery, [...searchValues, limit, offset]);

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
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

// POST - Create new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { clerk_id, name, email, phone } = body;

    const result = await sql(
      `INSERT INTO users (clerk_id, name, email, phone, created_at)
       VALUES ($1, $2, $3, $4, NOW())
       RETURNING *`,
      [clerk_id, name, email, phone || null]
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
