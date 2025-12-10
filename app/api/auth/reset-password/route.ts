import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/drizzle/db";
import { users } from "@/drizzle/schema";
import { sendResetPasswordEmail } from "@/lib/email";
import { eq } from "drizzle-orm";
import { logAudit, getRequestContext } from "@/lib/audit";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, message: "✗ Email harus diisi!", error: "MISSING_EMAIL" },
        { status: 400 }
      );
    }

    // Find user by email
    const userResult = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    // Always return success even if email not found (security best practice)
    if (userResult.length === 0) {
      return NextResponse.json(
        {
          success: true,
          message: "✓ Jika email terdaftar, link reset password akan dikirim ke email Anda.",
        },
        { status: 200 }
      );
    }

    const user = userResult[0];

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Update user with reset token
    await db
      .update(users)
      .set({
        resetToken,
        resetTokenExpires,
        updatedAt: new Date(),
      })
      .where(eq(users.id, user.id));

    // Send reset email
    try {
      await sendResetPasswordEmail(user.email, user.firstName, resetToken);
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
    }

    // Log audit
    const { ipAddress, userAgent } = getRequestContext(request);
    await logAudit({
      userId: user.id,
      userEmail: user.email,
      userRole: user.role,
      action: "user.reset_password.request",
      category: "authentication",
      description: `Password reset requested for ${user.email}`,
      ipAddress,
      userAgent,
      status: "success",
    });

    return NextResponse.json(
      {
        success: true,
        message: "✓ Jika email terdaftar, link reset password akan dikirim ke email Anda.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { success: false, message: "✗ Terjadi kesalahan server", error: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}
