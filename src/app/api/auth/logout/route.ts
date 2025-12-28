import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Create response
    const response = NextResponse.json({
      success: true,
      message: "Logout successful",
    });

    // Clear cookie
    response.cookies.delete("admin-token");

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { 
        success: false,
        error: "Internal server error", 
        details: error.message 
      },
      { status: 500 }
    );
  }
}
