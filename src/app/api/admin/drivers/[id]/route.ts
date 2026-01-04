import { NextRequest, NextResponse } from "next/server";
import { executeSql } from "@/lib/db";

export const dynamic = 'force-dynamic';

// GET - Get single driver with details
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const driverId = parseInt(id);

    const drivers = await executeSql(
      `SELECT 
        d.*,
        (SELECT COUNT(*) FROM rides WHERE driver_id = d.id) as total_rides,
        (SELECT COUNT(*) FROM rides WHERE driver_id = d.id AND ride_status = 'completed') as completed_rides,
        (SELECT COUNT(*) FROM rides WHERE driver_id = d.id AND ride_status = 'cancelled') as cancelled_rides,
        (SELECT SUM(fare_price) FROM rides WHERE driver_id = d.id AND payment_status = 'paid') as total_earnings,
        (SELECT COUNT(*) FROM driver_warnings WHERE driver_id = d.id) as total_warnings,
        (SELECT COUNT(*) FROM driver_warnings WHERE driver_id = d.id AND resolved_at IS NULL) as active_warnings
      FROM drivers d
      WHERE id = $1`,
      [driverId]
    );

    if (drivers.length === 0) {
      return NextResponse.json(
        { success: false, error: "Driver not found" },
        { status: 404 }
      );
    }

    // Get recent rides
    const recentRides = await executeSql(
      `SELECT 
        r.*,
        json_build_object(
          'clerk_id', u.clerk_id,
          'name', u.name,
          'email', u.email
        ) as user
      FROM rides r
      INNER JOIN users u ON r.user_id = u.clerk_id
      WHERE r.driver_id = $1
      ORDER BY r.created_at DESC
      LIMIT 10`,
      [driverId]
    );

    // Get recent ratings
    const recentRatings = await executeSql(
      `SELECT 
        rat.*,
        json_build_object(
          'clerk_id', u.clerk_id,
          'name', u.name
        ) as user,
        json_build_object(
          'ride_id', r.ride_id,
          'origin_address', r.origin_address,
          'destination_address', r.destination_address
        ) as ride
      FROM ratings rat
      INNER JOIN users u ON rat.user_id = u.clerk_id
      INNER JOIN rides r ON rat.ride_id = r.ride_id
      WHERE rat.driver_id = $1
      ORDER BY rat.created_at DESC
      LIMIT 10`,
      [driverId]
    );

    const driver = drivers[0] as any;
    
    return NextResponse.json({
      success: true,
      data: {
        ...driver,
        recentRides,
        recentRatings,
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

// PATCH - Update driver
export async function PATCH(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  console.log("PATCH Request received for ID:", id);
  try {
    const driverId = parseInt(id);
    console.log("Parsed Driver ID:", driverId);
    
    const body = await _request.json();
    console.log("Request Body:", body);
    
    const {
      first_name,
      last_name,
      email,
      phone,
      profile_image_url,
      car_image_url,
      car_seats,
      vehicle_type,
      status,
    } = body;

    // Build update fields
    const updates: string[] = [];
    const values: (string | number)[] = [];
    let paramIndex = 1;

    if (first_name !== undefined) {
      updates.push(`first_name = $${paramIndex++}`);
      values.push(first_name);
    }
    if (last_name !== undefined) {
      updates.push(`last_name = $${paramIndex++}`);
      values.push(last_name);
    }
    if (email !== undefined) {
      updates.push(`email = $${paramIndex++}`);
      values.push(email);
    }
    if (phone !== undefined) {
      updates.push(`phone = $${paramIndex++}`);
      values.push(phone);
    }
    if (profile_image_url !== undefined) {
      updates.push(`profile_image_url = $${paramIndex++}`);
      values.push(profile_image_url);
    }
    if (car_image_url !== undefined) {
      updates.push(`car_image_url = $${paramIndex++}`);
      values.push(car_image_url);
    }
    if (car_seats !== undefined) {
      updates.push(`car_seats = $${paramIndex++}`);
      values.push(car_seats);
    }
    if (vehicle_type !== undefined) {
      updates.push(`vehicle_type = $${paramIndex++}`);
      values.push(vehicle_type);
    }
    if (status !== undefined) {
      updates.push(`status = $${paramIndex++}`);
      values.push(status);
    }
    if (body.license_number !== undefined) {
      updates.push(`license_number = $${paramIndex++}`);
      values.push(body.license_number);
    }
    if (body.approval_status !== undefined) {
      updates.push(`approval_status = $${paramIndex++}`);
      values.push(body.approval_status);
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { success: false, error: "No fields to update" },
        { status: 400 }
      );
    }

    values.push(driverId);

    console.log(`Executing Update: UPDATE drivers SET ${updates.join(", ")} WHERE id = $${paramIndex} RETURNING *`);
    console.log("Values:", values);

    const result = await executeSql(
      `UPDATE drivers
       SET ${updates.join(", ")}
       WHERE id = $${paramIndex}
       RETURNING *`,
      values
    );
    
    console.log("Update Result:", result);

    if (result.length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Driver not found",
          debug: {
            receivedId: id,
            parsedId: driverId,
            paramIndex,
            updatesLength: updates.length,
            valuesLength: values.length,
            resultLength: result.length
          }
        },
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

// DELETE - Delete driver
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const driverId = parseInt(id);

    // Check if driver has any rides
    const ridesCount = await executeSql<{ count: string }>(
      `SELECT COUNT(*) as count FROM rides WHERE driver_id = $1`,
      [driverId]
    );

    if (parseInt(ridesCount[0].count) > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Cannot delete driver with existing rides",
          details: "Please archive or reassign rides first",
        },
        { status: 400 }
      );
    }

    const result = await executeSql(
      `DELETE FROM drivers WHERE id = $1 RETURNING *`,
      [driverId]
    );

    if (result.length === 0) {
      return NextResponse.json(
        { success: false, error: "Driver not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Driver deleted successfully",
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: "Internal server error", details: errorMessage },
      { status: 500 }
    );
  }
}
