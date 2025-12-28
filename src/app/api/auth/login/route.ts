import { NextRequest, NextResponse } from "next/server";
import { sign } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "uber-admin-secret-key-2024";
const ADMIN_EMAIL = "adminuber@gmail.com";
const ADMIN_PASSWORD = "Admin123!";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate credentials
    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { 
          success: false,
          message: "Invalid email or password" 
        },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = sign(
      {
        email: ADMIN_EMAIL,
        role: "admin",
        name: "Admin Uber",
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Create response with token
    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      data: {
        accessToken: token,
        user: {
          email: ADMIN_EMAIL,
          role: "admin",
          name: "Admin Uber",
        },
      },
    });

    // Set cookie for persistent login
    response.cookies.set("admin-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

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
