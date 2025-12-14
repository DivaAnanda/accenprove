"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import toast from "react-hot-toast";

type ProfileData = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: "admin" | "direksi" | "dk" | "vendor";
  phone: string | null;
  address: string | null;
  photo: string | null;
  createdAt: string;
};

type FormData = {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
};

const getRoleDisplay = (role: string): string => {
  const roleMap: Record<string, string> = {
    admin: "Admin",
    direksi: "Direksi",
    dk: "Direktorat Keuangan",
    vendor: "Vendor",
  };
  return roleMap[role] || role;
};

export default function ProfilePage() {
  const { user, loading: authLoading, refreshUser } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"view" | "edit">("view");
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
  });
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch profile data
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/users/me");
        const result = await response.json();

        if (result.success) {
          setProfile(result.data);
          setFormData({
            firstName: result.data.firstName,
            lastName: result.data.lastName,
            phone: result.data.phone || "",
            address: result.data.address || "",
          });
          setPhotoPreview(result.data.photo || "/default-avatar.png");
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Gagal memuat profil");
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && user) {
      fetchProfile();
    }
  }, [user, authLoading, router]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Hanya file JPG dan PNG yang diperbolehkan");
      return;
    }

    // Validate file size (max 2MB)
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("Ukuran file maksimal 2MB");
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handlePhotoUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    const loadingToast = toast.loading("Mengunggah foto...");

    try {
      const formData = new FormData();
      formData.append("photo", selectedFile);

      const response = await fetch("/api/users/me/photo", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setProfile((prev) => (prev ? { ...prev, photo: result.data.photo } : null));
        setSelectedFile(null);
        toast.success("Foto berhasil diperbarui", { id: loadingToast });
        // Refresh user data in AuthContext to update Navbar
        await refreshUser();
      } else {
        toast.error(result.message, { id: loadingToast });
        // Reset preview to current photo
        setPhotoPreview(profile?.photo || "/default-avatar.png");
      }
    } catch (error) {
      console.error("Error uploading photo:", error);
      toast.error("Gagal mengunggah foto", { id: loadingToast });
      setPhotoPreview(profile?.photo || "/default-avatar.png");
    } finally {
      setUploading(false);
    }
  };

  const handlePhotoDelete = async () => {
    if (!confirm("Hapus foto profil dan gunakan avatar default?")) return;

    setUploading(true);
    const loadingToast = toast.loading("Menghapus foto...");

    try {
      const response = await fetch("/api/users/me/photo", {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        setProfile((prev) =>
          prev ? { ...prev, photo: "/default-avatar.png" } : null
        );
        setPhotoPreview("/default-avatar.png");
        setSelectedFile(null);
        toast.success("Foto berhasil dihapus", { id: loadingToast });
      } else {
        toast.error(result.message, { id: loadingToast });
      }
    } catch (error) {
      console.error("Error deleting photo:", error);
      toast.error("Gagal menghapus foto", { id: loadingToast });
    } finally {
      setUploading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "Nama depan wajib diisi";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Nama belakang wajib diisi";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Nomor telepon wajib diisi";
    } else if (!/^\+?\d{9,15}$/.test(formData.phone)) {
      newErrors.phone =
        "Nomor telepon tidak valid (9-15 digit, dapat diawali +)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast.error("Mohon perbaiki kesalahan pada form");
      return;
    }

    setSaving(true);
    const loadingToast = toast.loading("Menyimpan profil...");

    try {
      const response = await fetch("/api/users/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setProfile(result.data);
        toast.success("Profil berhasil diperbarui", { id: loadingToast });
        setActiveTab("view");
      } else {
        toast.error(result.message, { id: loadingToast });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Gagal memperbarui profil", { id: loadingToast });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        firstName: profile.firstName,
        lastName: profile.lastName,
        phone: profile.phone || "",
        address: profile.address || "",
      });
      setPhotoPreview(profile.photo || "/default-avatar.png");
      setSelectedFile(null);
    }
    setErrors({});
    setActiveTab("view");
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat profil...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Gagal memuat profil</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white flex flex-col">
      <Navbar />
      <div className="flex-1 max-w-4xl w-full mx-auto px-4 py-8">
          {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Profil Saya</h1>
          <p className="text-gray-600 mt-1">
            Kelola informasi profil Anda
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab("view")}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "view"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Lihat Profil
              </button>
              <button
                onClick={() => setActiveTab("edit")}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "edit"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Edit Profil
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === "view" ? (
              // View Tab
              <div>
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Photo */}
                  <div className="flex-shrink-0">
                    <img
                      src={profile.photo || "/default-avatar.png"}
                      alt="Profile"
                      className="w-32 h-32 rounded-full object-cover border-4 border-gray-100"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-grow">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {profile.firstName} {profile.lastName}
                    </h2>
                    <div className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full mb-4">
                      {getRoleDisplay(profile.role)}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                          Email
                        </label>
                        <p className="text-gray-900">{profile.email}</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                          Nomor Telepon
                        </label>
                        <p className="text-gray-900">
                          {profile.phone || "-"}
                        </p>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                          Alamat
                        </label>
                        <p className="text-gray-900">
                          {profile.address || "-"}
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                          Bergabung Sejak
                        </label>
                        <p className="text-gray-900">
                          {new Date(profile.createdAt).toLocaleDateString(
                            "id-ID",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Edit Tab
              <div>
                <div className="space-y-6">
                  {/* Photo Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Foto Profil
                    </label>
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                      <img
                        src={photoPreview || "/default-avatar.png"}
                        alt="Preview"
                        className="w-24 h-24 rounded-full object-cover border-4 border-gray-100"
                      />
                      <div className="space-y-2">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/jpeg,image/jpg,image/png"
                          onChange={handlePhotoSelect}
                          className="hidden"
                        />
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm font-medium"
                          >
                            Pilih Foto
                          </button>
                          {selectedFile && (
                            <button
                              type="button"
                              onClick={handlePhotoUpload}
                              disabled={uploading}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm font-medium"
                            >
                              {uploading ? "Mengunggah..." : "Unggah"}
                            </button>
                          )}
                          {profile.photo && profile.photo !== "/default-avatar.png" && !selectedFile && (
                            <button
                              type="button"
                              onClick={handlePhotoDelete}
                              disabled={uploading}
                              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm font-medium"
                            >
                              Hapus Foto
                            </button>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">
                          JPG atau PNG, maksimal 2MB
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Name Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nama Depan <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.firstName ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                      {errors.firstName && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.firstName}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nama Belakang <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.lastName ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                      {errors.lastName && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.lastName}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Email (Read-only) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={profile.email}
                      disabled
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Email tidak dapat diubah
                    </p>
                  </div>

                  {/* Department (Read-only) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Departemen
                    </label>
                    <input
                      type="text"
                      value={getRoleDisplay(profile.role)}
                      disabled
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Departemen tidak dapat diubah
                    </p>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nomor Telepon <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+628123456789"
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.phone ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                      Format: +628123456789 atau 08123456789
                    </p>
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Alamat
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Masukkan alamat lengkap..."
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
                    >
                      {saving ? "Menyimpan..." : "Simpan Perubahan"}
                    </button>
                    <button
                      onClick={handleCancel}
                      disabled={saving}
                      className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed font-medium"
                    >
                      Batal
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
