import { NextRequest, NextResponse } from "next/server";
import { db } from "@/drizzle/db";
import { auditLogs, users } from "@/drizzle/schema";
import { verifyToken, extractTokenFromCookies } from "@/lib/auth";
import { eq, like, or, and, sql, desc, gte, lte } from "drizzle-orm";

/**
 * GET /api/audit-logs - List all audit logs (admin only)
 * Query params:
 * - page: page number (default: 1)
 * - limit: items per page (default: 50)
 * - search: search by description, email, or action
 * - userId: filter by user ID
 * - category: filter by category (authentication, profile, ba, admin, system)
 * - status: filter by status (success, failed, error)
 * - dateFrom: filter by date from (ISO string)
 * - dateTo: filter by date to (ISO string)
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

    // Check if user is admin
    const currentUser = await db
      .select({ role: users.role })
      .from(users)
      .where(eq(users.id, payload.userId))
      .limit(1);

    if (currentUser.length === 0 || currentUser[0].role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Forbidden: Admin access required" },
        { status: 403 }
      );
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const search = searchParams.get("search") || "";
    const userIdFilter = searchParams.get("userId") || "";
    const categoryFilter = searchParams.get("category") || "";
    const statusFilter = searchParams.get("status") || "";
    const dateFrom = searchParams.get("dateFrom") || "";
    const dateTo = searchParams.get("dateTo") || "";

    const offset = (page - 1) * limit;

    // Build WHERE conditions
    const conditions = [];

    if (search) {
      conditions.push(
        or(
          like(auditLogs.description, `%${search}%`),
          like(auditLogs.userEmail, `%${search}%`),
          like(auditLogs.action, `%${search}%`),
          like(auditLogs.targetIdentifier, `%${search}%`)
        )
      );
    }

    if (userIdFilter) {
      const userId = parseInt(userIdFilter);
      if (!isNaN(userId)) {
        conditions.push(eq(auditLogs.userId, userId));
      }
    }

    if (categoryFilter) {
      conditions.push(eq(auditLogs.category, categoryFilter as any));
    }

    if (statusFilter) {
      conditions.push(eq(auditLogs.status, statusFilter as any));
    }

    if (dateFrom) {
      const fromDate = new Date(dateFrom);
      if (!isNaN(fromDate.getTime())) {
        conditions.push(gte(auditLogs.createdAt, fromDate));
      }
    }

    if (dateTo) {
      const toDate = new Date(dateTo);
      if (!isNaN(toDate.getTime())) {
        // Set to end of day
        toDate.setHours(23, 59, 59, 999);
        conditions.push(lte(auditLogs.createdAt, toDate));
      }
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Fetch audit logs with pagination
    const logs = await db
      .select({
        id: auditLogs.id,
        userId: auditLogs.userId,
        userEmail: auditLogs.userEmail,
        userRole: auditLogs.userRole,
        action: auditLogs.action,
        category: auditLogs.category,
        description: auditLogs.description,
        targetType: auditLogs.targetType,
        targetId: auditLogs.targetId,
        targetIdentifier: auditLogs.targetIdentifier,
        ipAddress: auditLogs.ipAddress,
        userAgent: auditLogs.userAgent,
        metadata: auditLogs.metadata,
        status: auditLogs.status,
        errorMessage: auditLogs.errorMessage,
        createdAt: auditLogs.createdAt,
      })
      .from(auditLogs)
      .where(whereClause)
      .limit(limit)
      .offset(offset)
      .orderBy(desc(auditLogs.createdAt));

    // Get total count for pagination
    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(auditLogs)
      .where(whereClause);

    const totalItems = countResult[0]?.count || 0;
    const totalPages = Math.ceil(totalItems / limit);

    return NextResponse.json({
      success: true,
      data: logs,
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
    console.error("GET /api/audit-logs error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}
