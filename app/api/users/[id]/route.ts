import { NextRequest, NextResponse } from "next/server";
import { db } from "@/drizzle/db";
import { users } from "@/drizzle/schema";
import { verifyToken, extractTokenFromCookies } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { logAudit, getRequestContext } from "@/lib/audit";

/**
 * GET /api/users/[id] - Get user by ID (admin only)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params (Next.js 15 requirement)
    const { id } = await params;
    
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

    // Fetch user by ID
    const userId = parseInt(id);
    if (isNaN(userId)) {
      return NextResponse.json(
        { success: false, message: "Invalid user ID" },
        { status: 400 }
      );
    }

    const userResult = await db
      .select({
        id: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email,
        role: users.role,
        phone: users.phone,
        address: users.address,
        photo: users.photo,
        isActive: users.isActive,
        isVerified: users.isVerified,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (userResult.length === 0) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Log audit
    const { ipAddress, userAgent } = getRequestContext(request);
    await logAudit({
      userId: payload.userId,
      userEmail: payload.email,
      userRole: payload.role,
      action: "admin.user.view",
      category: "admin",
      description: `${payload.email} viewed user details for ${userResult[0].email}`,
      targetType: "user",
      targetId: userResult[0].id,
      targetIdentifier: userResult[0].email,
      ipAddress,
      userAgent,
      metadata: {
        targetUser: {
          id: userResult[0].id,
          email: userResult[0].email,
          role: userResult[0].role,
          isActive: userResult[0].isActive,
        },
      },
      status: "success",
    });

    return NextResponse.json({
      success: true,
      data: userResult[0],
    });
  } catch (error: any) {
    console.error("GET /api/users/[id] error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/users/[id] - Update user (admin only)
 * Body:
 * - firstName: string (optional)
 * - lastName: string (optional)
 * - email: string (optional, unique)
 * - role: string (optional: admin, direksi, dk, vendor)
 * - phone: string (optional)
 * - isActive: boolean (optional)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params (Next.js 15 requirement)
    const { id } = await params;
    
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

    // Validate user ID
    const userId = parseInt(id);
    if (isNaN(userId)) {
      return NextResponse.json(
        { success: false, message: "Invalid user ID" },
        { status: 400 }
      );
    }

    // Check if target user exists
    const existingUser = await db
      .select({
        id: users.id,
        email: users.email,
        role: users.role,
        firstName: users.firstName,
        lastName: users.lastName,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (existingUser.length === 0) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { firstName, lastName, email, role, phone, isActive } = body;

    // Build update object with only provided fields
    const updateData: any = {};
    
    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (phone !== undefined) updateData.phone = phone;
    if (isActive !== undefined) updateData.isActive = isActive;

    // Validate and update email if provided
    if (email !== undefined && email !== existingUser[0].email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return NextResponse.json(
          { success: false, message: "Invalid email format" },
          { status: 400 }
        );
      }

      // Check if new email already exists
      const emailCheck = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      if (emailCheck.length > 0) {
        return NextResponse.json(
          { success: false, message: "Email already registered" },
          { status: 409 }
        );
      }

      updateData.email = email;
    }

    // Validate and update role if provided
    if (role !== undefined) {
      const validRoles = ["admin", "direksi", "dk", "vendor"];
      if (!validRoles.includes(role)) {
        return NextResponse.json(
          { success: false, message: "Invalid role" },
          { status: 400 }
        );
      }
      updateData.role = role;
    }

    // If nothing to update
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { success: false, message: "No fields to update" },
        { status: 400 }
      );
    }

    // Update user
    updateData.updatedAt = new Date();

    const updatedUser = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, userId))
      .returning({
        id: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email,
        role: users.role,
        phone: users.phone,
        photo: users.photo,
        isActive: users.isActive,
        updatedAt: users.updatedAt,
      });

    // Log audit
    const { ipAddress, userAgent } = getRequestContext(request);
    await logAudit({
      userId: payload.userId,
      userEmail: payload.email,
      userRole: payload.role,
      action: "admin.user.update",
      category: "admin",
      description: `${payload.email} updated user ${existingUser[0].email}`,
      targetType: "user",
      targetId: userId,
      targetIdentifier: updatedUser[0].email,
      ipAddress,
      userAgent,
      metadata: {
        oldData: {
          email: existingUser[0].email,
          role: existingUser[0].role,
          firstName: existingUser[0].firstName,
          lastName: existingUser[0].lastName,
        },
        newData: updateData,
      },
      status: "success",
    });

    return NextResponse.json({
      success: true,
      message: "User updated successfully",
      data: updatedUser[0],
    });
  } catch (error: any) {
    console.error("PUT /api/users/[id] error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}
