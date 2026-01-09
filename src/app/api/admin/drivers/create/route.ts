import { NextRequest, NextResponse } from "next/server";
import { executeSql } from "@/lib/db";

export const dynamic = 'force-dynamic';

// POST - Create new driver (creates in Clerk first, then in database)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      first_name, 
      last_name, 
      email, 
      password,
      phone,
      license_number,
      vehicle_type,
      car_seats
    } = body;

    // Validate required fields
    if (!first_name || !last_name || !email || !password) {
      return NextResponse.json(
        { success: false, error: "First name, last name, email, and password are required" },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 8) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    // Create user in Clerk
    const clerkResponse = await fetch("https://api.clerk.com/v1/users", {
      method: "POST",
      headers: {
        Authorization: `Bearer sk_test_TMhRDHV6muU3x1KuKt1xuGCHHHUuR3P84dY9PpzDVH`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email_address: [email],
        password: password,
        first_name: first_name,
        last_name: last_name,
      }),
    });

    if (!clerkResponse.ok) {
      const errorData = await clerkResponse.json();
      return NextResponse.json(
        {
          success: false,
          error: "Failed to create user in Clerk",
          details: errorData,
        },
        { status: clerkResponse.status }
      );
    }

    const clerkUser = await clerkResponse.json();
    const clerk_id = clerkUser.id;

    // Create driver in database
    const result = await executeSql(
      `INSERT INTO drivers (
        clerk_id, first_name, last_name, email, phone,
        license_number, vehicle_type, car_seats,
        status, approval_status
      )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'offline', 'pending')
       RETURNING *`,
      [
        clerk_id,
        first_name,
        last_name,
        email,
        phone || null,
        license_number || null,
        vehicle_type || null,
        car_seats ? parseInt(car_seats.toString()) : 4
      ]
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
