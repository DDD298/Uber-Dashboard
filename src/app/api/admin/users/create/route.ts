import { NextRequest, NextResponse } from "next/server";
import { executeSql } from "@/lib/db";

export const dynamic = 'force-dynamic';

// POST - Create new user (creates in Clerk first, then in database)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, password } = body;

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: "Name, email, and password are required" },
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
        first_name: name.split(" ")[0] || name,
        last_name: name.split(" ").slice(1).join(" ") || "",
        // Note: phone_number not included - Vietnam (+84) not supported by Clerk
        // Phone will be stored only in our database
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

    // Create user in database
    const result = await executeSql(
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
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: "Internal server error", details: errorMessage },
      { status: 500 }
    );
  }
}
