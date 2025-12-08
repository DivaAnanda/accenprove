import { NextRequest, NextResponse } from "next/server";
import { verifyToken, extractTokenFromCookies } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const cookieHeader = request.headers.get("cookie");
    const token = extractTokenFromCookies(cookieHeader);

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Not authenticated", error: "NO_TOKEN" },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);

    if (!payload) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired token", error: "INVALID_TOKEN" },
        { status: 401 }
      );
    }

    // Return user data from JWT payload
    return NextResponse.json(
      {
        success: true,
        data: {
          user: {
            id: payload.userId,
            firstName: payload.firstName,
            lastName: payload.lastName,
            email: payload.email,
            role: payload.role,
          },
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get current user error:", error);
    return NextResponse.json(
      { success: false, message: "Server error", error: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}
