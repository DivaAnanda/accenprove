import { NextRequest, NextResponse } from "next/server";
import { db } from "@/drizzle/db";
import { users } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { success: false, message: "✗ Token verifikasi tidak valid!", error: "INVALID_TOKEN" },
        { status: 400 }
      );
    }

    // Find user by verification token
    const userResult = await db
      .select()
      .from(users)
      .where(eq(users.verificationToken, token))
      .limit(1);

    if (userResult.length === 0) {
      return NextResponse.json(
        { success: false, message: "✗ Token verifikasi tidak valid atau sudah kadaluarsa!", error: "TOKEN_NOT_FOUND" },
        { status: 400 }
      );
    }

    const user = userResult[0];

    // Check if already verified
    if (user.isVerified) {
      return NextResponse.redirect(new URL("/login?verified=already", request.url));
    }

    // Update user to verified
    await db
      .update(users)
      .set({
        isVerified: true,
        verificationToken: null,
        updatedAt: new Date(),
      })
      .where(eq(users.id, user.id));

    // Redirect to login page with success message
    return NextResponse.redirect(new URL("/login?verified=success", request.url));
  } catch (error) {
    console.error("Email verification error:", error);
    return NextResponse.json(
      { success: false, message: "✗ Terjadi kesalahan server", error: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}
