import { NextRequest, NextResponse } from "next/server";
import { executeSql } from "@/lib/db";

export const dynamic = 'force-dynamic';

// POST - Create new user (creates in Clerk first, then in database)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email } = body;

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { success: false, error: "Name and email are required" },
        { status: 400 }
      );
    }

    // Generate a random secure password for Clerk (user can reset via email)
    const randomPassword = Math.random().toString(36).slice(-12) + 
                          Math.random().toString(36).slice(-12) + 
                          "A1!"; // Ensure it meets password requirements

    // Create user in Clerk
    const clerkResponse = await fetch("https://api.clerk.com/v1/users", {
      method: "POST",
      headers: {
        Authorization: `Bearer sk_test_TMhRDHV6muU3x1KuKt1xuGCHHHUuR3P84dY9PpzDVH`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email_address: [email],
        password: randomPassword,
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
