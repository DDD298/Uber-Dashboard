import { NextRequest, NextResponse } from "next/server";
import { executeSql } from "@/lib/db";

// GET - Get single ride with full details
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const rideId = parseInt(params.id);

    const rides = await executeSql(
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
          'email', u.email
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
      WHERE r.ride_id = $1`,
      [rideId]
    );

    if (rides.length === 0) {
      return NextResponse.json(
        { success: false, error: "Ride not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: rides[0],
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: "Internal server error", details: errorMessage },
      { status: 500 }
    );
  }
}

// PATCH - Update ride
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const rideId = parseInt(params.id);
    const body = await request.json();
    const { ride_status, payment_status, cancel_reason, fare_price } = body;

    // Build update fields
    const updates: string[] = [];
    const values: (string | number)[] = [];
    let paramIndex = 1;

    if (ride_status !== undefined) {
      updates.push(`ride_status = $${paramIndex++}`);
      values.push(ride_status);
      
      // If cancelling, set cancelled_at
      if (ride_status === "cancelled" || ride_status === "no_show") {
        updates.push(`cancelled_at = NOW()`);
      }
    }
    if (payment_status !== undefined) {
      updates.push(`payment_status = $${paramIndex++}`);
      values.push(payment_status);
    }
    if (cancel_reason !== undefined) {
      updates.push(`cancel_reason = $${paramIndex++}`);
      values.push(cancel_reason);
    }
    if (fare_price !== undefined) {
      updates.push(`fare_price = $${paramIndex++}`);
      values.push(fare_price);
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { success: false, error: "No fields to update" },
        { status: 400 }
      );
    }

    values.push(rideId);

    const result = await executeSql(
      `UPDATE rides
       SET ${updates.join(", ")}
       WHERE ride_id = $${paramIndex}
       RETURNING *`,
      values
    );

    if (result.length === 0) {
      return NextResponse.json(
        { success: false, error: "Ride not found" },
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

// DELETE - Delete ride
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const rideId = parseInt(params.id);

    // Check if ride has rating
    const ratingCheck = await executeSql<{ id: number }>(
      `SELECT id FROM ratings WHERE ride_id = $1`,
      [rideId]
    );

    if (ratingCheck.length > 0) {
      // Delete rating first
      await executeSql(`DELETE FROM ratings WHERE ride_id = $1`, [rideId]);
    }

    const result = await executeSql(
      `DELETE FROM rides WHERE ride_id = $1 RETURNING *`,
      [rideId]
    );

    if (result.length === 0) {
      return NextResponse.json(
        { success: false, error: "Ride not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Ride deleted successfully",
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: "Internal server error", details: errorMessage },
      { status: 500 }
    );
  }
}
