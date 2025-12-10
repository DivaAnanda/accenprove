import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/drizzle/db";
import { users } from "@/drizzle/schema";
import { sendPasswordChangedEmail } from "@/lib/email";
import { eq, and, gt } from "drizzle-orm";
import { logAudit, getRequestContext } from "@/lib/audit";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, password, confirmPassword } = body;

    if (!token || !password || !confirmPassword) {
      return NextResponse.json(
        { success: false, message: "✗ Semua field harus diisi!", error: "MISSING_FIELDS" },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { success: false, message: "✗ Kata sandi tidak cocok!", error: "PASSWORD_MISMATCH" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: "✗ Kata sandi harus minimal 6 karakter!", error: "PASSWORD_TOO_SHORT" },
        { status: 400 }
      );
    }

    // Find user by reset token and check expiry
    const userResult = await db
      .select()
      .from(users)
      .where(
        and(
          eq(users.resetToken, token),
          gt(users.resetTokenExpires, new Date())
        )
      )
      .limit(1);

    if (userResult.length === 0) {
      return NextResponse.json(
        { success: false, message: "✗ Token reset tidak valid atau sudah kadaluarsa!", error: "INVALID_TOKEN" },
        { status: 400 }
      );
    }

    const user = userResult[0];

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update password and clear reset token
    await db
      .update(users)
      .set({
        password: hashedPassword,
        resetToken: null,
        resetTokenExpires: null,
        updatedAt: new Date(),
      })
      .where(eq(users.id, user.id));

    // Send confirmation email
    try {
      await sendPasswordChangedEmail(user.email, user.firstName);
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
    }

    // Log audit
    const { ipAddress, userAgent } = getRequestContext(request);
    await logAudit({
      userId: user.id,
      userEmail: user.email,
      userRole: user.role,
      action: "user.reset_password.confirm",
      category: "authentication",
      description: `Password successfully reset for ${user.email}`,
      ipAddress,
      userAgent,
      status: "success",
    });

    return NextResponse.json(
      {
        success: true,
        message: "✓ Password berhasil diubah! Silakan login dengan password baru Anda.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Confirm reset error:", error);
    return NextResponse.json(
      { success: false, message: "✗ Terjadi kesalahan server", error: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}
