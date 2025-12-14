import { NextRequest, NextResponse } from "next/server";
import { db } from "@/drizzle/db";
import { beritaAcara } from "@/drizzle/schema";
import { gte, lte, sql } from "drizzle-orm";
import { verifyToken, extractTokenFromCookies } from "@/lib/auth";

/**
 * GET /api/stats/chart - Get historical BA data for charts
 * Returns BA counts per month for the last 6 months
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

    // Get current date and 6 months ago
    const now = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(now.getMonth() - 5); // -5 because current month counts as 1
    sixMonthsAgo.setDate(1); // Start from 1st of the month
    sixMonthsAgo.setHours(0, 0, 0, 0);

    // Fetch all BA from last 6 months
    const baRecords = await db
      .select({
        createdAt: beritaAcara.createdAt,
        status: beritaAcara.status,
      })
      .from(beritaAcara)
      .where(gte(beritaAcara.createdAt, sixMonthsAgo));

    // Group by month
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthCounts: Record<string, { total: number; approved: number; pending: number; rejected: number }> = {};

    // Initialize last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(now.getMonth() - i);
      const monthKey = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
      monthCounts[monthKey] = { total: 0, approved: 0, pending: 0, rejected: 0 };
    }

    // Count BA per month
    baRecords.forEach((ba) => {
      const date = new Date(ba.createdAt);
      const monthKey = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
      
      if (monthCounts[monthKey]) {
        monthCounts[monthKey].total++;
        if (ba.status === "APPROVED") {
          monthCounts[monthKey].approved++;
        } else if (ba.status === "PENDING") {
          monthCounts[monthKey].pending++;
        } else if (ba.status === "REJECTED") {
          monthCounts[monthKey].rejected++;
        }
      }
    });

    // Convert to array format for charts
    const chartData = Object.entries(monthCounts).map(([month, counts]) => ({
      month: month.split(" ")[0], // Just month name (e.g., "Jan")
      total: counts.total,
      approved: counts.approved,
      pending: counts.pending,
      rejected: counts.rejected,
    }));

    // Status distribution (overall)
    const statusData = [
      {
        name: "Pending",
        value: baRecords.filter(ba => ba.status === "PENDING").length,
        color: "#f59e0b",
      },
      {
        name: "Approved",
        value: baRecords.filter(ba => ba.status === "APPROVED").length,
        color: "#10b981",
      },
      {
        name: "Rejected",
        value: baRecords.filter(ba => ba.status === "REJECTED").length,
        color: "#ef4444",
      },
    ];

    return NextResponse.json({
      success: true,
      data: {
        chartData,
        statusData,
      },
    });
  } catch (error: any) {
    console.error("Error fetching chart data:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch chart data" },
      { status: 500 }
    );
  }
}
