import { NextRequest, NextResponse } from "next/server";
import { verifyToken, extractTokenFromCookies } from "@/lib/auth";
import { logAudit, getRequestContext } from "@/lib/audit";

export async function POST(request: NextRequest) {
  // Extract user context before deleting token
  const cookieHeader = request.headers.get("cookie");
  const token = extractTokenFromCookies(cookieHeader);
  const { ipAddress, userAgent } = getRequestContext(request);
  
  let userId: number | null = null;
  let userEmail: string | null = null;
  let userRole: string | null = null;
  
  if (token) {
    const payload = verifyToken(token);
    if (payload) {
      userId = payload.userId;
      userEmail = payload.email;
      userRole = payload.role;
    }
  }

  const response = NextResponse.json(
    { success: true, message: "✓ Berhasil logout" },
    { status: 200 }
  );

  // Clear auth cookie
  response.cookies.delete("auth-token");

  // Log audit
  if (userId) {
    await logAudit({
      userId,
      userEmail: userEmail!,
      userRole: userRole!,
      action: "user.logout",
      category: "authentication",
      description: `${userEmail} logged out`,
      ipAddress,
      userAgent,
      status: "success",
    });
  }

  return response;
}
