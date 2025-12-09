import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/drizzle/db";
import { users, loginHistory } from "@/drizzle/schema";
import { sendNewDeviceLoginEmail } from "@/lib/email";
import { generateToken } from "@/lib/auth";
import { logAudit, getRequestContext } from "@/lib/audit";
import { eq, and, desc } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "✗ Email dan kata sandi tidak boleh kosong!", error: "MISSING_FIELDS" },
        { status: 400 }
      );
    }

    // Find user by email
    const userResult = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    const { ipAddress, userAgent } = getRequestContext(request);

    if (userResult.length === 0) {
      // Log failed login attempt
      await logAudit({
        userEmail: email,
        action: "user.login.failed",
        category: "authentication",
        description: `Failed login attempt for ${email} - user not found`,
        ipAddress,
        userAgent,
        status: "failed",
        errorMessage: "User not found",
      });
      
      return NextResponse.json(
        { success: false, message: "✗ Email atau kata sandi salah!", error: "INVALID_CREDENTIALS" },
        { status: 401 }
      );
    }

    const user = userResult[0];

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      // Log failed login attempt
      await logAudit({
        userId: user.id,
        userEmail: user.email,
        userRole: user.role,
        action: "user.login.failed",
        category: "authentication",
        description: `Failed login attempt for ${user.email} - invalid password`,
        ipAddress,
        userAgent,
        status: "failed",
        errorMessage: "Invalid password",
      });
      
      return NextResponse.json(
        { success: false, message: "✗ Email atau kata sandi salah!", error: "INVALID_CREDENTIALS" },
        { status: 401 }
      );
    }

    // Check if email is verified
    if (!user.isVerified) {
      return NextResponse.json(
        { success: false, message: "✗ Email belum diverifikasi! Silakan cek email Anda.", error: "EMAIL_NOT_VERIFIED" },
        { status: 403 }
      );
    }

    // Check if account is active
    if (!user.isActive) {
      return NextResponse.json(
        { 
          success: false, 
          message: "✗ Akun Anda telah dinonaktifkan oleh administrator. Silakan hubungi admin untuk informasi lebih lanjut.", 
          error: "ACCOUNT_DEACTIVATED" 
        },
        { status: 403 }
      );
    }

    // Get device info from userAgent
    let deviceInfo = "Unknown Device";
    if (userAgent.includes("Mobile")) {
      deviceInfo = "Mobile Device";
    } else if (userAgent.includes("Windows")) {
      deviceInfo = "Windows PC";
    } else if (userAgent.includes("Macintosh")) {
      deviceInfo = "Mac";
    } else if (userAgent.includes("Linux")) {
      deviceInfo = "Linux PC";
    }

    // Check for previous login from same device
    const previousLogin = await db
      .select()
      .from(loginHistory)
      .where(and(eq(loginHistory.userId, user.id), eq(loginHistory.deviceInfo, deviceInfo)))
      .orderBy(desc(loginHistory.loginAt))
      .limit(1);

    const isNewDevice = previousLogin.length === 0;

    // Log login history
    await db.insert(loginHistory).values({
      userId: user.id,
      ipAddress,
      userAgent,
      deviceInfo,
    });

    // Send email notification for new device
    if (isNewDevice) {
      try {
        await sendNewDeviceLoginEmail(user.email, user.firstName, deviceInfo, ipAddress);
      } catch (emailError) {
        console.error("Email sending failed:", emailError);
      }
    }

    // Generate JWT token
    const token = generateToken(user);

    // Log successful login
    await logAudit({
      userId: user.id,
      userEmail: user.email,
      userRole: user.role,
      action: "user.login",
      category: "authentication",
      description: `${user.firstName} ${user.lastName} logged in successfully`,
      ipAddress,
      userAgent,
      metadata: {
        deviceInfo,
        isNewDevice,
      },
      status: "success",
    });

    // Create response with token in httpOnly cookie
    const response = NextResponse.json(
      {
        success: true,
        message: `✓ Berhasil masuk! Selamat datang, ${user.firstName}`,
        data: {
          user: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
          },
          isNewDevice,
        },
      },
      { status: 200 }
    );

    // Set httpOnly cookie
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "✗ Terjadi kesalahan server", error: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}
