/**
 * BA API Client
 * Replaces lib/ba-storage.ts localStorage implementation
 */

export interface BAData {
  id: number;
  nomorBA: string;
  jenisBA: "BAPB" | "BAPP";
  nomorKontrak: string;
  namaVendor: string;
  vendorId: number;
  tanggalPemeriksaan: string;
  lokasiPemeriksaan: string;
  namaPIC: string;
  jabatanPIC: string;
  deskripsiBarang: string;
  jumlahBarang: string;
  kondisiBarang: string;
  keterangan: string | null;
  signatureVendor: string;
  signatureDireksi: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED";
  rejectionReason: string | null;
  approvedBy: number | null;
  rejectedBy: number | null;
  createdAt: number;
  approvedAt: number | null;
  rejectedAt: number | null;
  updatedAt: number;
}

export interface CreateBAInput {
  jenisBA: "BAPB" | "BAPP";
  nomorKontrak: string;
  tanggalPemeriksaan: string;
  lokasiPemeriksaan: string;
  namaPIC: string;
  jabatanPIC: string;
  deskripsiBarang: string;
  jumlahBarang: string;
  kondisiBarang: string;
  keterangan?: string;
  signatureVendor: string;
}

export interface UpdateBAInput {
  jenisBA?: "BAPB" | "BAPP";
  nomorKontrak?: string;
  tanggalPemeriksaan?: string;
  lokasiPemeriksaan?: string;
  namaPIC?: string;
  jabatanPIC?: string;
  deskripsiBarang?: string;
  jumlahBarang?: string;
  kondisiBarang?: string;
  keterangan?: string;
  signatureVendor?: string;
}

/**
 * Create new Berita Acara (Vendor only)
 */
export async function createBA(data: CreateBAInput): Promise<BAData> {
  const response = await fetch("/api/ba", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.message || "Failed to create BA");
  }

  return result.data;
}

/**
 * Get all Berita Acara (with role-based filtering)
 * @param status - Filter by status (optional)
 * @param vendorId - Filter by vendor ID (optional, admin/direksi/dk only)
 */
export async function getAllBA(
  status?: "PENDING" | "APPROVED" | "REJECTED",
  vendorId?: number
): Promise<BAData[]> {
  const params = new URLSearchParams();
  if (status) params.append("status", status);
  if (vendorId) params.append("vendorId", vendorId.toString());

  const response = await fetch(`/api/ba?${params.toString()}`);
  const result = await response.json();

  if (!result.success) {
    throw new Error(result.message || "Failed to fetch BA");
  }

  return result.data.map((item: any) => item.ba);
}

/**
 * Get Berita Acara by ID
 */
export async function getBAById(id: number): Promise<BAData> {
  const response = await fetch(`/api/ba/${id}`);
  const result = await response.json();

  if (!result.success) {
    throw new Error(result.message || "Failed to fetch BA");
  }

  return result.data.ba;
}

/**
 * Update Berita Acara (Edit by vendor)
 */
export async function updateBA(id: number, data: UpdateBAInput): Promise<void> {
  const response = await fetch(`/api/ba/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      action: "edit",
      ...data,
    }),
  });

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.message || "Failed to update BA");
  }
}

/**
 * Approve Berita Acara (Direksi only)
 */
export async function approveBA(id: number, signatureDireksi: string): Promise<void> {
  const response = await fetch(`/api/ba/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      action: "approve",
      signatureDireksi,
    }),
  });

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.message || "Failed to approve BA");
  }
}

/**
 * Reject Berita Acara (Direksi only)
 */
export async function rejectBA(id: number, rejectionReason: string): Promise<void> {
  const response = await fetch(`/api/ba/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      action: "reject",
      rejectionReason,
    }),
  });

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.message || "Failed to reject BA");
  }
}

/**
 * Delete Berita Acara (Admin only)
 */
export async function deleteBA(id: number): Promise<void> {
  const response = await fetch(`/api/ba/${id}`, {
    method: "DELETE",
  });

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.message || "Failed to delete BA");
  }
}
