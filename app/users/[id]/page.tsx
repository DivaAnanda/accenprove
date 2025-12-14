"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Shield, 
  ArrowLeft,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";

interface UserDetail {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: "admin" | "direksi" | "dk" | "vendor";
  phone: string | null;
  address: string | null;
  photo: string | null;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { user } = useAuth();
  const [userDetail, setUserDetail] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  // Unwrap params
  useEffect(() => {
    params.then((p) => setUserId(p.id));
  }, [params]);

  useEffect(() => {
    if (user?.role !== "admin" || !userId) {
      if (user?.role !== "admin") {
        router.push("/dashboard");
      }
      return;
    }

    const fetchUserDetail = async () => {
      try {
        const response = await fetch(`/api/users/${userId}`);
        const data = await response.json();

        if (data.success) {
          setUserDetail(data.data);
        } else {
          console.error("Failed to fetch user detail:", data.message);
        }
      } catch (error) {
        console.error("Error fetching user detail:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetail();
  }, [user, userId, router]);

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin": 
        return "bg-gradient-to-r from-purple-500 to-purple-700 text-white";
      case "direksi": 
        return "bg-gradient-to-r from-blue-500 to-blue-700 text-white";
      case "dk": 
        return "bg-gradient-to-r from-green-500 to-green-700 text-white";
      case "vendor": 
        return "bg-gradient-to-r from-orange-500 to-orange-700 text-white";
      default: 
        return "bg-gradient-to-r from-gray-500 to-gray-700 text-white";
    }
  };

  const getRoleDisplay = (role: string) => {
    switch (role) {
      case "admin": return "Admin";
      case "direksi": return "Direksi";
      case "dk": return "Direktorat Keuangan";
      case "vendor": return "Vendor";
      default: return role;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-primary-50/20 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <p className="text-gray-600">Redirecting...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-primary-50/20 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto"></div>
              <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-primary-400 rounded-full animate-spin mx-auto blur-xl"></div>
            </div>
            <p className="mt-6 text-gray-600 font-medium">Memuat detail user...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!userDetail) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-primary-50/20 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-red-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <AlertCircle className="w-10 h-10 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">User Tidak Ditemukan</h2>
            <p className="text-gray-600 mb-6">User dengan ID tersebut tidak ada dalam sistem.</p>
            <Link 
              href="/users" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-medium rounded-xl hover:shadow-lg transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali ke Daftar User
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-primary-50/20 flex flex-col">
      <Navbar />
      <div className="flex-1 max-w-5xl w-full mx-auto px-4 py-8">
        {/* Header with Back Button */}
        <div className="mb-8">
          <Link 
            href="/users" 
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Daftar User
          </Link>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-primary-800 bg-clip-text text-transparent">
              Detail User
            </h1>
            <p className="text-gray-600 mt-2">Informasi lengkap tentang user</p>
          </div>
        </div>

        {/* Main Profile Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-6">
          {/* Header Section with Gradient */}
          <div className="bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 px-8 py-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
            <div className="relative flex items-center gap-6">
              {/* Avatar */}
              <div className="relative">
                {userDetail.photo ? (
                  <img
                    src={userDetail.photo}
                    alt={`${userDetail.firstName} ${userDetail.lastName}`}
                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-xl ring-4 ring-primary-400/50"
                  />
                ) : (
                  <div className="w-32 h-32 bg-white text-primary-700 rounded-full flex items-center justify-center font-bold text-5xl border-4 border-white shadow-xl ring-4 ring-primary-400/50">
                    {userDetail.firstName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {/* Basic Info */}
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-white mb-2">
                  {userDetail.firstName} {userDetail.lastName}
                </h2>
                <div className="flex items-center gap-2 text-white/90 mb-4">
                  <Mail className="w-4 h-4" />
                  <span>{userDetail.email}</span>
                </div>
                
                {/* Badges */}
                <div className="flex flex-wrap gap-3">
                  <span className={`px-4 py-2 text-sm font-semibold rounded-full shadow-lg ${getRoleBadge(userDetail.role)}`}>
                    {getRoleDisplay(userDetail.role)}
                  </span>
                  <span className={`px-4 py-2 text-sm font-semibold rounded-full shadow-lg ${
                    userDetail.isActive 
                      ? "bg-gradient-to-r from-green-500 to-green-700 text-white" 
                      : "bg-gradient-to-r from-red-500 to-red-700 text-white"
                  }`}>
                    {userDetail.isActive ? (
                      <span className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Aktif
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <XCircle className="w-4 h-4" />
                        Nonaktif
                      </span>
                    )}
                  </span>
                  {userDetail.isVerified && (
                    <span className="px-4 py-2 text-sm font-semibold rounded-full shadow-lg bg-gradient-to-r from-blue-500 to-blue-700 text-white">
                      <span className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Terverifikasi
                      </span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Information Grid */}
          <div className="p-8">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-primary-600" />
              Informasi Detail
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <label className="block text-sm font-medium text-gray-500 mb-2">Nama Depan</label>
                <p className="text-gray-900 font-semibold text-lg">{userDetail.firstName}</p>
              </div>

              {/* Last Name */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <label className="block text-sm font-medium text-gray-500 mb-2">Nama Belakang</label>
                <p className="text-gray-900 font-semibold text-lg">{userDetail.lastName}</p>
              </div>

              {/* Email */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <label className="block text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </label>
                <p className="text-gray-900 font-semibold break-all">{userDetail.email}</p>
              </div>

              {/* Phone */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <label className="block text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Nomor Telepon
                </label>
                <p className="text-gray-900 font-semibold">
                  {userDetail.phone || <span className="text-gray-400">Belum diisi</span>}
                </p>
              </div>

              {/* Address */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 md:col-span-2">
                <label className="block text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Alamat
                </label>
                <p className="text-gray-900 font-semibold">
                  {userDetail.address || <span className="text-gray-400">Belum diisi</span>}
                </p>
              </div>

              {/* Created At */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <label className="block text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Tanggal Dibuat
                </label>
                <p className="text-gray-900 font-semibold">{formatDate(userDetail.createdAt)}</p>
              </div>

              {/* Last Updated */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <label className="block text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Terakhir Diperbarui
                </label>
                <p className="text-gray-900 font-semibold">{formatDate(userDetail.updatedAt)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Account Status Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary-600" />
            Status Akun
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                userDetail.isActive ? "bg-green-100" : "bg-red-100"
              }`}>
                {userDetail.isActive ? (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-600" />
                )}
              </div>
              <div>
                <p className="text-sm text-gray-500">Status Akun</p>
                <p className={`font-semibold ${userDetail.isActive ? "text-green-700" : "text-red-700"}`}>
                  {userDetail.isActive ? "Aktif" : "Nonaktif"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                userDetail.isVerified ? "bg-blue-100" : "bg-gray-100"
              }`}>
                {userDetail.isVerified ? (
                  <CheckCircle className="w-6 h-6 text-blue-600" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-gray-600" />
                )}
              </div>
              <div>
                <p className="text-sm text-gray-500">Verifikasi</p>
                <p className={`font-semibold ${userDetail.isVerified ? "text-blue-700" : "text-gray-700"}`}>
                  {userDetail.isVerified ? "Terverifikasi" : "Belum Verifikasi"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-primary-100">
                <Shield className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Role</p>
                <p className="font-semibold text-primary-700">{getRoleDisplay(userDetail.role)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
