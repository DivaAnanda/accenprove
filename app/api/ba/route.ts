import { NextRequest, NextResponse } from "next/server";
import { db } from "@/drizzle/db";
import { beritaAcara, users } from "@/drizzle/schema";
import { verifyToken, extractTokenFromCookies } from "@/lib/auth";
import { eq, and, desc, asc, or, like, gte, lte, sql } from "drizzle-orm";

/**
 * GET /api/ba - List Berita Acara (with role-based filtering, pagination, search, and sorting)
 * Query params: 
 * - status: Filter by status (PENDING, APPROVED, REJECTED)
 * - vendorId: Filter by vendor ID
 * - search: Search across multiple fields (nomor BA, vendor, kontrak, deskripsi, PIC, etc)
 * - startDate: Filter by start date (YYYY-MM-DD)
 * - endDate: Filter by end date (YYYY-MM-DD)
 * - sortBy: Sort field (createdAt, status, namaVendor)
 * - sortOrder: Sort order (asc, desc)
 * - page: Page number (default: 1)
 * - limit: Items per page (default: 10)
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
    const searchQuery = searchParams.get("search");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    // Build WHERE conditions
    const conditions = [];

    // Role-based filtering
    if (payload.role === "vendor") {
      // Vendor can only see their own BA
      conditions.push(eq(beritaAcara.vendorId, payload.userId));
    }
    // Admin, Direksi, and DK can see all BA

    // Status filter
    if (statusFilter) {
      conditions.push(eq(beritaAcara.status, statusFilter as "PENDING" | "APPROVED" | "REJECTED"));
    }

    // Vendor filter (for admin/direksi/dk)
    if (vendorIdFilter && payload.role !== "vendor") {
      conditions.push(eq(beritaAcara.vendorId, parseInt(vendorIdFilter)));
    }

    // Search filter (flexible search across multiple fields)
    if (searchQuery) {
      const searchPattern = `%${searchQuery}%`;
      conditions.push(
        or(
          like(beritaAcara.nomorBA, searchPattern),
          like(beritaAcara.namaVendor, searchPattern),
          like(beritaAcara.nomorKontrak, searchPattern),
          like(beritaAcara.deskripsiBarang, searchPattern),
          like(beritaAcara.namaPIC, searchPattern),
          like(beritaAcara.jabatanPIC, searchPattern),
          like(beritaAcara.lokasiPemeriksaan, searchPattern),
          like(beritaAcara.keterangan, searchPattern)
        )
      );
    }

    // Date range filter (filter by createdAt)
    if (startDate) {
      const startTimestamp = Math.floor(new Date(startDate).getTime() / 1000);
      conditions.push(gte(beritaAcara.createdAt, sql`${startTimestamp}`));
    }
    if (endDate) {
      // Add 1 day to include the entire end date
      const endTimestamp = Math.floor(new Date(endDate).getTime() / 1000) + 86400;
      conditions.push(lte(beritaAcara.createdAt, sql`${endTimestamp}`));
    }

    // Build base query with joins
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

    // Apply WHERE conditions
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    // Apply sorting
    const orderByColumn = 
      sortBy === "status" ? beritaAcara.status :
      sortBy === "namaVendor" ? beritaAcara.namaVendor :
      beritaAcara.createdAt;
    
    query = sortOrder === "asc" 
      ? query.orderBy(asc(orderByColumn))
      : query.orderBy(desc(orderByColumn));

    // Get total count (before pagination)
    const allResults = await query;
    const totalItems = allResults.length;
    const totalPages = Math.ceil(totalItems / limit);

    // Apply pagination
    const offset = (page - 1) * limit;
    const paginatedResults = allResults.slice(offset, offset + limit);

    return NextResponse.json({
      success: true,
      data: paginatedResults,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
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
