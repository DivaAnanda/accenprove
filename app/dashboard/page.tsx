"use client";

import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { EnhancedStatsCard } from "@/components/dashboard/EnhancedStatsCard";
import { ActivityTimeline } from "@/components/dashboard/ActivityTimeline";
import { BAChart } from "@/components/dashboard/BAChart";
import { StatusChart } from "@/components/dashboard/StatusChart";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  FileText,
  Users,
  Clock,
  CheckCircle,
  UserPlus,
  FolderOpen,
  Shield,
  TrendingUp,
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Download,
  XCircle,
  Plus,
} from "lucide-react";
import {
  getDashboardStats,
  AdminStats,
  DireksiStats,
  DKStats,
  VendorStats,
} from "@/lib/stats-api";

function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [statusData, setStatusData] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      getDashboardStats(),
      fetch("/api/stats/chart").then(res => res.json()),
      fetch("/api/audit-logs?limit=5").then(res => res.json())
    ])
      .then(([statsResponse, chartResponse, auditResponse]) => {
        setStats(statsResponse.stats as AdminStats);
        if (chartResponse.success) {
          setChartData(chartResponse.data.chartData.map((d: any) => ({
            month: d.month,
            value: d.total
          })));
          setStatusData(chartResponse.data.statusData);
        }
        if (auditResponse.success) {
          // Map audit logs to activity format
          const mappedActivities = auditResponse.data.map((log: any) => {
            let type: "ba_created" | "ba_approved" | "ba_rejected" | "user_created" = "ba_created";
            let href = "/ba";
            
            if (log.action.includes("approve")) type = "ba_approved";
            else if (log.action.includes("reject")) type = "ba_rejected";
            else if (log.category === "admin" && log.action.includes("user")) {
              type = "user_created";
              href = "/users";
            }
            
            return {
              id: log.id,
              type,
              title: log.action,
              description: log.description,
              timestamp: log.createdAt,
              href,
            };
          });
          setActivities(mappedActivities);
        }
      })
      .catch((err) => {
        console.error("Error fetching stats:", err);
        setError(err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <p className="text-red-700 font-medium">Failed to load statistics: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Section with Glassmorphism */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-50 via-white to-primary-50/30 p-8 border border-primary-100">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-200/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary-300/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 text-lg">
            Welcome back! Here's what's happening with your system today.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <EnhancedStatsCard
          title="Total Berita Acara"
          value={stats?.totalBA || 0}
          icon={FileText}
          description="All BA in system"
          trend={{ value: 12, isPositive: true }}
          loading={isLoading}
          href="/ba"
        />

        <EnhancedStatsCard
          title="Total Vendors"
          value={stats?.totalVendor || 0}
          icon={Users}
          description="Registered vendors"
          trend={{ value: 5, isPositive: true }}
          loading={isLoading}
          href="/users"
        />

        <EnhancedStatsCard
          title="Pending Approval"
          value={stats?.pendingApproval || 0}
          icon={Clock}
          description="Awaiting review"
          loading={isLoading}
          href="/ba?status=PENDING"
        />

        <EnhancedStatsCard
          title="Completed Today"
          value={stats?.completedToday || 0}
          icon={CheckCircle}
          description="Approved today"
          loading={isLoading}
        />
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        <BAChart data={chartData} loading={isLoading} />
        <StatusChart data={statusData} loading={isLoading} />
      </div>

      {/* Activity Timeline & Quick Actions */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Activity Timeline - Takes 2 columns */}
        <div className="lg:col-span-2">
          <ActivityTimeline activities={activities} loading={isLoading} />
        </div>

        {/* Quick Actions - Takes 1 column */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-4">
            <Link
              href="/users/create"
              className="group flex items-center gap-4 p-5 bg-gradient-to-br from-white to-gray-50/50 border border-gray-200 rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
          >
            <div className="p-3 rounded-lg bg-primary-100 text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-colors duration-300">
              <UserPlus className="h-6 w-6" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                Add New User
              </p>
              <p className="text-sm text-gray-600">Create new account</p>
            </div>
          </Link>

          <Link
            href="/ba"
            className="group flex items-center gap-4 p-5 bg-gradient-to-br from-white to-gray-50/50 border border-gray-200 rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
          >
            <div className="p-3 rounded-lg bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
              <FolderOpen className="h-6 w-6" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                Manage BA
              </p>
              <p className="text-sm text-gray-600">View & manage all BA</p>
            </div>
          </Link>

          <Link
            href="/users"
            className="group flex items-center gap-4 p-5 bg-gradient-to-br from-white to-gray-50/50 border border-gray-200 rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
          >
            <div className="p-3 rounded-lg bg-purple-100 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                User Management
              </p>
              <p className="text-sm text-gray-600">Manage accounts</p>
            </div>
          </Link>

          <Link
            href="/audit-logs"
            className="group flex items-center gap-4 p-5 bg-gradient-to-br from-white to-gray-50/50 border border-gray-200 rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
          >
            <div className="p-3 rounded-lg bg-emerald-100 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">
                Audit Logs
              </p>
              <p className="text-sm text-gray-600">View system activity</p>
            </div>
          </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

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
        return (
          <div className="text-center py-12">
            <p className="text-gray-600">Dashboard untuk role ini belum tersedia.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white flex flex-col">
      <Navbar />
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
        {renderDashboard()}
      </div>
      <Footer />
    </div>
  );
}

// Direksi Dashboard Component
function DireksiDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [recentBA, setRecentBA] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getDashboardStats()
      .then((response) => {
        setStats(response.stats);
        setRecentBA(response.recentBA || []);
      })
      .catch((err) => {
        console.error("Error fetching stats:", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-50 via-white to-orange-50/30 p-8 border border-orange-100">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-300/20 rounded-full blur-3xl" />
        <div className="relative z-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">Dashboard Direksi</h1>
          <p className="text-gray-600 text-lg">Review dan setujui Berita Acara</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        <EnhancedStatsCard
          title="Menunggu Approval"
          value={isLoading ? 0 : (stats?.pendingApproval || 12)}
          icon={Clock}
          description="BA perlu ditinjau"
          trend={{ value: 3, isPositive: false }}
          loading={isLoading}
          href="/ba?status=PENDING"
        />

        <EnhancedStatsCard
          title="Ditandatangani Hari Ini"
          value={isLoading ? 0 : (stats?.signedToday || 5)}
          icon={CheckCircle}
          description="BA telah disetujui"
          trend={{ value: 25, isPositive: true }}
          loading={isLoading}
        />

        <EnhancedStatsCard
          title="BA Terlama Menunggu"
          value={isLoading ? "0 hari" : (stats?.oldestBA ? `${stats.oldestBA.daysWaiting} hari` : "0 hari")}
          icon={AlertTriangle}
          description="Perlu perhatian segera"
          loading={isLoading}
          href={stats?.oldestBA ? `/ba/${stats.oldestBA.id}` : undefined}
        />
      </div>

      {/* Alert for Oldest BA */}
      {!isLoading && stats?.oldestBA && stats.oldestBA.daysWaiting > 3 && (
        <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600 flex-shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">BA Memerlukan Perhatian</h3>
              <p className="text-gray-700 mb-3">
                BA {stats.oldestBA.nomorBA} dari {stats.oldestBA.namaVendor} sudah menunggu {stats.oldestBA.daysWaiting} hari tanpa respon.
              </p>
              <Link
                href={`/ba/${stats.oldestBA.id}`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all hover:scale-105"
              >
                Review Sekarang
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Recent BA Waiting */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">BA Terbaru Menunggu</h2>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-20" />)}
          </div>
        ) : recentBA.length > 0 ? (
          <div className="space-y-3">
            {recentBA.map((ba) => (
              <Link
                key={ba.id}
                href={`/ba/${ba.id}`}
                className="group flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-orange-400 hover:bg-orange-50/50 transition-all hover:scale-[1.02]"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600 group-hover:scale-110 transition-transform">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{ba.nomorBA}</p>
                    <p className="text-sm text-gray-600">{ba.namaVendor} - {ba.jenisBA}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500">{ba.daysWaiting} hari yang lalu</span>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-orange-600 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Clock className="w-12 h-12 mx-auto mb-2 text-gray-400" />
            <p>Tidak ada BA menunggu approval</p>
          </div>
        )}
      </div>
    </div>
  );
}

// DK Dashboard Component
function DKDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [recentBA, setRecentBA] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getDashboardStats()
      .then((response) => {
        setStats(response.stats);
        setRecentBA(response.recentBA || []);
      })
      .catch((err) => {
        console.error("Error fetching stats:", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-white to-blue-50/30 p-8 border border-blue-100">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-300/20 rounded-full blur-3xl" />
        <div className="relative z-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">Dashboard Departemen Keuangan</h1>
          <p className="text-gray-600 text-lg">Download Berita Acara yang telah disetujui</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        <EnhancedStatsCard
          title="BA Selesai Hari Ini"
          value={isLoading ? 0 : (stats?.completedToday || 5)}
          icon={CheckCircle}
          description="Baru disetujui"
          trend={{ value: 15, isPositive: true }}
          loading={isLoading}
          href="/ba?status=APPROVED&date=today"
        />

        <EnhancedStatsCard
          title="Siap Download"
          value={isLoading ? 0 : (stats?.readyDownload || 28)}
          icon={Download}
          description="BA yang telah selesai"
          loading={isLoading}
          href="/ba?status=APPROVED"
        />

        <EnhancedStatsCard
          title="BA Minggu Ini"
          value={isLoading ? 0 : (stats?.thisWeek || 15)}
          icon={TrendingUp}
          description="Total approved"
          trend={{ value: 20, isPositive: true }}
          loading={isLoading}
        />
      </div>

      {/* Recent Approved BA */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">BA Terbaru Disetujui</h2>
          <Link
            href="/ba?status=APPROVED"
            className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1 group"
          >
            Lihat semua
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-24" />)}
          </div>
        ) : recentBA.length > 0 ? (
          <div className="space-y-3">
            {recentBA.map((ba) => (
              <div
                key={ba.id}
                className="group flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primary-400 hover:bg-primary-50/50 transition-all hover:scale-[1.02]"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{ba.nomorBA}</p>
                    <p className="text-sm text-gray-600">{ba.namaVendor} - {ba.jenisBA}</p>
                    <p className="text-xs text-gray-500">Disetujui {ba.hoursAgo} jam yang lalu</p>
                  </div>
                </div>
                <Link
                  href={`/ba/${ba.id}`}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all hover:scale-105 text-sm font-medium flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <CheckCircle className="w-12 h-12 mx-auto mb-2 text-gray-400" />
            <p>Tidak ada BA yang baru disetujui</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Vendor Dashboard Component
function VendorDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [recentBA, setRecentBA] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getDashboardStats(),
      fetch("/api/ba?limit=3&sortBy=createdAt&sortOrder=desc").then(res => res.json())
    ])
      .then(([statsResponse, baResponse]) => {
        setStats(statsResponse.stats);
        
        if (baResponse.success && baResponse.data && Array.isArray(baResponse.data)) {
          // Map BA data to dashboard format
          // API returns nested structure: { ba: {...}, vendor: {...} }
          const mappedBA = baResponse.data.map((item: any) => {
            const baData = item.ba || item; // Handle both nested and flat structures
            let statusLabel = "Menunggu";
            let colorClass = "orange";
            
            if (baData.status === "APPROVED") {
              statusLabel = "Disetujui";
              colorClass = "green";
            } else if (baData.status === "REJECTED") {
              statusLabel = "Ditolak";
              colorClass = "red";
            }
            
            return {
              id: baData.id,
              nomorBA: baData.nomorBA,
              jenisBA: baData.jenisBA,
              status: baData.status || 'PENDING',
              statusLabel,
              colorClass,
            };
          });
          setRecentBA(mappedBA);
        } else {
          setRecentBA([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching vendor dashboard data:", err);
        setRecentBA([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-50 via-white to-purple-50/30 p-8 border border-purple-100">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-300/20 rounded-full blur-3xl" />
        <div className="relative z-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">Dashboard Vendor</h1>
          <p className="text-gray-600 text-lg">Kelola Berita Acara Anda</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-6">
        <EnhancedStatsCard
          title="Total BA"
          value={isLoading ? 0 : (stats?.total || 0)}
          icon={FileText}
          description="Semua BA Anda"
          loading={isLoading}
          href="/ba/my"
        />

        <EnhancedStatsCard
          title="Menunggu Approval"
          value={isLoading ? 0 : (stats?.pending || 0)}
          icon={Clock}
          description="Dalam review"
          loading={isLoading}
          href="/ba/my?status=PENDING"
        />

        <EnhancedStatsCard
          title="Ditolak"
          value={isLoading ? 0 : (stats?.rejected || 0)}
          icon={XCircle}
          description="Perlu diperbaiki"
          loading={isLoading}
          href="/ba/my?status=REJECTED"
        />

        <EnhancedStatsCard
          title="Disetujui"
          value={isLoading ? 0 : (stats?.approved || 0)}
          icon={CheckCircle}
          description="BA selesai"
          trend={{ value: 12, isPositive: true }}
          loading={isLoading}
          href="/ba/my?status=APPROVED"
        />
      </div>

      {/* Create BA CTA */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 p-8 text-white shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Buat Berita Acara Baru</h2>
            <p className="text-primary-100">Mulai proses pembuatan BA (BAPB atau BAPP)</p>
          </div>
          <Link
            href="/ba/create"
            className="px-6 py-3 bg-white text-primary-600 rounded-lg hover:bg-primary-50 transition-all hover:scale-105 font-semibold flex items-center gap-2 shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Buat BA
          </Link>
        </div>
      </div>

      {/* Alert for Rejected BA */}
      {!isLoading && stats && stats.rejected > 0 && (
        <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center text-red-600 flex-shrink-0">
              <XCircle className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">BA Ditolak</h3>
              <p className="text-gray-700 mb-3">
                Anda memiliki {stats.rejected} BA yang ditolak. Silakan buat BA baru dengan perbaikan yang diperlukan.
              </p>
              <Link
                href="/ba/my?status=REJECTED"
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all hover:scale-105"
              >
                Lihat BA Ditolak
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Recent BA */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">BA Terbaru</h2>
          <Link
            href="/ba/my"
            className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1 group"
          >
            Lihat semua
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        <div className="space-y-3">
          {isLoading ? (
            <div className="text-center py-8 text-gray-500">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-2"></div>
              <p>Memuat data...</p>
            </div>
          ) : recentBA.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-600 mb-2">Belum ada BA yang dibuat</p>
              <Link
                href="/ba/create"
                className="text-primary-600 hover:text-primary-700 font-medium text-sm"
              >
                Buat BA Pertama Anda
              </Link>
            </div>
          ) : recentBA.map((ba) => {
            const statusColors = {
              green: { bg: "bg-green-100", text: "text-green-700", icon: "text-green-600" },
              orange: { bg: "bg-orange-100", text: "text-orange-700", icon: "text-orange-600" },
              red: { bg: "bg-red-100", text: "text-red-700", icon: "text-red-600" },
            };
            const colors = statusColors[ba.colorClass as keyof typeof statusColors];

            return (
              <Link
                key={ba.id}
                href={`/ba/${ba.id}`}
                className="group flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primary-400 hover:bg-primary-50/50 transition-all hover:scale-[1.02]"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 ${colors.bg} rounded-lg flex items-center justify-center ${colors.icon} group-hover:scale-110 transition-transform`}>
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{ba.nomorBA}</p>
                    <p className="text-sm text-gray-600">{ba.jenisBA} - Pengiriman Material</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${colors.bg} ${colors.text}`}>
                  {ba.statusLabel}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
