import { NextRequest, NextResponse } from "next/server";
import { executeSql } from "@/lib/db";

// GET - Get single rating
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const ratingId = parseInt(id);

    const ratings = await executeSql(
      `SELECT 
        rat.*,
        json_build_object(
          'driver_id', d.id,
          'first_name', d.first_name,
          'last_name', d.last_name,
          'profile_image_url', d.profile_image_url,
          'average_rating', d.average_rating,
          'rating_count', d.rating_count
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
          'ride_status', r.ride_status,
          'created_at', r.created_at
        ) as ride
      FROM ratings rat
      INNER JOIN drivers d ON rat.driver_id = d.id
      INNER JOIN users u ON rat.user_id = u.clerk_id
      INNER JOIN rides r ON rat.ride_id = r.ride_id
      WHERE rat.id = $1`,
      [ratingId]
    );

    if (ratings.length === 0) {
      return NextResponse.json(
        { success: false, error: "Rating not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: ratings[0],
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: "Internal server error", details: errorMessage },
      { status: 500 }
    );
  }
}

// PATCH - Update rating
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const ratingId = parseInt(id);
    const body = await request.json();
    const { stars, comment } = body;

    const updates: string[] = [];
    const values: (string | number)[] = [];
    let paramIndex = 1;

    if (stars !== undefined) {
      updates.push(`stars = $${paramIndex++}`);
      values.push(stars);
    }
    if (comment !== undefined) {
      updates.push(`comment = $${paramIndex++}`);
      values.push(comment);
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { success: false, error: "No fields to update" },
        { status: 400 }
      );
    }

    values.push(ratingId);

    const result = await executeSql(
      `UPDATE ratings
       SET ${updates.join(", ")}
       WHERE id = $${paramIndex}
       RETURNING *`,
      values
    );

    if (result.length === 0) {
      return NextResponse.json(
        { success: false, error: "Rating not found" },
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

// DELETE - Delete rating
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const ratingId = parseInt(id);

    const result = await executeSql(
      `DELETE FROM ratings WHERE id = $1 RETURNING *`,
      [ratingId]
    );

    if (result.length === 0) {
      return NextResponse.json(
        { success: false, error: "Rating not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Rating deleted successfully",
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: "Internal server error", details: errorMessage },
      { status: 500 }
    );
  }
}
