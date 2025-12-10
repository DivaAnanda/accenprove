import { NextRequest, NextResponse } from "next/server";
import { db } from "@/drizzle/db";
import { users } from "@/drizzle/schema";
import { verifyToken, extractTokenFromCookies } from "@/lib/auth";
import { eq, like, or, and, sql, desc } from "drizzle-orm";
import { logAudit, getRequestContext } from "@/lib/audit";

/**
 * GET /api/users - List all users (admin only with pagination & filters)
 * Query params:
 * - page: page number (default: 1)
 * - limit: items per page (default: 20)
 * - search: search by name or email
 * - role: filter by role (admin, direksi, dk, vendor)
 * - status: filter by status (active, inactive)
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

    // Check if user is admin (for /users page) or direksi/dk (for vendor filter in BA)
    const currentUser = await db
      .select({ role: users.role })
      .from(users)
      .where(eq(users.id, payload.userId))
      .limit(1);

    if (currentUser.length === 0) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const userRole = currentUser[0].role;

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search") || "";
    const roleFilter = searchParams.get("role") || "";
    const statusFilter = searchParams.get("status") || "";

    // For non-admin users (direksi, dk), only return vendor list (for BA filters)
    if (userRole !== "admin") {
      const vendorList = await db
        .select({
          id: users.id,
          firstName: users.firstName,
          lastName: users.lastName,
          email: users.email,
          role: users.role,
        })
        .from(users)
        .where(eq(users.role, "vendor"));

      return NextResponse.json({
        success: true,
        data: vendorList,
      });
    }

    // Admin-only functionality: full user list with pagination
    const offset = (page - 1) * limit;

    // Build WHERE conditions
    const conditions = [];

    if (search) {
      conditions.push(
        or(
          like(users.firstName, `%${search}%`),
          like(users.lastName, `%${search}%`),
          like(users.email, `%${search}%`)
        )
      );
    }

    if (roleFilter) {
      conditions.push(eq(users.role, roleFilter as any));
    }

    if (statusFilter === "active") {
      conditions.push(eq(users.isActive, true));
    } else if (statusFilter === "inactive") {
      conditions.push(eq(users.isActive, false));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Fetch users with pagination
    const userList = await db
      .select({
        id: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email,
        role: users.role,
        phone: users.phone,
        photo: users.photo,
        isActive: users.isActive,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(whereClause)
      .limit(limit)
      .offset(offset)
      .orderBy(desc(users.createdAt));

    // Get total count for pagination
    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(whereClause);

    const totalItems = countResult[0]?.count || 0;
    const totalPages = Math.ceil(totalItems / limit);

    // Log audit
    const { ipAddress, userAgent } = getRequestContext(request);
    await logAudit({
      userId: payload.userId,
      userEmail: payload.email,
      userRole: payload.role,
      action: "admin.users.list",
      category: "admin",
      description: `${payload.email} viewed user list`,
      ipAddress,
      userAgent,
      metadata: {
        filters: {
          search,
          role: roleFilter,
          status: statusFilter,
        },
        pagination: { page, limit },
        resultCount: userList.length,
      },
      status: "success",
    });

    return NextResponse.json({
      success: true,
      data: userList,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error: any) {
    console.error("GET /api/users error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}
