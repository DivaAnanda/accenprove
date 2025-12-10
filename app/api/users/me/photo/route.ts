import { NextRequest, NextResponse } from "next/server";
import { db } from "@/drizzle/db";
import { users } from "@/drizzle/schema";
import { verifyToken, extractTokenFromCookies } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { writeFile, unlink } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import { logAudit, getRequestContext } from "@/lib/audit";

/**
 * POST /api/users/me/photo - Upload profile photo
 * Accepts multipart/form-data with 'photo' field
 * Validates file type (JPG/PNG) and size (max 2MB)
 * Deletes old photo if exists
 */
export async function POST(request: NextRequest) {
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

    // Parse form data
    const formData = await request.formData();
    const file = formData.get("photo") as File;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file uploaded" },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: "Only JPG and PNG files are allowed" },
        { status: 400 }
      );
    }

    // Validate file size (max 2MB)
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, message: "File size must not exceed 2MB" },
        { status: 400 }
      );
    }

    // Get current user to check for existing photo
    const currentUser = await db
      .select({ photo: users.photo })
      .from(users)
      .where(eq(users.id, payload.userId))
      .limit(1);

    // Delete old photo if exists (not default avatar)
    if (currentUser[0]?.photo && currentUser[0].photo !== "/default-avatar.png") {
      const oldPhotoPath = join(process.cwd(), "public", currentUser[0].photo);
      if (existsSync(oldPhotoPath)) {
        try {
          await unlink(oldPhotoPath);
        } catch (error) {
          console.error("Error deleting old photo:", error);
          // Continue even if delete fails
        }
      }
    }

    // Generate unique filename
    const timestamp = Date.now();
    const extension = file.name.split(".").pop();
    const filename = `user-${payload.userId}-${timestamp}.${extension}`;
    const photoPath = `/uploads/profiles/${filename}`;
    const fullPath = join(process.cwd(), "public", photoPath);

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(fullPath, buffer);

    // Update database with new photo path
    await db
      .update(users)
      .set({
        photo: photoPath,
        updatedAt: new Date(),
      })
      .where(eq(users.id, payload.userId));

    // Log audit
    const { ipAddress, userAgent } = getRequestContext(request);
    await logAudit({
      userId: payload.userId,
      userEmail: payload.email,
      userRole: payload.role,
      action: "user.profile.photo.upload",
      category: "profile",
      description: `${payload.email} uploaded a new profile photo`,
      ipAddress,
      userAgent,
      metadata: {
        filename,
        photoPath,
        fileSize: file.size,
        fileType: file.type,
      },
      status: "success",
    });

    return NextResponse.json({
      success: true,
      message: "Photo uploaded successfully",
      data: {
        photo: photoPath,
      },
    });
  } catch (error) {
    console.error("Error uploading photo:", error);
    return NextResponse.json(
      { success: false, message: "Failed to upload photo" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/users/me/photo - Delete profile photo (reset to default)
 */
export async function DELETE(request: NextRequest) {
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

    // Get current user photo
    const currentUser = await db
      .select({ photo: users.photo })
      .from(users)
      .where(eq(users.id, payload.userId))
      .limit(1);

    // Delete photo file if exists (not default avatar)
    if (currentUser[0]?.photo && currentUser[0].photo !== "/default-avatar.png") {
      const photoPath = join(process.cwd(), "public", currentUser[0].photo);
      if (existsSync(photoPath)) {
        try {
          await unlink(photoPath);
        } catch (error) {
          console.error("Error deleting photo:", error);
        }
      }
    }

    // Reset to default avatar
    await db
      .update(users)
      .set({
        photo: "/default-avatar.png",
        updatedAt: new Date(),
      })
      .where(eq(users.id, payload.userId));

    // Log audit
    const { ipAddress, userAgent } = getRequestContext(request);
    await logAudit({
      userId: payload.userId,
      userEmail: payload.email,
      userRole: payload.role,
      action: "user.profile.photo.delete",
      category: "profile",
      description: `${payload.email} deleted their profile photo`,
      ipAddress,
      userAgent,
      metadata: {
        previousPhoto: currentUser[0]?.photo,
      },
      status: "success",
    });

    return NextResponse.json({
      success: true,
      message: "Photo deleted successfully",
      data: {
        photo: "/default-avatar.png",
      },
    });
  } catch (error) {
    console.error("Error deleting photo:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete photo" },
      { status: 500 }
    );
  }
}
