"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  nama: string;
  email: string;
  role: "Vendor" | "Direksi" | "Departemen Keuangan";
  status: "Aktif" | "Nonaktif";
  tanggalDaftar: string;
  lastLogin: string;
}

export default function UserManagement() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<string>("Semua");
  const [filterStatus, setFilterStatus] = useState<string>("Semua");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  // Simulasi data users (nanti diganti dengan data dari API)
  const [users, setUsers] = useState<User[]>([
    {
      id: "USR001",
      nama: "Budi Santoso",
      email: "budi@vendortech.com",
      role: "Vendor",
      status: "Aktif",
      tanggalDaftar: "15 Oktober 2024",
      lastLogin: "30 November 2024, 14:30",
    },
    {
      id: "USR002",
      nama: "Siti Nurhaliza",
      email: "siti@vendorindo.com",
      role: "Vendor",
      status: "Aktif",
      tanggalDaftar: "20 Oktober 2024",
      lastLogin: "29 November 2024, 10:15",
    },
    {
      id: "USR003",
      nama: "Ahmad Direktur",
      email: "ahmad.dir@accenture.com",
      role: "Direksi",
      status: "Aktif",
      tanggalDaftar: "5 September 2024",
      lastLogin: "30 November 2024, 09:00",
    },
    {
      id: "USR004",
      nama: "Rina Keuangan",
      email: "rina.finance@accenture.com",
      role: "Departemen Keuangan",
      status: "Aktif",
      tanggalDaftar: "8 September 2024",
      lastLogin: "30 November 2024, 11:20",
    },
    {
      id: "USR005",
      nama: "Joko Vendor",
      email: "joko@supplier.com",
      role: "Vendor",
      status: "Nonaktif",
      tanggalDaftar: "12 Agustus 2024",
      lastLogin: "15 November 2024, 16:45",
    },
  ]);

  // Toggle status user
  const handleToggleStatus = (userId: string) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId
          ? {
              ...user,
              status: user.status === "Aktif" ? "Nonaktif" : "Aktif",
            }
          : user
      )
    );
  };

  // Hapus user
  const handleDeleteUser = (user: User) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (userToDelete) {
      setUsers((prevUsers) =>
        prevUsers.filter((u) => u.id !== userToDelete.id)
      );
      setShowDeleteModal(false);
      setUserToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setUserToDelete(null);
  };

  // Filter users
  const filteredUsers = users.filter((user) => {
    const matchSearch =
      user.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchRole = filterRole === "Semua" || user.role === filterRole;
    const matchStatus =
      filterStatus === "Semua" || user.status === filterStatus;

    return matchSearch && matchRole && matchStatus;
  });

  // Statistics
  const stats = {
    total: users.length,
    aktif: users.filter((u) => u.status === "Aktif").length,
    nonaktif: users.filter((u) => u.status === "Nonaktif").length,
    vendor: users.filter((u) => u.role === "Vendor").length,
    direksi: users.filter((u) => u.role === "Direksi").length,
    keuangan: users.filter((u) => u.role === "Departemen Keuangan").length,
  };

  const getRoleBadgeColor = (role: string) => {
    const colors = {
      Vendor: "bg-blue-100 text-blue-800 border-blue-300",
      Direksi: "bg-purple-100 text-purple-800 border-purple-300",
      "Departemen Keuangan": "bg-green-100 text-green-800 border-green-300",
    };
    return colors[role as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-teal-700">Accenprove</h1>
              <p className="text-sm text-gray-600 mt-1">Admin Dashboard</p>
            </div>
            <button
              onClick={() => router.push("/dashboard")}
              className="text-sm text-gray-600 hover:text-gray-900 font-medium"
            >
              ← Kembali ke Dashboard
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Manajemen Pengguna
          </h2>
          <p className="text-base text-gray-600">
            Kelola akun pengguna sistem Accenprove
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-teal-600">
            <p className="text-sm font-semibold text-gray-600 mb-1">
              Total User
            </p>
            <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-600">
            <p className="text-sm font-semibold text-gray-600 mb-1">Aktif</p>
            <p className="text-3xl font-bold text-green-700">{stats.aktif}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-red-600">
            <p className="text-sm font-semibold text-gray-600 mb-1">Nonaktif</p>
            <p className="text-3xl font-bold text-red-700">{stats.nonaktif}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-600">
            <p className="text-sm font-semibold text-gray-600 mb-1">Vendor</p>
            <p className="text-3xl font-bold text-blue-700">{stats.vendor}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-purple-600">
            <p className="text-sm font-semibold text-gray-600 mb-1">Direksi</p>
            <p className="text-3xl font-bold text-purple-700">
              {stats.direksi}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-600">
            <p className="text-sm font-semibold text-gray-600 mb-1">Keuangan</p>
            <p className="text-3xl font-bold text-green-700">
              {stats.keuangan}
            </p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="md:col-span-1">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Cari User
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Nama, email, atau ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-gray-900"
                />
                <svg
                  className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Filter Role */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Filter Role
              </label>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white text-gray-900"
              >
                <option value="Semua">Semua Role</option>
                <option value="Vendor">Vendor</option>
                <option value="Direksi">Direksi</option>
                <option value="Departemen Keuangan">Departemen Keuangan</option>
              </select>
            </div>

            {/* Filter Status */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Filter Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white text-gray-900"
              >
                <option value="Semua">Semua Status</option>
                <option value="Aktif">Aktif</option>
                <option value="Nonaktif">Nonaktif</option>
              </select>
            </div>
          </div>

          {/* Results Info */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Menampilkan{" "}
              <span className="font-bold">{filteredUsers.length}</span> dari{" "}
              <span className="font-bold">{users.length}</span> user
            </p>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-teal-700">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                    ID User
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                    Nama & Email
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                    Last Login
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-white uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <svg
                          className="w-16 h-16 text-gray-400 mb-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                          />
                        </svg>
                        <p className="text-lg font-semibold text-gray-900 mb-1">
                          Tidak Ada User Ditemukan
                        </p>
                        <p className="text-sm text-gray-600">
                          Coba ubah filter atau kata kunci pencarian
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm font-bold text-gray-900">
                          {user.id}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-base font-bold text-gray-900">
                          {user.nama}
                        </p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Terdaftar: {user.tanggalDaftar}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-3 py-1 text-xs font-bold rounded-full border ${getRoleBadgeColor(
                            user.role
                          )}`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {/* Toggle Switch */}
                          <button
                            onClick={() => handleToggleStatus(user.id)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${
                              user.status === "Aktif"
                                ? "bg-green-600"
                                : "bg-gray-300"
                            }`}
                            role="switch"
                            aria-checked={user.status === "Aktif"}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                user.status === "Aktif"
                                  ? "translate-x-6"
                                  : "translate-x-1"
                              }`}
                            />
                          </button>
                          <span
                            className={`ml-3 text-sm font-bold ${
                              user.status === "Aktif"
                                ? "text-green-700"
                                : "text-gray-500"
                            }`}
                          >
                            {user.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900">
                          {user.lastLogin}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => handleDeleteUser(user)}
                          className="inline-flex items-center px-3 py-2 bg-red-600 text-white text-sm font-bold rounded-lg hover:bg-red-700 transition-colors"
                        >
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && userToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex flex-col items-center text-center">
              {/* Warning Icon */}
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-10 h-10 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Konfirmasi Hapus User
              </h3>

              {/* User Info */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4 w-full">
                <p className="text-base font-bold text-gray-900 mb-1">
                  {userToDelete.nama}
                </p>
                <p className="text-sm text-gray-600">{userToDelete.email}</p>
                <p className="text-sm text-gray-600">ID: {userToDelete.id}</p>
              </div>

              {/* Message */}
              <p className="text-base text-gray-700 mb-6 leading-relaxed">
                Apakah Anda yakin ingin menghapus user ini? Tindakan ini{" "}
                <span className="font-bold text-red-600">
                  tidak dapat dibatalkan
                </span>
                .
              </p>

              {/* Buttons */}
              <div className="flex gap-3 w-full">
                <button
                  onClick={cancelDelete}
                  className="flex-1 bg-gray-300 text-gray-800 py-3 rounded-lg text-base font-bold hover:bg-gray-400 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 bg-red-600 text-white py-3 rounded-lg text-base font-bold hover:bg-red-700 transition-colors"
                >
                  Ya, Hapus
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
