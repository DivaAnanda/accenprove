"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

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

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin": return "bg-purple-100 text-purple-700";
      case "direksi": return "bg-blue-100 text-blue-700";
      case "dk": return "bg-green-100 text-green-700";
      case "vendor": return "bg-orange-100 text-orange-700";
      default: return "bg-gray-100 text-gray-700";
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
      <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500">Redirecting...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500">Loading user detail...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!userDetail) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500 mb-4">User not found</p>
            <Link href="/users" className="text-primary-600 hover:text-primary-700 font-medium">
              ← Back to Users List
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white flex flex-col">
      <Navbar />
      <div className="flex-1 max-w-4xl w-full mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <Link href="/users" className="text-primary-600 hover:text-primary-700 font-medium mb-2 inline-block">
            ← Back to Users List
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">User Detail</h1>
        </div>

        {/* User Info Card */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          {/* Profile Photo & Basic Info */}
          <div className="flex items-start gap-6 mb-8 pb-8 border-b border-gray-200">
            {userDetail.photo ? (
              <img
                src={userDetail.photo}
                alt={`${userDetail.firstName} ${userDetail.lastName}`}
                className="w-24 h-24 rounded-full object-cover border-4 border-primary-100"
              />
            ) : (
              <div className="w-24 h-24 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-3xl border-4 border-primary-100">
                {userDetail.firstName.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {userDetail.firstName} {userDetail.lastName}
              </h2>
              <p className="text-gray-600 mb-4">{userDetail.email}</p>
              <div className="flex gap-3">
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${getRoleBadgeColor(userDetail.role)}`}>
                  {userDetail.role.toUpperCase()}
                </span>
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${userDetail.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                  {userDetail.isActive ? "ACTIVE" : "INACTIVE"}
                </span>
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${userDetail.isVerified ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"}`}>
                  {userDetail.isVerified ? "VERIFIED" : "UNVERIFIED"}
                </span>
              </div>
            </div>
          </div>

          {/* Detailed Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">First Name</label>
              <p className="text-gray-900 font-medium">{userDetail.firstName}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Last Name</label>
              <p className="text-gray-900 font-medium">{userDetail.lastName}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
              <p className="text-gray-900 font-medium">{userDetail.email}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Phone</label>
              <p className="text-gray-900 font-medium">{userDetail.phone || "—"}</p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-500 mb-1">Address</label>
              <p className="text-gray-900 font-medium">{userDetail.address || "—"}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Created At</label>
              <p className="text-gray-900 font-medium">{formatDate(userDetail.createdAt)}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Last Updated</label>
              <p className="text-gray-900 font-medium">{formatDate(userDetail.updatedAt)}</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
