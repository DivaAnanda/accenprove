"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import BAListFilters, { FilterValues } from "@/components/ba/BAListFilters";
import BAListTable from "@/components/ba/BAListTable";
import BAPagination from "@/components/ba/BAPagination";
import { buildQueryString } from "@/lib/utils";
import { exportToExcel, exportToCSV, fetchAllBAForExport } from "@/lib/export";
import Link from "next/link";

interface BAItem {
  ba: {
    id: number;
    nomorBA: string;
    jenisBA: "BAPB" | "BAPP";
    namaVendor: string;
    status: "PENDING" | "APPROVED" | "REJECTED";
    createdAt: Date;
    nomorKontrak: string;
    deskripsiBarang: string;
  };
  vendor: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  } | null;
}

interface PaginationInfo {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export default function MyBAListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  
  const [baList, setBaList] = useState<BAItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [exporting, setExporting] = useState(false);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 10,
    totalItems: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });
  // Initialize filters from URL params
  const [filters, setFilters] = useState<FilterValues>(() => ({
    status: searchParams.get("status") || "",
    vendorId: "", // Will be auto-set from user token in API
    search: searchParams.get("search") || "",
    startDate: searchParams.get("startDate") || "",
    endDate: searchParams.get("endDate") || "",
    sortBy: searchParams.get("sortBy") || "createdAt",
    sortOrder: searchParams.get("sortOrder") || "desc",
  }));

  // Fetch BA list
  const fetchBAList = useCallback(async (page: number = 1) => {
    try {
      setLoading(true);
      setError("");

      const queryParams = {
        status: filters.status,
        search: filters.search,
        startDate: filters.startDate,
        endDate: filters.endDate,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
        page: page.toString(),
        limit: "10",
      };

      const queryString = buildQueryString(queryParams);
      const response = await fetch(`/api/ba${queryString}`);
      const data = await response.json();

      if (data.success) {
        setBaList(data.data);
        setPagination(data.pagination);
      } else {
        setError(data.message || "Gagal memuat data BA");
      }
    } catch (err) {
      setError("Terjadi kesalahan saat memuat data");
      console.error("Error fetching BA list:", err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Initial fetch
  useEffect(() => {
    if (!authLoading && user) {
      if (user.role !== "vendor") {
        router.push("/ba");
      } else {
        fetchBAList(1);
      }
    }
  }, [user, authLoading, router, fetchBAList]);

  // Refetch when filters change
  useEffect(() => {
    if (user && user.role === "vendor") {
      fetchBAList(1);
    }
  }, [filters, user, fetchBAList]);

  // Close export menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (exportMenuOpen) {
        const target = event.target as HTMLElement;
        if (!target.closest(".relative")) {
          setExportMenuOpen(false);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [exportMenuOpen]);

  const handleFilterChange = (newFilters: FilterValues) => {
    setFilters(newFilters);
    
    // Update URL with new filters
    const queryString = buildQueryString({
      status: newFilters.status,
      search: newFilters.search,
      startDate: newFilters.startDate,
      endDate: newFilters.endDate,
      sortBy: newFilters.sortBy,
      sortOrder: newFilters.sortOrder,
      page: "1", // Reset to page 1 on filter change
    });
    router.push(`/ba/my${queryString}`, { scroll: false });
  };

  const handlePageChange = (newPage: number) => {
    fetchBAList(newPage);
    
    // Update URL with new page
    const queryString = buildQueryString({
      status: filters.status,
      search: filters.search,
      startDate: filters.startDate,
      endDate: filters.endDate,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
      page: newPage.toString(),
    });
    router.push(`/ba/my${queryString}`, { scroll: false });
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleExport = async (format: "excel" | "csv") => {
    try {
      setExporting(true);
      setExportMenuOpen(false);
      
      // Fetch all BA data with current filters
      const exportFilters = {
        status: filters.status,
        search: filters.search,
        startDate: filters.startDate,
        endDate: filters.endDate,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
      };
      const allData = await fetchAllBAForExport(exportFilters);
      
      if (allData.length === 0) {
        alert("Tidak ada data untuk di-export");
        return;
      }
      
      // Export based on format
      if (format === "excel") {
        exportToExcel(allData, "ba-saya");
      } else {
        exportToCSV(allData, "ba-saya");
      }
    } catch (error) {
      console.error("Export error:", error);
      alert("Gagal export data. Silakan coba lagi.");
    } finally {
      setExporting(false);
    }
  };

  // Show loading state while auth is checking
  if (authLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Memuat...</p>
          </div>
        </div>
      </>
    );
  }

  // Redirect message for non-vendors
  if (user?.role !== "vendor") {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600">Mengalihkan...</p>
          </div>
        </div>
      </>
    );
  }

  // Check authorization
  if (!user) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Akses Ditolak</h2>
            <p className="text-gray-600">Silakan login terlebih dahulu.</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">BA Saya</h1>
              <p className="mt-2 text-gray-600">
                Kelola Berita Acara yang Anda buat
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Export Button */}
              <div className="relative">
                <button
                  onClick={() => setExportMenuOpen(!exportMenuOpen)}
                  disabled={exporting || loading || baList.length === 0}
                  className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                >
                  {exporting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Exporting...
                    </>
                  ) : (
                    <>
                      📥 Export
                      <svg className="ml-2 -mr-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </>
                  )}
                </button>
                
                {/* Export Dropdown Menu */}
                {exportMenuOpen && !exporting && (
                  <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                    <div className="py-1" role="menu">
                      <button
                        onClick={() => handleExport("excel")}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                        role="menuitem"
                      >
                        <span className="mr-3">📊</span>
                        <div>
                          <div className="font-medium">Export to Excel</div>
                          <div className="text-xs text-gray-500">{pagination.totalItems} items</div>
                        </div>
                      </button>
                      <button
                        onClick={() => handleExport("csv")}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                        role="menuitem"
                      >
                        <span className="mr-3">📄</span>
                        <div>
                          <div className="font-medium">Export to CSV</div>
                          <div className="text-xs text-gray-500">{pagination.totalItems} items</div>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Create BA Button */}
              <Link
                href="/ba/create"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 transition-colors shadow-sm"
              >
                + Buat BA Baru
              </Link>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Filters (no vendor filter for vendor role) */}
          <BAListFilters
            onFilterChange={handleFilterChange}
            showVendorFilter={false}
            role={user.role}
          />

          {/* Stats Summary */}
          {!loading && (
            <div className="mb-6 bg-white rounded-lg shadow-sm p-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div className="text-center sm:text-left">
                  <span className="text-gray-600">Total BA: </span>
                  <strong className="text-gray-900">{pagination.totalItems}</strong>
                </div>
                <div className="text-center sm:text-left">
                  <span className="text-gray-600">Pending: </span>
                  <strong className="text-yellow-600">
                    {baList.filter((item) => item.ba.status === "PENDING").length}
                  </strong>
                </div>
                <div className="text-center sm:text-left">
                  <span className="text-gray-600">Approved: </span>
                  <strong className="text-green-600">
                    {baList.filter((item) => item.ba.status === "APPROVED").length}
                  </strong>
                </div>
              </div>
            </div>
          )}

          {/* Empty State for New Vendors */}
          {!loading && baList.length === 0 && !filters.status && !filters.search && (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <div className="max-w-md mx-auto">
                <div className="text-6xl mb-4">📄</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Belum Ada Berita Acara
                </h3>
                <p className="text-gray-600 mb-6">
                  Mulai buat Berita Acara pertama Anda untuk mendokumentasikan proses bisnis.
                </p>
                <Link
                  href="/ba/create"
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 transition-colors shadow-sm"
                >
                  Buat BA Sekarang
                </Link>
              </div>
            </div>
          )}

          {/* BA List Table */}
          {(loading || baList.length > 0) && (
            <BAListTable data={baList} loading={loading} />
          )}

          {/* Pagination */}
          {!loading && baList.length > 0 && (
            <div className="mt-6">
              <BAPagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                totalItems={pagination.totalItems}
                onPageChange={handlePageChange}
                hasNextPage={pagination.hasNextPage}
                hasPrevPage={pagination.hasPrevPage}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
