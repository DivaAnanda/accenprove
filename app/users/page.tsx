"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: "admin" | "direksi" | "dk" | "vendor";
  phone: string | null;
  photo: string | null;
  isActive: boolean;
  createdAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export default function UsersListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    totalItems: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  // Filters
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [roleFilter, setRoleFilter] = useState(searchParams.get("role") || "");
  const [statusFilter, setStatusFilter] = useState(searchParams.get("status") || "");

  // Fetch users
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const page = searchParams.get("page") || "1";
      const params = new URLSearchParams({
        page,
        limit: "20",
        ...(search && { search }),
        ...(roleFilter && { role: roleFilter }),
        ...(statusFilter && { status: statusFilter }),
      });

      const response = await fetch(`/api/users?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setUsers(data.data);
        setPagination(data.pagination);
      } else {
        console.error("Failed to fetch users:", data.message);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  }, [searchParams, search, roleFilter, statusFilter]);

  // Auto-search - instant update on filter changes
  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (roleFilter) params.set("role", roleFilter);
    if (statusFilter) params.set("status", statusFilter);
    params.set("page", "1");
    router.push(`/users?${params.toString()}`);
  }, [search, roleFilter, statusFilter, router]);

  // Fetch users when params change
  useEffect(() => {
    if (user?.role === "admin") {
      fetchUsers();
    }
  }, [searchParams, user, fetchUsers]);

  useEffect(() => {
    if (user?.role !== "admin") {
      router.push("/dashboard");
      return;
    }
  }, [user, router]);

  // Handle reset filters
  const handleResetFilters = () => {
    setSearch("");
    setRoleFilter("");
    setStatusFilter("");
    router.push("/users");
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`/users?${params.toString()}`);
  };

  // Toggle user status
  const handleToggleStatus = async (userId: number, currentStatus: boolean) => {
    const loadingToast = toast.loading(`${!currentStatus ? "Mengaktifkan" : "Menonaktifkan"} user...`);
    
    try {
      const response = await fetch(`/api/users/${userId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      const data = await response.json();

      if (data.success) {
        // Refresh list
        fetchUsers();
        toast.success(`User berhasil ${!currentStatus ? "diaktifkan" : "dinonaktifkan"}`, { id: loadingToast });
      } else {
        toast.error(data.message, { id: loadingToast });
      }
    } catch (error) {
      console.error("Error toggling user status:", error);
      toast.error("Gagal mengubah status user", { id: loadingToast });
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin": return "bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border-purple-300";
      case "direksi": return "bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 border-blue-300";
      case "dk": return "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-300";
      case "vendor": return "bg-gradient-to-r from-orange-100 to-amber-100 text-orange-800 border-orange-300";
      default: return "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-gray-300";
    }
  };

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500">Redirecting...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
      <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white flex flex-col">
      <Navbar />
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Daftar User</h1>
            <p className="text-gray-600 mt-1">Kelola semua pengguna sistem</p>
          </div>
          <Link
            href="/users/create"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl hover:scale-105 transition-transform font-semibold shadow-md"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Tambah User
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Filter & Pencarian</h3>
            </div>

            {/* Reset Button - Top Right */}
            <button
              onClick={handleResetFilters}
              className="group inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-gray-700 hover:text-red-600 bg-gray-100 hover:bg-red-50 rounded-xl transition-all hover:shadow-md hover:scale-105"
            >
              <svg className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Reset Filter
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Pencarian
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Nama atau email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all hover:border-primary-300 bg-white shadow-sm"
                />
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Role
              </label>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all hover:border-primary-300 bg-white shadow-sm appearance-none cursor-pointer"
              >
                <option value="">Semua Role</option>
                <option value="admin">Admin</option>
                <option value="direksi">Direksi</option>
                <option value="dk">DK</option>
                <option value="vendor">Vendor</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all hover:border-primary-300 bg-white shadow-sm appearance-none cursor-pointer"
              >
                <option value="">Semua Status</option>
                <option value="active">Aktif</option>
                <option value="inactive">Nonaktif</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats Summary */}
        {!loading && (
          <div className="mb-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-md border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-2xl font-bold text-white">{pagination.totalItems || 0}</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Total User</h3>
                  <p className="text-sm text-gray-600">
                    {search || roleFilter || statusFilter ? "Hasil filter" : "Semua user terdaftar"}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600">Halaman {pagination.page || 1} dari {pagination.totalPages || 1}</div>
              </div>
            </div>
          </div>
        )}

        {/* Users Table */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="relative inline-block">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-200 border-t-primary-600 mx-auto mb-4"></div>
                <div className="absolute inset-0 rounded-full bg-primary-100/20 blur-xl"></div>
              </div>
              <p className="text-gray-700 font-medium text-lg">Memuat data user...</p>
              <p className="text-gray-500 text-sm mt-2">Harap tunggu sebentar</p>
            </div>
          ) : users.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <p className="text-xl font-bold text-gray-900 mb-2">Tidak Ada User</p>
              <p className="text-gray-600 mb-4">Belum ada user yang terdaftar atau sesuai dengan filter</p>
              <Link
                href="/users/create"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl hover:scale-105 transition-transform font-semibold shadow-md"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Tambah User Pertama
              </Link>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">User</th>
                      <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Aksi</th>
                    </tr>
                  </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className="group hover:bg-primary-50/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          {user.photo ? (
                            <img
                              src={user.photo}
                              alt={`${user.firstName} ${user.lastName}`}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-semibold">
                              {user.firstName.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                            <p className="text-sm text-gray-500">{user.phone || "No phone"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-left">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold border shadow-sm ${getRoleBadgeColor(user.role)}`}>
                          {user.role.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {user.role === "admin" ? (
                          <span className="text-sm text-gray-500">—</span>
                        ) : (
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={user.isActive}
                              onChange={() => handleToggleStatus(user.id, user.isActive)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                          </label>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                        <Link
                          href={`/users/${user.id}`}
                          className="inline-flex items-center gap-1.5 text-primary-600 hover:text-primary-800 hover:underline transition-colors font-medium"
                        >
                          Lihat Detail
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {users.map((user) => (
                <div key={user.id} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-5 border border-gray-200 hover:-translate-y-1 transition-all">
                  {/* User Info Header */}
                  <div className="flex items-center gap-3 mb-4">
                    {user.photo ? (
                      <img
                        src={user.photo}
                        alt={`${user.firstName} ${user.lastName}`}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-semibold text-lg">
                        {user.firstName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-gray-900">{user.firstName} {user.lastName}</h3>
                      <p className="text-xs text-gray-500">{user.phone || "No phone"}</p>
                    </div>
                    <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold border shadow-sm ${getRoleBadgeColor(user.role)}`}>
                      {user.role.toUpperCase()}
                    </span>
                  </div>

                  {/* User Details */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-sm">
                      <span className="text-gray-500 w-20 font-medium">Email:</span>
                      <span className="text-gray-900 truncate">{user.email}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <span className="text-gray-500 w-20 font-medium">Status:</span>
                      {user.role === "admin" ? (
                        <span className="text-sm text-gray-500">—</span>
                      ) : (
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={user.isActive}
                            onChange={() => handleToggleStatus(user.id, user.isActive)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                        </label>
                      )}
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="pt-4 border-t border-gray-200">
                    <Link
                      href={`/users/${user.id}`}
                      className="flex items-center justify-center gap-2 w-full text-primary-600 hover:text-primary-800 hover:underline transition-colors font-medium text-sm"
                    >
                      Lihat Detail
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </>
          )}

          {/* Pagination */}
          {!loading && users.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {(pagination.page - 1) * pagination.limit + 1} to {Math.min(pagination.page * pagination.limit, pagination.totalItems)} of {pagination.totalItems} users
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={!pagination.hasPrevPage}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={!pagination.hasNextPage}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
