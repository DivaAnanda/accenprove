import { NextRequest, NextResponse } from "next/server";
import { db } from "@/drizzle/db";
import { beritaAcara, users } from "@/drizzle/schema";
import { verifyToken, extractTokenFromCookies } from "@/lib/auth";
import { eq, and, desc } from "drizzle-orm";

/**
 * GET /api/ba - List Berita Acara (with role-based filtering)
 * Query params: status, vendorId
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

    // Get query params
    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get("status");
    const vendorIdFilter = searchParams.get("vendorId");

    // Build query based on role
    let query = db
      .select({
        ba: beritaAcara,
        vendor: {
          id: users.id,
          firstName: users.firstName,
          lastName: users.lastName,
          email: users.email,
        },
      })
      .from(beritaAcara)
      .leftJoin(users, eq(beritaAcara.vendorId, users.id))
      .$dynamic();

    // Role-based filtering
    if (payload.role === "vendor") {
      // Vendor can only see their own BA
      query = query.where(eq(beritaAcara.vendorId, payload.userId));
    } else if (payload.role === "dk") {
      // DK can only see approved BA
      query = query.where(eq(beritaAcara.status, "APPROVED"));
    }
    // Admin and Direksi can see all BA

    // Apply status filter if provided
    if (statusFilter) {
      const existingWhere = query.toSQL().sql.includes("WHERE");
      if (existingWhere) {
        query = query.where(
          and(
            eq(beritaAcara.status, statusFilter as "PENDING" | "APPROVED" | "REJECTED")
          )
        );
      } else {
        query = query.where(
          eq(beritaAcara.status, statusFilter as "PENDING" | "APPROVED" | "REJECTED")
        );
      }
    }

    // Apply vendor filter if provided (for admin/direksi/dk)
    if (vendorIdFilter && payload.role !== "vendor") {
      const vendorId = parseInt(vendorIdFilter);
      const existingWhere = query.toSQL().sql.includes("WHERE");
      if (existingWhere) {
        query = query.where(and(eq(beritaAcara.vendorId, vendorId)));
      } else {
        query = query.where(eq(beritaAcara.vendorId, vendorId));
      }
    }

    // Execute query with ordering
    const results = await query.orderBy(desc(beritaAcara.createdAt));

    return NextResponse.json({
      success: true,
      data: results,
    });
  } catch (error) {
    console.error("Error fetching BA:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/ba - Create new Berita Acara (Vendor only)
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

    // Check if user is vendor
    if (payload.role !== "vendor") {
      return NextResponse.json(
        { success: false, message: "Only vendors can create BA" },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await request.json();
    const {
      jenisBA,
      nomorKontrak,
      tanggalPemeriksaan,
      lokasiPemeriksaan,
      namaPIC,
      jabatanPIC,
      deskripsiBarang,
      jumlahBarang,
      kondisiBarang,
      keterangan,
      signatureVendor,
    } = body;

    // Validate required fields
    if (
      !jenisBA ||
      !nomorKontrak ||
      !tanggalPemeriksaan ||
      !lokasiPemeriksaan ||
      !namaPIC ||
      !jabatanPIC ||
      !deskripsiBarang ||
      !jumlahBarang ||
      !kondisiBarang ||
      !signatureVendor
    ) {
      return NextResponse.json(
        { success: false, message: "All required fields must be filled" },
        { status: 400 }
      );
    }

    // Generate nomor BA
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    
    // Get count of BA this month for sequence number
    const monthPrefix = `BA/${year}/${month}/`;
    const thisMonthBA = await db
      .select()
      .from(beritaAcara)
      .where(eq(beritaAcara.nomorBA, monthPrefix));
    
    // Count actual BAs with this month's prefix using LIKE
    const allBA = await db.select().from(beritaAcara);
    const thisMonthCount = allBA.filter((ba) => ba.nomorBA.startsWith(monthPrefix)).length;
    
    const sequence = String(thisMonthCount + 1).padStart(3, "0");
    const nomorBA = `${monthPrefix}${sequence}`;

    // Get vendor name from user
    const vendor = await db
      .select()
      .from(users)
      .where(eq(users.id, payload.userId))
      .limit(1);

    if (vendor.length === 0) {
      return NextResponse.json(
        { success: false, message: "Vendor not found" },
        { status: 404 }
      );
    }

    const namaVendor = `${vendor[0].firstName} ${vendor[0].lastName}`;

    // Insert BA
    const result = await db.insert(beritaAcara).values({
      nomorBA,
      jenisBA,
      nomorKontrak,
      namaVendor,
      vendorId: payload.userId,
      tanggalPemeriksaan,
      lokasiPemeriksaan,
      namaPIC,
      jabatanPIC,
      deskripsiBarang,
      jumlahBarang,
      kondisiBarang,
      keterangan: keterangan || null,
      signatureVendor,
      status: "PENDING",
    });

    // Fetch the created BA
    const createdBA = await db
      .select()
      .from(beritaAcara)
      .where(eq(beritaAcara.id, Number(result.lastInsertRowid)))
      .limit(1);

    return NextResponse.json({
      success: true,
      message: "Berita Acara created successfully",
      data: createdBA[0],
    });
  } catch (error) {
    console.error("Error creating BA:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
