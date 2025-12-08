import { NextRequest, NextResponse } from "next/server";
import { db } from "@/drizzle/db";
import { users } from "@/drizzle/schema";
import { verifyToken, extractTokenFromCookies } from "@/lib/auth";
import { eq } from "drizzle-orm";

/**
 * GET /api/users - List users (with role filtering)
 * Query params: 
 * - role: Filter by role (vendor, admin, direksi, dk)
 */
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const cookieHeader = request.headers.get("cookie");
    const token = extractTokenFromCookies(cookieHeader);
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }

    // Only admin, direksi, and dk can list users
    if (!["admin", "direksi", "dk"].includes(payload.role)) {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 }
      );
    }

    // Get query params
    const { searchParams } = new URL(request.url);
    const roleFilter = searchParams.get("role");

    // Build query
    let query = db
      .select({
        id: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email,
        role: users.role,
        isVerified: users.isVerified,
        createdAt: users.createdAt,
      })
      .from(users)
      .$dynamic();

    // Apply role filter if provided
    if (roleFilter) {
      query = query.where(eq(users.role, roleFilter as "vendor" | "admin" | "direksi" | "dk"));
    }

    const results = await query;

    return NextResponse.json({
      success: true,
      data: results,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
