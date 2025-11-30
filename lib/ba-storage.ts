/**
 * LocalStorage Utility for Berita Acara Management
 * Phase 1: Client-side storage before database implementation
 */

export interface BAData {
  id: number;
  nomorBA: string;
  jenisBA: "BAPB" | "BAPP";
  nomorKontrak: string;
  namaVendor: string;
  tanggalPemeriksaan: string;
  lokasiPemeriksaan: string;
  namaPIC: string;
  jabatanPIC: string;
  deskripsiBarang: string;
  jumlahBarang: string;
  kondisiBarang: string;
  keterangan: string;
  signatureVendor: string;
  signatureDireksi?: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  approvedAt?: string;
  rejectedAt?: string;
  rejectionReason?: string;
}

const BA_STORAGE_KEY = "beritaAcara";

/**
 * Get all BA entries from localStorage
 */
export function getAllBA(): BAData[] {
  if (typeof window === "undefined") return [];
  
  try {
    const data = localStorage.getItem(BA_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error reading BA from localStorage:", error);
    return [];
  }
}

/**
 * Get a specific BA by ID
 */
export function getBAById(id: number | string): BAData | null {
  const allBA = getAllBA();
  const found = allBA.find((ba) => ba.id.toString() === id.toString());
  return found || null;
}

/**
 * Save a new BA entry
 */
export function saveBA(baData: BAData): boolean {
  try {
    const allBA = getAllBA();
    allBA.push(baData);
    localStorage.setItem(BA_STORAGE_KEY, JSON.stringify(allBA));
    return true;
  } catch (error) {
    console.error("Error saving BA to localStorage:", error);
    return false;
  }
}

/**
 * Update an existing BA entry
 */
export function updateBA(id: number | string, updates: Partial<BAData>): boolean {
  try {
    const allBA = getAllBA();
    const index = allBA.findIndex((ba) => ba.id.toString() === id.toString());
    
    if (index === -1) {
      console.error("BA not found with id:", id);
      return false;
    }
    
    allBA[index] = { ...allBA[index], ...updates };
    localStorage.setItem(BA_STORAGE_KEY, JSON.stringify(allBA));
    return true;
  } catch (error) {
    console.error("Error updating BA in localStorage:", error);
    return false;
  }
}

/**
 * Update BA status (approve/reject)
 */
export function updateBAStatus(
  id: number | string,
  status: "APPROVED" | "REJECTED",
  signature?: string,
  rejectionReason?: string
): boolean {
  const updates: Partial<BAData> = {
    status,
  };

  if (status === "APPROVED" && signature) {
    updates.signatureDireksi = signature;
    updates.approvedAt = new Date().toISOString();
  }

  if (status === "REJECTED") {
    updates.rejectedAt = new Date().toISOString();
    if (rejectionReason) {
      updates.rejectionReason = rejectionReason;
    }
  }

  return updateBA(id, updates);
}

/**
 * Delete a BA entry (Admin only)
 */
export function deleteBA(id: number | string): boolean {
  try {
    const allBA = getAllBA();
    const filtered = allBA.filter((ba) => ba.id.toString() !== id.toString());
    
    if (filtered.length === allBA.length) {
      console.error("BA not found with id:", id);
      return false;
    }
    
    localStorage.setItem(BA_STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error("Error deleting BA from localStorage:", error);
    return false;
  }
}

/**
 * Get BA entries filtered by status
 */
export function getBAByStatus(status: "PENDING" | "APPROVED" | "REJECTED"): BAData[] {
  const allBA = getAllBA();
  return allBA.filter((ba) => ba.status === status);
}

/**
 * Get BA entries for a specific vendor
 */
export function getBAByVendor(vendorName: string): BAData[] {
  const allBA = getAllBA();
  return allBA.filter((ba) => ba.namaVendor === vendorName);
}

/**
 * Get statistics for dashboard
 */
export function getBAStats() {
  const allBA = getAllBA();
  
  return {
    total: allBA.length,
    pending: allBA.filter((ba) => ba.status === "PENDING").length,
    approved: allBA.filter((ba) => ba.status === "APPROVED").length,
    rejected: allBA.filter((ba) => ba.status === "REJECTED").length,
  };
}

/**
 * Get BA entries created today
 */
export function getBACreatedToday(): BAData[] {
  const allBA = getAllBA();
  const today = new Date().toDateString();
  
  return allBA.filter((ba) => {
    const baDate = new Date(ba.createdAt).toDateString();
    return baDate === today;
  });
}

/**
 * Get BA entries approved today
 */
export function getBAApprovedToday(): BAData[] {
  const allBA = getAllBA();
  const today = new Date().toDateString();
  
  return allBA.filter((ba) => {
    if (!ba.approvedAt) return false;
    const approvedDate = new Date(ba.approvedAt).toDateString();
    return approvedDate === today;
  });
}

/**
 * Get oldest pending BA
 */
export function getOldestPendingBA(): BAData | null {
  const pendingBA = getBAByStatus("PENDING");
  
  if (pendingBA.length === 0) return null;
  
  return pendingBA.reduce((oldest, current) => {
    return new Date(current.createdAt) < new Date(oldest.createdAt) ? current : oldest;
  });
}

/**
 * Clear all BA entries (use with caution!)
 */
export function clearAllBA(): boolean {
  try {
    localStorage.removeItem(BA_STORAGE_KEY);
    return true;
  } catch (error) {
    console.error("Error clearing BA from localStorage:", error);
    return false;
  }
}

/**
 * Generate next BA number
 * Format: BA/YYYY/MM/XXX
 */
export function generateBANumber(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  
  const allBA = getAllBA();
  
  // Filter BA from current month
  const currentMonthBA = allBA.filter((ba) => {
    const baYear = ba.nomorBA.split("/")[1];
    const baMonth = ba.nomorBA.split("/")[2];
    return baYear === String(year) && baMonth === month;
  });
  
  const nextNumber = String(currentMonthBA.length + 1).padStart(3, "0");
  
  return `BA/${year}/${month}/${nextNumber}`;
}
