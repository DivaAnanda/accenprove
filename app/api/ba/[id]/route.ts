import { NextRequest, NextResponse } from "next/server";
import { db } from "@/drizzle/db";
import { beritaAcara, users } from "@/drizzle/schema";
import { verifyToken, extractTokenFromCookies } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { logAudit, getRequestContext } from "@/lib/audit";

/**
 * GET /api/ba/[id] - Get Berita Acara detail
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    // Await params (Next.js 15)
    const { id } = await params;
    const baId = parseInt(id);

    // Fetch BA with vendor info
    const result = await db
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
      .where(eq(beritaAcara.id, baId))
      .limit(1);

    if (result.length === 0) {
      return NextResponse.json(
        { success: false, message: "Berita Acara not found" },
        { status: 404 }
      );
    }

    const ba = result[0].ba;

    // Role-based access control
    if (payload.role === "vendor" && ba.vendorId !== payload.userId) {
      return NextResponse.json(
        { success: false, message: "You can only view your own BA" },
        { status: 403 }
      );
    }

    if (payload.role === "dk" && ba.status !== "APPROVED") {
      return NextResponse.json(
        { success: false, message: "DK can only view approved BA" },
        { status: 403 }
      );
    }

    // Log audit
    const { ipAddress, userAgent } = getRequestContext(request);
    await logAudit({
      userId: payload.userId,
      userEmail: payload.email,
      userRole: payload.role,
      action: "ba.view",
      category: "ba",
      description: `${payload.email} viewed BA ${ba.nomorBA}`,
      targetType: "berita_acara",
      targetId: ba.id,
      targetIdentifier: ba.nomorBA,
      ipAddress,
      userAgent,
      metadata: {
        nomorBA: ba.nomorBA,
        status: ba.status,
        jenisBA: ba.jenisBA,
      },
      status: "success",
    });

    return NextResponse.json({
      success: true,
      data: result[0],
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
 * PATCH /api/ba/[id] - Update BA (Edit, Approve, or Reject)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    // Await params (Next.js 15)
    const { id } = await params;
    const baId = parseInt(id);
    const body = await request.json();
    const { action } = body;

    // Fetch existing BA
    const existingBA = await db
      .select()
      .from(beritaAcara)
      .where(eq(beritaAcara.id, baId))
      .limit(1);

    if (existingBA.length === 0) {
      return NextResponse.json(
        { success: false, message: "Berita Acara not found" },
        { status: 404 }
      );
    }

    const ba = existingBA[0];

    // Handle different actions
    if (action === "approve") {
      // Only Direksi can approve
      if (payload.role !== "direksi") {
        return NextResponse.json(
          { success: false, message: "Only Direksi can approve BA" },
          { status: 403 }
        );
      }

      // BA must be PENDING
      if (ba.status !== "PENDING") {
        return NextResponse.json(
          { success: false, message: "Only PENDING BA can be approved" },
          { status: 400 }
        );
      }

      const { signatureDireksi } = body;
      if (!signatureDireksi) {
        return NextResponse.json(
          { success: false, message: "Signature is required for approval" },
          { status: 400 }
        );
      }

      // Update BA to APPROVED
      await db
        .update(beritaAcara)
        .set({
          status: "APPROVED",
          signatureDireksi,
          approvedBy: payload.userId,
          approvedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(beritaAcara.id, baId));

      // Log audit
      const { ipAddress: approveIP, userAgent: approveUA } = getRequestContext(request);
      await logAudit({
        userId: payload.userId,
        userEmail: payload.email,
        userRole: payload.role,
        action: "ba.approve",
        category: "ba",
        description: `${payload.email} approved BA ${ba.nomorBA}`,
        targetType: "berita_acara",
        targetId: ba.id,
        targetIdentifier: ba.nomorBA,
        ipAddress: approveIP,
        userAgent: approveUA,
        metadata: {
          nomorBA: ba.nomorBA,
          previousStatus: "PENDING",
          newStatus: "APPROVED",
          approvedBy: payload.userId,
          approverName: payload.email,
          approverRole: payload.role,
          jenisBA: ba.jenisBA,
          namaVendor: ba.namaVendor,
          nomorKontrak: ba.nomorKontrak,
        },
        status: "success",
      });

      return NextResponse.json({
        success: true,
        message: "Berita Acara approved successfully",
      });
    } else if (action === "reject") {
      // Only Direksi can reject
      if (payload.role !== "direksi") {
        return NextResponse.json(
          { success: false, message: "Only Direksi can reject BA" },
          { status: 403 }
        );
      }

      // BA must be PENDING
      if (ba.status !== "PENDING") {
        return NextResponse.json(
          { success: false, message: "Only PENDING BA can be rejected" },
          { status: 400 }
        );
      }

      const { rejectionReason } = body;
      if (!rejectionReason || rejectionReason.trim() === "") {
        return NextResponse.json(
          { success: false, message: "Rejection reason is required" },
          { status: 400 }
        );
      }

      // Update BA to REJECTED
      await db
        .update(beritaAcara)
        .set({
          status: "REJECTED",
          rejectionReason,
          rejectedBy: payload.userId,
          rejectedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(beritaAcara.id, baId));

      // Log audit
      const { ipAddress: rejectIP, userAgent: rejectUA } = getRequestContext(request);
      await logAudit({
        userId: payload.userId,
        userEmail: payload.email,
        userRole: payload.role,
        action: "ba.reject",
        category: "ba",
        description: `${payload.email} rejected BA ${ba.nomorBA}`,
        targetType: "berita_acara",
        targetId: ba.id,
        targetIdentifier: ba.nomorBA,
        ipAddress: rejectIP,
        userAgent: rejectUA,
        metadata: {
          nomorBA: ba.nomorBA,
          previousStatus: "PENDING",
          newStatus: "REJECTED",
          rejectedBy: payload.userId,
          rejectorName: payload.email,
          rejectorRole: payload.role,
          rejectionReason,
          jenisBA: ba.jenisBA,
          namaVendor: ba.namaVendor,
          nomorKontrak: ba.nomorKontrak,
        },
        status: "success",
      });

      return NextResponse.json({
        success: true,
        message: "Berita Acara rejected successfully",
      });
    } else if (action === "edit") {
      // Only vendor can edit their own BA
      if (payload.role !== "vendor") {
        return NextResponse.json(
          { success: false, message: "Only vendors can edit BA" },
          { status: 403 }
        );
      }

      if (ba.vendorId !== payload.userId) {
        return NextResponse.json(
          { success: false, message: "You can only edit your own BA" },
          { status: 403 }
        );
      }

      // Can only edit PENDING or REJECTED BA
      if (ba.status !== "PENDING" && ba.status !== "REJECTED") {
        return NextResponse.json(
          { success: false, message: "Can only edit PENDING or REJECTED BA" },
          { status: 400 }
        );
      }

      // Extract fields to update
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

      // Build update object (only update provided fields)
      const updateData: any = {
        updatedAt: new Date(),
      };

      // If BA was REJECTED and being edited, reset to PENDING
      // Keep rejection history for audit trail (don't clear rejectedAt, rejectedBy, rejectionReason)
      if (ba.status === "REJECTED") {
        updateData.status = "PENDING";
      }

      if (jenisBA) updateData.jenisBA = jenisBA;
      if (nomorKontrak) updateData.nomorKontrak = nomorKontrak;
      if (tanggalPemeriksaan) updateData.tanggalPemeriksaan = tanggalPemeriksaan;
      if (lokasiPemeriksaan) updateData.lokasiPemeriksaan = lokasiPemeriksaan;
      if (namaPIC) updateData.namaPIC = namaPIC;
      if (jabatanPIC) updateData.jabatanPIC = jabatanPIC;
      if (deskripsiBarang) updateData.deskripsiBarang = deskripsiBarang;
      if (jumlahBarang) updateData.jumlahBarang = jumlahBarang;
      if (kondisiBarang) updateData.kondisiBarang = kondisiBarang;
      if (keterangan !== undefined) updateData.keterangan = keterangan;
      if (signatureVendor) updateData.signatureVendor = signatureVendor;

      await db
        .update(beritaAcara)
        .set(updateData)
        .where(eq(beritaAcara.id, baId));

      // Log audit
      const { ipAddress: editIP, userAgent: editUA } = getRequestContext(request);
      await logAudit({
        userId: payload.userId,
        userEmail: payload.email,
        userRole: payload.role,
        action: "ba.update",
        category: "ba",
        description: `${payload.email} updated BA ${ba.nomorBA}`,
        targetType: "berita_acara",
        targetId: ba.id,
        targetIdentifier: ba.nomorBA,
        ipAddress: editIP,
        userAgent: editUA,
        metadata: {
          nomorBA: ba.nomorBA,
          previousStatus: ba.status,
          newStatus: updateData.status || ba.status,
          updatedFields: Object.keys(updateData).filter(key => key !== 'updatedAt'),
          jenisBA: updateData.jenisBA || ba.jenisBA,
          nomorKontrak: updateData.nomorKontrak || ba.nomorKontrak,
        },
        status: "success",
      });

      return NextResponse.json({
        success: true,
        message: "Berita Acara updated successfully",
      });
    } else {
      return NextResponse.json(
        { success: false, message: "Invalid action" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error updating BA:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/ba/[id] - Delete BA (Admin only)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    // Only admin can delete
    if (payload.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Only admin can delete BA" },
        { status: 403 }
      );
    }

    // Await params (Next.js 15)
    const { id } = await params;
    const baId = parseInt(id);

    // Check if BA exists
    const existingBA = await db
      .select()
      .from(beritaAcara)
      .where(eq(beritaAcara.id, baId))
      .limit(1);

    if (existingBA.length === 0) {
      return NextResponse.json(
        { success: false, message: "Berita Acara not found" },
        { status: 404 }
      );
    }

    // Delete BA
    await db.delete(beritaAcara).where(eq(beritaAcara.id, baId));

    return NextResponse.json({
      success: true,
      message: "Berita Acara deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting BA:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
