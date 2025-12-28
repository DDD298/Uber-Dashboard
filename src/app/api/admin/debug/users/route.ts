import { NextResponse } from "next/server";
import { executeSql } from "@/lib/db";

// Debug endpoint to check database users
export async function GET() {
  try {
    // Get all users
    const users = await executeSql(`SELECT clerk_id, name, email FROM users LIMIT 10`);
    
    // Get total count
    const countResult = await executeSql<{ count: string }>(`SELECT COUNT(*) as count FROM users`);
    const totalUsers = parseInt(countResult[0].count);

    return NextResponse.json({
      success: true,
      totalUsers,
      users,
      message: "This is a debug endpoint. Remove in production.",
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { 
        success: false, 
        error: "Database error", 
        details: errorMessage 
      },
      { status: 500 }
    );
  }
}
