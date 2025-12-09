"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StatsCard from "@/components/dashboard/StatsCard";
import AlertCard from "@/components/dashboard/AlertCard";
import Link from "next/link";

// Mock user data - In production, this will come from authentication
const mockUser = {
  role: "dk" as "admin" | "direksi" | "dk" | "vendor",
  name: "Admin User",
};

// Mock data for stats
const mockStats = {
  admin: {
    totalBA: 128,
    totalVendor: 45,
    pendingApproval: 12,
    completedToday: 5,
  },
  direksi: {
    pendingApproval: 12,
    signedToday: 8,
    oldestBA: {
      id: "BA-2024-001",
      vendor: "PT. Vendor Contoh",
      daysWaiting: 7,
      createdAt: "2024-11-23",
    },
  },
  dk: {
    completedToday: 5,
    readyDownload: 18,
    thisWeek: 23,
  },
  vendor: {
    pending: 3,
    rejected: 1,
    approved: 12,
    total: 16,
  },
};

function AdminDashboard() {
  const stats = mockStats.admin;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Admin</h1>
        <p className="text-gray-600">Selamat datang, kelola sistem Berita Acara</p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Berita Acara"
          value={stats.totalBA}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
          linkText="Lihat semua BA"
          linkHref="/ba"
        />

        <StatsCard
          title="Total Vendor"
          value={stats.totalVendor}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
          linkText="Kelola vendor"
          linkHref="/users"
        />

        <StatsCard
          title="Menunggu Approval"
          value={stats.pendingApproval}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          iconBgColor="bg-orange-100"
          iconColor="text-orange-600"
          linkText="Lihat detail"
          linkHref="/ba?status=pending"
        />

        <StatsCard
          title="Selesai Hari Ini"
          value={stats.completedToday}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          iconBgColor="bg-green-100"
          iconColor="text-green-600"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Aksi Cepat</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <Link
            href="/users/create"
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-primary-600 hover:bg-primary-50 transition-colors"
          >
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-gray-900">Tambah User</p>
              <p className="text-sm text-gray-600">Buat akun baru</p>
            </div>
          </Link>

          <Link
            href="/ba"
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-primary-600 hover:bg-primary-50 transition-colors"
          >
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-gray-900">Kelola BA</p>
              <p className="text-sm text-gray-600">Lihat & hapus BA</p>
            </div>
          </Link>

          <Link
            href="/users"
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-primary-600 hover:bg-primary-50 transition-colors"
          >
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-gray-900">Kelola User</p>
              <p className="text-sm text-gray-600">Manajemen akun</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

function DireksiDashboard() {
  const stats = mockStats.direksi;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Direksi</h1>
        <p className="text-gray-600">Review dan setujui Berita Acara</p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        <StatsCard
          title="Menunggu Approval"
          value={stats.pendingApproval}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          iconBgColor="bg-orange-100"
          iconColor="text-orange-600"
          linkText="Review sekarang"
          linkHref="/ba?status=pending"
        />

        <StatsCard
          title="Ditandatangani Hari Ini"
          value={stats.signedToday}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          iconBgColor="bg-green-100"
          iconColor="text-green-600"
        />

        <StatsCard
          title="BA Terlama Menunggu"
          value={`${stats.oldestBA.daysWaiting} hari`}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          }
          iconBgColor="bg-red-100"
          iconColor="text-red-600"
          linkText="Lihat BA"
          linkHref={`/ba/${stats.oldestBA.id}`}
        />
      </div>

      {/* Alert for Oldest BA */}
      <AlertCard
        title="BA Memerlukan Perhatian"
        description={`BA ${stats.oldestBA.id} dari ${stats.oldestBA.vendor} sudah menunggu ${stats.oldestBA.daysWaiting} hari tanpa respon. Dibuat pada ${new Date(stats.oldestBA.createdAt).toLocaleDateString("id-ID")}.`}
        actionText="Review Sekarang"
        actionHref={`/ba/${stats.oldestBA.id}`}
        variant="warning"
      />

      {/* Recent Activity */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">BA Terbaru Menunggu</h2>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Link
              key={i}
              href={`/ba/BA-2024-00${i}`}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primary-600 hover:bg-primary-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900">BA-2024-00{i}</p>
                  <p className="text-sm text-gray-600">PT. Vendor Example - BAPB</p>
                </div>
              </div>
              <span className="text-sm text-gray-500">{i} hari yang lalu</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function DKDashboard() {
  const stats = mockStats.dk;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Departemen Keuangan</h1>
        <p className="text-gray-600">Download Berita Acara yang telah disetujui</p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        <StatsCard
          title="BA Selesai Hari Ini"
          value={stats.completedToday}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          iconBgColor="bg-green-100"
          iconColor="text-green-600"
          linkText="Lihat BA baru"
          linkHref="/ba?status=approved&date=today"
        />

        <StatsCard
          title="Siap Download"
          value={stats.readyDownload}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
            </svg>
          }
          iconBgColor="bg-blue-100"
          iconColor="text-blue-600"
          linkText="Download semua"
          linkHref="/ba?status=approved"
        />

        <StatsCard
          title="BA Minggu Ini"
          value={stats.thisWeek}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          }
          iconBgColor="bg-purple-100"
          iconColor="text-purple-600"
        />
      </div>

      {/* Recent Approved BA */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">BA Terbaru Disetujui</h2>
          <Link href="/ba?status=approved" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
            Lihat semua
          </Link>
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primary-600 hover:bg-primary-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900">BA-2024-00{i}</p>
                  <p className="text-sm text-gray-600">PT. Vendor Example - BAPP</p>
                  <p className="text-xs text-gray-500">Disetujui {i} jam yang lalu</p>
                </div>
              </div>
              <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function VendorDashboard() {
  const stats = mockStats.vendor;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Vendor</h1>
        <p className="text-gray-600">Kelola Berita Acara Anda</p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-6">
        <StatsCard
          title="Total BA"
          value={stats.total}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
          linkText="Lihat semua"
          linkHref="/ba/my"
        />

        <StatsCard
          title="Menunggu Approval"
          value={stats.pending}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          iconBgColor="bg-orange-100"
          iconColor="text-orange-600"
        />

        <StatsCard
          title="Ditolak"
          value={stats.rejected}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          iconBgColor="bg-red-100"
          iconColor="text-red-600"
          linkText="Lihat detail"
          linkHref="/ba/my?status=rejected"
        />

        <StatsCard
          title="Disetujui"
          value={stats.approved}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          iconBgColor="bg-green-100"
          iconColor="text-green-600"
        />
      </div>

      {/* Quick Action */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Buat Berita Acara Baru</h2>
            <p className="text-primary-100">Mulai proses pembuatan BA (BAPB atau BAPP)</p>
          </div>
          <Link
            href="/ba/create"
            className="px-6 py-3 bg-white text-primary-600 rounded-lg hover:bg-primary-50 transition-colors font-semibold flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Buat BA
          </Link>
        </div>
      </div>

      {/* Alert for Rejected BA */}
      {stats.rejected > 0 && (
        <AlertCard
          title="BA Ditolak"
          description={`Anda memiliki ${stats.rejected} BA yang ditolak. Silakan buat BA baru dengan perbaikan yang diperlukan.`}
          actionText="Lihat BA Ditolak"
          actionHref="/ba/my?status=rejected"
          variant="error"
        />
      )}

      {/* Recent BA */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">BA Terbaru</h2>
          <Link href="/ba/my" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
            Lihat semua
          </Link>
        </div>
        <div className="space-y-3">
          {[
            { id: 1, status: "approved", statusLabel: "Disetujui", color: "green" },
            { id: 2, status: "pending", statusLabel: "Menunggu", color: "orange" },
            { id: 3, status: "rejected", statusLabel: "Ditolak", color: "red" },
          ].map((ba) => (
            <Link
              key={ba.id}
              href={`/ba/${ba.id}`}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primary-600 hover:bg-primary-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 bg-${ba.color}-100 rounded-lg flex items-center justify-center text-${ba.color}-600`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900">BA-2024-00{ba.id}</p>
                  <p className="text-sm text-gray-600">BAPB - Pengiriman Material</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium bg-${ba.color}-100 text-${ba.color}-700`}>
                {ba.statusLabel}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  // In production, get user from auth context/session
  const user = mockUser;

  const renderDashboard = () => {
    switch (user.role) {
      case "admin":
        return <AdminDashboard />;
      case "direksi":
        return <DireksiDashboard />;
      case "dk":
        return <DKDashboard />;
      case "vendor":
        return <VendorDashboard />;
      default:
        return <div>Invalid role</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white flex flex-col">
      <Navbar userRole={user.role} userName={user.name} />
      
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderDashboard()}
      </main>

      <Footer />
    </div>
  );
}
