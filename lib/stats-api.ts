/**
 * Dashboard Statistics API Client
 * Fetches real-time stats from database based on user role
 */

// Admin Stats
export interface AdminStats {
  totalBA: number;
  totalVendor: number;
  pendingApproval: number;
  completedToday: number;
}

// Direksi Stats
export interface OldestBA {
  id: number;
  nomorBA: string;
  namaVendor: string;
  daysWaiting: number;
  createdAt: Date;
}

export interface DireksiStats {
  pendingApproval: number;
  signedToday: number;
  oldestBA: OldestBA | null;
}

export interface DireksiRecentBA {
  id: number;
  nomorBA: string;
  jenisBA: "BAPB" | "BAPP";
  namaVendor: string;
  createdAt: Date;
  daysWaiting: number;
}

// DK Stats
export interface DKStats {
  completedToday: number;
  readyDownload: number;
  thisWeek: number;
}

export interface DKRecentBA {
  id: number;
  nomorBA: string;
  jenisBA: "BAPB" | "BAPP";
  namaVendor: string;
  approvedAt: Date | null;
  hoursAgo: number;
}

// Vendor Stats
export interface VendorStats {
  total: number;
  pending: number;
  rejected: number;
  approved: number;
}

// Generic response
export interface StatsResponse<T, R = any> {
  success: boolean;
  stats: T;
  recentBA: R[];
  message?: string;
}

/**
 * Fetch dashboard statistics
 * Returns different stats based on authenticated user's role
 */
export async function getDashboardStats(): Promise<
  | StatsResponse<AdminStats, never>
  | StatsResponse<DireksiStats, DireksiRecentBA>
  | StatsResponse<DKStats, DKRecentBA>
  | StatsResponse<VendorStats, never>
> {
  const response = await fetch("/api/stats", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch dashboard stats");
  }

  const data = await response.json();
  return data;
}
