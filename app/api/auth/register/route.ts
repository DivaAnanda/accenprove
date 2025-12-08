import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { db } from "@/drizzle/db";
import { users } from "@/drizzle/schema";
import { sendVerificationEmail } from "@/lib/email";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, password, confirmPassword, role } = body;

    // Validation
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: "✗ Format email tidak valid!", error: "INVALID_EMAIL" },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      return NextResponse.json(
        { success: false, message: "✗ Email sudah terdaftar!", error: "EMAIL_EXISTS" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // Insert new user
    const newUser = await db
      .insert(users)
      .values({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role: role || "vendor", // Default to vendor
        verificationToken,
        isVerified: false,
      })
      .returning();

    // Send verification email
    try {
      await sendVerificationEmail(email, firstName, verificationToken);
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      // Continue even if email fails
    }

    return NextResponse.json(
      {
        success: true,
        message: "✓ Registrasi berhasil! Silakan cek email Anda untuk verifikasi.",
        data: { userId: newUser[0].id, email },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { success: false, message: "✗ Terjadi kesalahan server", error: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}
