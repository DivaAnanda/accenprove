import { NextRequest, NextResponse } from "next/server";
import { db } from "@/drizzle/db";
import { beritaAcara, users } from "@/drizzle/schema";
import { eq, and, gte, lte, sql, desc, asc } from "drizzle-orm";
import { verifyToken, extractTokenFromCookies } from "@/lib/auth";

/**
 * Helper: Get WIB timezone date (UTC+7)
 * Works in any server timezone
 */
function getWIBDate(date: Date = new Date()): Date {
  const utcTime = date.getTime() + (date.getTimezoneOffset() * 60000);
  const wibTime = new Date(utcTime + (7 * 3600000)); // UTC+7
  return wibTime;
}

/**
 * Helper: Get today start/end in WIB
 */
function getTodayWIBRange() {
  const todayWIB = getWIBDate();
  
  const startWIB = new Date(todayWIB);
  startWIB.setHours(0, 0, 0, 0);
  
  const endWIB = new Date(todayWIB);
  endWIB.setHours(23, 59, 59, 999);
  
  return { start: startWIB, end: endWIB };
}

/**
 * Helper: Get this week start/end in WIB (Monday-Sunday)
 */
function getThisWeekWIBRange() {
  const todayWIB = getWIBDate();
  const dayOfWeek = todayWIB.getDay(); // 0 = Sunday, 1 = Monday, ...
  const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Adjust so Monday = 0
  
  const weekStartWIB = new Date(todayWIB);
  weekStartWIB.setDate(todayWIB.getDate() - daysFromMonday);
  weekStartWIB.setHours(0, 0, 0, 0);
  
  const weekEndWIB = new Date(weekStartWIB);
  weekEndWIB.setDate(weekStartWIB.getDate() + 6);
  weekEndWIB.setHours(23, 59, 59, 999);
  
  return { start: weekStartWIB, end: weekEndWIB };
}

/**
 * Helper: Calculate days between two dates
 */
function getDaysDifference(startDate: Date, endDate: Date = new Date()): number {
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

/**
 * GET /api/stats - Get dashboard statistics based on user role
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

    const { role, userId } = payload;
    const { start: todayStart, end: todayEnd } = getTodayWIBRange();
    const { start: weekStart, end: weekEnd } = getThisWeekWIBRange();

    // Role-based stats
    switch (role) {
      case "admin": {
        // Admin stats
        const [allBA, pendingBA, todayApproved, vendorCount] = await Promise.all([
          db.select().from(beritaAcara),
          db.select().from(beritaAcara).where(eq(beritaAcara.status, "PENDING")),
          db.select().from(beritaAcara).where(
            and(
              eq(beritaAcara.status, "APPROVED"),
              gte(beritaAcara.approvedAt, todayStart),
              lte(beritaAcara.approvedAt, todayEnd)
            )
          ),
          db.select().from(users).where(eq(users.role, "vendor")),
        ]);

        return NextResponse.json({
          success: true,
          stats: {
            totalBA: allBA.length,
            totalVendor: vendorCount.length,
            pendingApproval: pendingBA.length,
            completedToday: todayApproved.length,
          },
          recentBA: [], // Admin doesn't have recent list in current design
        });
      }

      case "direksi": {
        // Direksi stats
        const [pendingBA, todayApproved, oldestPendingBA] = await Promise.all([
          db.select().from(beritaAcara).where(eq(beritaAcara.status, "PENDING")),
          db.select().from(beritaAcara).where(
            and(
              eq(beritaAcara.status, "APPROVED"),
              eq(beritaAcara.approvedBy, userId),
              gte(beritaAcara.approvedAt, todayStart),
              lte(beritaAcara.approvedAt, todayEnd)
            )
          ),
          db.select().from(beritaAcara)
            .where(eq(beritaAcara.status, "PENDING"))
            .orderBy(asc(beritaAcara.createdAt))
            .limit(1),
        ]);

        // Get recent 3 oldest pending BA
        const recentPendingBA = await db.select()
          .from(beritaAcara)
          .where(eq(beritaAcara.status, "PENDING"))
          .orderBy(asc(beritaAcara.createdAt))
          .limit(3);

        // Calculate oldest BA waiting days
        let oldestBA = null;
        if (oldestPendingBA.length > 0) {
          const ba = oldestPendingBA[0];
          oldestBA = {
            id: ba.id,
            nomorBA: ba.nomorBA,
            namaVendor: ba.namaVendor,
            daysWaiting: getDaysDifference(new Date(ba.createdAt)),
            createdAt: ba.createdAt,
          };
        }

        // Format recent BA
        const recentBA = recentPendingBA.map((ba: typeof beritaAcara.$inferSelect) => ({
          id: ba.id,
          nomorBA: ba.nomorBA,
          jenisBA: ba.jenisBA,
          namaVendor: ba.namaVendor,
          createdAt: ba.createdAt,
          daysWaiting: getDaysDifference(new Date(ba.createdAt)),
        }));

        return NextResponse.json({
          success: true,
          stats: {
            pendingApproval: pendingBA.length,
            signedToday: todayApproved.length,
            oldestBA,
          },
          recentBA,
        });
      }

      case "dk": {
        // DK stats
        const [todayApproved, allApproved, weekApproved] = await Promise.all([
          db.select().from(beritaAcara).where(
            and(
              eq(beritaAcara.status, "APPROVED"),
              gte(beritaAcara.approvedAt, todayStart),
              lte(beritaAcara.approvedAt, todayEnd)
            )
          ),
          db.select().from(beritaAcara).where(eq(beritaAcara.status, "APPROVED")),
          db.select().from(beritaAcara).where(
            and(
              eq(beritaAcara.status, "APPROVED"),
              gte(beritaAcara.approvedAt, weekStart),
              lte(beritaAcara.approvedAt, weekEnd)
            )
          ),
        ]);

        // Get recent 3 newest approved BA
        const recentApprovedBA = await db.select()
          .from(beritaAcara)
          .where(eq(beritaAcara.status, "APPROVED"))
          .orderBy(desc(beritaAcara.approvedAt))
          .limit(3);

        // Format recent BA
        const recentBA = recentApprovedBA.map((ba: typeof beritaAcara.$inferSelect) => ({
          id: ba.id,
          nomorBA: ba.nomorBA,
          jenisBA: ba.jenisBA,
          namaVendor: ba.namaVendor,
          approvedAt: ba.approvedAt,
          hoursAgo: ba.approvedAt ? Math.floor((Date.now() - new Date(ba.approvedAt).getTime()) / (1000 * 60 * 60)) : 0,
        }));

        return NextResponse.json({
          success: true,
          stats: {
            completedToday: todayApproved.length,
            readyDownload: allApproved.length,
            thisWeek: weekApproved.length,
          },
          recentBA,
        });
      }

      case "vendor": {
        // Vendor stats - only their own BA
        const [allVendorBA, pendingBA, rejectedBA, approvedBA] = await Promise.all([
          db.select().from(beritaAcara).where(eq(beritaAcara.vendorId, userId)),
          db.select().from(beritaAcara).where(
            and(
              eq(beritaAcara.vendorId, userId),
              eq(beritaAcara.status, "PENDING")
            )
          ),
          db.select().from(beritaAcara).where(
            and(
              eq(beritaAcara.vendorId, userId),
              eq(beritaAcara.status, "REJECTED")
            )
          ),
          db.select().from(beritaAcara).where(
            and(
              eq(beritaAcara.vendorId, userId),
              eq(beritaAcara.status, "APPROVED")
            )
          ),
        ]);

        return NextResponse.json({
          success: true,
          stats: {
            total: allVendorBA.length,
            pending: pendingBA.length,
            rejected: rejectedBA.length,
            approved: approvedBA.length,
          },
          recentBA: [], // Vendor doesn't have recent list in current design
        });
      }

      default:
        return NextResponse.json(
          { success: false, message: "Invalid role" },
          { status: 403 }
        );
    }
  } catch (error: any) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
