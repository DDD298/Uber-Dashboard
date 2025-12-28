import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

// GET - Get single user
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const users = await sql(
      `SELECT 
        u.*,
        (SELECT COUNT(*) FROM rides WHERE user_id = u.clerk_id) as total_rides,
        (SELECT COUNT(*) FROM rides WHERE user_id = u.clerk_id AND ride_status = 'completed') as completed_rides,
        (SELECT SUM(fare_price) FROM rides WHERE user_id = u.clerk_id AND payment_status = 'paid') as total_spent
      FROM users u
      WHERE clerk_id = $1`,
      [params.id]
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
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

// PATCH - Update user
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name, email, phone } = body;

    const result = await sql(
      `UPDATE users
       SET 
         name = COALESCE($1, name),
         email = COALESCE($2, email),
         phone = COALESCE($3, phone)
       WHERE clerk_id = $4
       RETURNING *`,
      [name, email, phone, params.id]
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
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete user
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const result = await sql(
      `DELETE FROM users WHERE clerk_id = $1 RETURNING *`,
      [params.id]
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
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
