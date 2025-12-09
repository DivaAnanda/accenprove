import { NextRequest, NextResponse } from "next/server";
import { verifyToken, extractTokenFromCookies } from "@/lib/auth";
import { db } from "@/drizzle/db";
import { users } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

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

    // Fetch user from database to get latest data including photo
    const user = await db
      .select({
        id: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email,
        role: users.role,
        photo: users.photo,
      })
      .from(users)
      .where(eq(users.id, payload.userId))
      .limit(1);

    if (!user.length) {
      return NextResponse.json(
        { success: false, message: "User not found", error: "USER_NOT_FOUND" },
        { status: 404 }
      );
    }

    // Return user data with photo defaulting to default-avatar if null
    return NextResponse.json(
      {
        success: true,
        data: {
          user: {
            id: user[0].id,
            firstName: user[0].firstName,
            lastName: user[0].lastName,
            email: user[0].email,
            role: user[0].role,
            photo: user[0].photo || "/default-avatar.png",
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
