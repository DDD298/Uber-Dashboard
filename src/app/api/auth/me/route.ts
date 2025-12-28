import { NextRequest, NextResponse } from "next/server";
import { verify } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "uber-admin-secret-key-2024";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("admin-token")?.value;

    if (!token) {
      return NextResponse.json(
        { 
          success: false,
          message: "Not authenticated" 
        },
        { status: 401 }
      );
    }

    // Verify token
    const decoded = verify(token, JWT_SECRET) as any;

    return NextResponse.json({
      success: true,
      data: {
        email: decoded.email,
        role: decoded.role,
        name: decoded.name,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { 
        success: false,
        error: "Invalid token", 
        details: error.message 
      },
      { status: 401 }
    );
  }
}
