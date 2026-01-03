import { NextRequest, NextResponse } from "next/server";
import { executeSql } from "@/lib/db";

// GET - Get single user
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const users = await executeSql(
      `SELECT 
        u.*,
        (SELECT COUNT(*) FROM rides WHERE user_id = u.clerk_id) as total_rides,
        (SELECT COUNT(*) FROM rides WHERE user_id = u.clerk_id AND ride_status = 'completed') as completed_rides,
        (SELECT SUM(fare_price) FROM rides WHERE user_id = u.clerk_id AND payment_status = 'paid') as total_spent
      FROM users u
      WHERE clerk_id = $1`,
      [id]
    );

    if (users.length === 0) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: users[0],
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: "Internal server error", details: errorMessage },
      { status: 500 }
    );
  }
}

// PATCH - Update user
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json();
    const { name, email, phone } = body;

    const result = await executeSql(
      `UPDATE users
       SET 
         name = COALESCE($1, name),
         email = COALESCE($2, email),
         phone = COALESCE($3, phone)
       WHERE clerk_id = $4
       RETURNING *`,
      [name, email, phone, id]
    );

    if (result.length === 0) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result[0],
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: "Internal server error", details: errorMessage },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const result = await executeSql(
      `DELETE FROM users WHERE clerk_id = $1 RETURNING *`,
      [id]
    );

    if (result.length === 0) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: "Internal server error", details: errorMessage },
      { status: 500 }
    );
  }
}
