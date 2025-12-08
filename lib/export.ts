import * as XLSX from "xlsx";
import { formatDateShort } from "./utils";

/**
 * Export BA data to Excel (.xlsx)
 */
export function exportToExcel(data: any[], filename: string = "berita-acara") {
  // Prepare data for export
  const exportData = data.map((item) => ({
    "Nomor BA": item.ba.nomorBA,
    "Jenis BA": item.ba.jenisBA,
    "Nomor Kontrak": item.ba.nomorKontrak,
    "Nama Vendor": item.ba.namaVendor,
    "Email Vendor": item.vendor?.email || "-",
    "Tanggal Pemeriksaan": item.ba.tanggalPemeriksaan,
    "Lokasi Pemeriksaan": item.ba.lokasiPemeriksaan,
    "Nama PIC": item.ba.namaPIC,
    "Jabatan PIC": item.ba.jabatanPIC,
    "Deskripsi Barang": item.ba.deskripsiBarang,
    "Jumlah Barang": item.ba.jumlahBarang,
    "Kondisi Barang": item.ba.kondisiBarang,
    "Keterangan": item.ba.keterangan || "-",
    "Status": item.ba.status,
    "Alasan Penolakan": item.ba.rejectionReason || "-",
    "Tanggal Dibuat": formatDateShort(item.ba.createdAt),
  }));

  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(exportData);

  // Set column widths
  const columnWidths = [
    { wch: 20 }, // Nomor BA
    { wch: 10 }, // Jenis BA
    { wch: 20 }, // Nomor Kontrak
    { wch: 25 }, // Nama Vendor
    { wch: 30 }, // Email Vendor
    { wch: 18 }, // Tanggal Pemeriksaan
    { wch: 30 }, // Lokasi Pemeriksaan
    { wch: 25 }, // Nama PIC
    { wch: 25 }, // Jabatan PIC
    { wch: 40 }, // Deskripsi Barang
    { wch: 15 }, // Jumlah Barang
    { wch: 15 }, // Kondisi Barang
    { wch: 30 }, // Keterangan
    { wch: 12 }, // Status
    { wch: 30 }, // Alasan Penolakan
    { wch: 18 }, // Tanggal Dibuat
  ];
  worksheet["!cols"] = columnWidths;

  // Create workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Berita Acara");

  // Generate filename with timestamp
  const timestamp = new Date().toISOString().split("T")[0];
  const fullFilename = `${filename}_${timestamp}.xlsx`;

  // Download file
  XLSX.writeFile(workbook, fullFilename);
}

/**
 * Export BA data to CSV
 */
export function exportToCSV(data: any[], filename: string = "berita-acara") {
  // Prepare data for export
  const exportData = data.map((item) => ({
    "Nomor BA": item.ba.nomorBA,
    "Jenis BA": item.ba.jenisBA,
    "Nomor Kontrak": item.ba.nomorKontrak,
    "Nama Vendor": item.ba.namaVendor,
    "Email Vendor": item.vendor?.email || "-",
    "Tanggal Pemeriksaan": item.ba.tanggalPemeriksaan,
    "Lokasi Pemeriksaan": item.ba.lokasiPemeriksaan,
    "Nama PIC": item.ba.namaPIC,
    "Jabatan PIC": item.ba.jabatanPIC,
    "Deskripsi Barang": item.ba.deskripsiBarang,
    "Jumlah Barang": item.ba.jumlahBarang,
    "Kondisi Barang": item.ba.kondisiBarang,
    "Keterangan": item.ba.keterangan || "-",
    "Status": item.ba.status,
    "Alasan Penolakan": item.ba.rejectionReason || "-",
    "Tanggal Dibuat": formatDateShort(item.ba.createdAt),
  }));

  // Get headers
  const headers = Object.keys(exportData[0] || {});

  // Convert to CSV format
  const csvRows = [];

  // Add headers
  csvRows.push(headers.join(","));

  // Add data rows
  for (const row of exportData) {
    const values = headers.map((header) => {
      const value = row[header as keyof typeof row];
      // Escape quotes and wrap in quotes if contains comma or newline
      const escaped = String(value).replace(/"/g, '""');
      return /[,\n"]/.test(escaped) ? `"${escaped}"` : escaped;
    });
    csvRows.push(values.join(","));
  }

  // Create CSV string
  const csvString = csvRows.join("\n");

  // Create blob and download
  const blob = new Blob(["\uFEFF" + csvString], { type: "text/csv;charset=utf-8;" }); // BOM for Excel UTF-8
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  // Generate filename with timestamp
  const timestamp = new Date().toISOString().split("T")[0];
  const fullFilename = `${filename}_${timestamp}.csv`;

  link.setAttribute("href", url);
  link.setAttribute("download", fullFilename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Fetch all BA data for export (bypass pagination)
 */
export async function fetchAllBAForExport(filters: any): Promise<any[]> {
  try {
    // Remove pagination params
    const { page, limit, ...exportFilters } = filters;

    // Build query string
    const queryParams = new URLSearchParams();
    Object.entries(exportFilters).forEach(([key, value]) => {
      if (value && typeof value === 'string') {
        queryParams.append(key, value);
      }
    });

    // Add a special flag to indicate export mode (returns all data)
    queryParams.append("export", "true");
    queryParams.append("limit", "999999"); // Very high limit to get all results

    const response = await fetch(`/api/ba?${queryParams.toString()}`);
    const data = await response.json();

    if (data.success) {
      return data.data;
    } else {
      throw new Error(data.message || "Failed to fetch data for export");
    }
  } catch (error) {
    console.error("Error fetching data for export:", error);
    throw error;
  }
}
