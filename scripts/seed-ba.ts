/**
 * Database Seeder - Create Demo Data
 * Run: npm run db:seed
 * 
 * Creates:
 * - 5 Berita Acara (BA) with different statuses
 * - Mix of BAPB and BAPP
 * - Different vendors
 */

import { db } from "../drizzle/db";
import { beritaAcara } from "../drizzle/schema";

async function seed() {
  console.log("🌱 Seeding database...\n");

  try {
    // Check if BA already exists
    const existingBA = await db.select().from(beritaAcara);
    if (existingBA.length > 0) {
      console.log("⚠️  Database already has BA data. Skipping seed.");
      console.log(`   Current BA count: ${existingBA.length}`);
      console.log("\n💡 To re-seed, delete sqlite.db and run: npm run db:push && npm run db:seed\n");
      return;
    }

    // Get vendor user ID (assume vendor@accenprove.com exists with id=4)
    // You can change this based on your users table
    const vendorId = 4; // vendor@accenprove.com

    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
    const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
    const fiveDaysAgo = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000);

    // Create 5 BA with different statuses
    const baData = [
      {
        nomorBA: "BA/2024/12/001",
        jenisBA: "BAPB" as const,
        nomorKontrak: "KTR/2024/001",
        namaVendor: "PT. Maju Jaya Abadi",
        vendorId: vendorId,
        tanggalPemeriksaan: "2024-12-01",
        lokasiPemeriksaan: "Gudang Pusat Jakarta",
        namaPIC: "Budi Santoso",
        jabatanPIC: "Manager Procurement",
        deskripsiBarang: "Laptop Dell Latitude 5420 (i5, 8GB RAM, 256GB SSD)",
        jumlahBarang: "50 unit",
        kondisiBarang: "Baik, sesuai spesifikasi, semua tersegel",
        keterangan: "Pengiriman tepat waktu, kemasan rapi",
        signatureVendor: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
        signatureDireksi: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
        status: "APPROVED" as const,
        approvedBy: 2, // direksi@accenprove.com
        approvedAt: yesterday,
        createdAt: fiveDaysAgo,
        updatedAt: yesterday,
      },
      {
        nomorBA: "BA/2024/12/002",
        jenisBA: "BAPP" as const,
        nomorKontrak: "KTR/2024/002",
        namaVendor: "CV. Teknik Sejahtera",
        vendorId: vendorId,
        tanggalPemeriksaan: "2024-12-02",
        lokasiPemeriksaan: "Kantor Cabang Surabaya",
        namaPIC: "Siti Nurhaliza",
        jabatanPIC: "Supervisor Maintenance",
        deskripsiBarang: "Instalasi Jaringan LAN dan WiFi 6",
        jumlahBarang: "1 paket (30 titik akses)",
        kondisiBarang: "Terpasang dengan baik, sudah diuji koneksi",
        keterangan: "Pekerjaan selesai sesuai jadwal, semua titik berfungsi normal",
        signatureVendor: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
        status: "PENDING" as const,
        createdAt: threeDaysAgo,
        updatedAt: threeDaysAgo,
      },
      {
        nomorBA: "BA/2024/12/003",
        jenisBA: "BAPB" as const,
        nomorKontrak: "KTR/2024/003",
        namaVendor: "PT. Global Supplies Indonesia",
        vendorId: vendorId,
        tanggalPemeriksaan: "2024-12-03",
        lokasiPemeriksaan: "Warehouse Tangerang",
        namaPIC: "Ahmad Hidayat",
        jabatanPIC: "Kepala Gudang",
        deskripsiBarang: "Kertas HVS A4 80gsm, Tinta Printer Canon",
        jumlahBarang: "500 rim kertas, 200 cartridge tinta",
        kondisiBarang: "Kondisi baik, tidak ada kerusakan",
        keterangan: "Barang lengkap sesuai PO",
        signatureVendor: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
        status: "REJECTED" as const,
        rejectionReason: "Jumlah barang tidak sesuai dengan PO. Tercatat 490 rim kertas dan 195 cartridge. Mohon dilakukan pengecekan ulang.",
        rejectedBy: 2, // direksi@accenprove.com
        rejectedAt: yesterday,
        createdAt: threeDaysAgo,
        updatedAt: yesterday,
      },
      {
        nomorBA: "BA/2024/12/004",
        jenisBA: "BAPP" as const,
        nomorKontrak: "KTR/2024/004",
        namaVendor: "PT. Renovasi Prima",
        vendorId: vendorId,
        tanggalPemeriksaan: "2024-12-03",
        lokasiPemeriksaan: "Gedung Lantai 3 - Ruang Meeting",
        namaPIC: "Dewi Lestari",
        jabatanPIC: "Building Manager",
        deskripsiBarang: "Renovasi Ruang Meeting (cat, plafon, AC, furniture)",
        jumlahBarang: "1 paket renovasi lengkap",
        kondisiBarang: "Pekerjaan selesai 100%, hasil finishing rapi dan berkualitas",
        keterangan: "Semua pekerjaan sesuai RAB, tidak ada tambahan biaya",
        signatureVendor: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
        signatureDireksi: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
        status: "APPROVED" as const,
        approvedBy: 2,
        approvedAt: now,
        createdAt: threeDaysAgo,
        updatedAt: now,
      },
      {
        nomorBA: "BA/2024/12/005",
        jenisBA: "BAPB" as const,
        nomorKontrak: "KTR/2024/005",
        namaVendor: "CV. Elektronik Nusantara",
        vendorId: vendorId,
        tanggalPemeriksaan: "2024-12-04",
        lokasiPemeriksaan: "IT Room - Gedung Utama",
        namaPIC: "Rudi Hartono",
        jabatanPIC: "IT Manager",
        deskripsiBarang: "Server Dell PowerEdge R740 (Xeon Gold, 128GB RAM, 4TB Storage)",
        jumlahBarang: "2 unit server rack-mount",
        kondisiBarang: "Baru, tersegel pabrik, sudah diuji POST dan RAID configuration",
        keterangan: "Server siap untuk instalasi OS dan deployment",
        signatureVendor: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
        status: "PENDING" as const,
        createdAt: now,
        updatedAt: now,
      },
    ];

    // Insert all BA
    for (const ba of baData) {
      await db.insert(beritaAcara).values(ba);
      console.log(`✅ Created: ${ba.nomorBA} - ${ba.status}`);
    }

    console.log("\n✨ Seed completed successfully!");
    console.log("\n📊 Summary:");
    console.log("   - Total BA created: 5");
    console.log("   - APPROVED: 2");
    console.log("   - PENDING: 2");
    console.log("   - REJECTED: 1");
    console.log("\n💡 Login credentials (from previous seed):");
    console.log("   Vendor:  vendor@accenprove.com / password123");
    console.log("   Direksi: direksi@accenprove.com / password123");
    console.log("   DK:      dk@accenprove.com / password123");
    console.log("   Admin:   admin@accenprove.com / password123\n");

  } catch (error) {
    console.error("❌ Seed failed:", error);
    throw error;
  }
}

// Run seed
seed()
  .then(() => {
    console.log("🎉 All done!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Fatal error:", error);
    process.exit(1);
  });
