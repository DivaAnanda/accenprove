"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { createBA, getBAById, updateBA } from "@/lib/ba-api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function CreateBAPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const isEditMode = !!editId;
  
  const { user, loading } = useAuth();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [isLoadingBA, setIsLoadingBA] = useState(false);
  const [rejectionInfo, setRejectionInfo] = useState<{
    reason: string;
    rejectedAt: Date;
  } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Role check - redirect if not vendor
  useEffect(() => {
    if (!loading && user && user.role !== "vendor") {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "vendor") {
    return null; // Middleware + useEffect will handle redirect
  }

  const [formData, setFormData] = useState({
    jenisBA: "",
    nomorKontrak: "",
    namaVendor: "",
    tanggalPemeriksaan: "",
    lokasiPemeriksaan: "",
    namaPIC: "",
    jabatanPIC: "",
    deskripsiBarang: "",
    jumlahBarang: "",
    kondisiBarang: "",
    keterangan: "",
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
      }
    }
  }, []);

  // Load BA data if in edit mode
  useEffect(() => {
    if (isEditMode && editId) {
      setIsLoadingBA(true);
      getBAById(parseInt(editId))
        .then((ba) => {
          // Pre-fill form data
          setFormData({
            jenisBA: ba.jenisBA,
            nomorKontrak: ba.nomorKontrak,
            namaVendor: ba.namaVendor,
            tanggalPemeriksaan: ba.tanggalPemeriksaan,
            lokasiPemeriksaan: ba.lokasiPemeriksaan,
            namaPIC: ba.namaPIC,
            jabatanPIC: ba.jabatanPIC,
            deskripsiBarang: ba.deskripsiBarang,
            jumlahBarang: ba.jumlahBarang,
            kondisiBarang: ba.kondisiBarang,
            keterangan: ba.keterangan || "",
          });

          // Show rejection info if available
          if (ba.status === "REJECTED" && ba.rejectionReason && ba.rejectedAt) {
            setRejectionInfo({
              reason: ba.rejectionReason,
              rejectedAt: new Date(ba.rejectedAt),
            });
          }

          // Load existing signature to canvas
          if (ba.signatureVendor && canvasRef.current) {
            const ctx = canvasRef.current.getContext("2d");
            const img = new Image();
            img.onload = () => {
              ctx?.drawImage(img, 0, 0);
            };
            img.src = ba.signatureVendor;
          }
        })
        .catch((error) => {
          alert("Gagal memuat data BA: " + error.message);
          router.push("/dashboard");
        })
        .finally(() => {
          setIsLoadingBA(false);
        });
    }
  }, [isEditMode, editId, router]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (ctx && canvas) {
      const rect = canvas.getBoundingClientRect();
      ctx.beginPath();
      ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (ctx && canvas) {
      const rect = canvas.getBoundingClientRect();
      ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (ctx && canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi tanda tangan
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        let hasSignature = false;

        for (let i = 0; i < data.length; i += 4) {
          if (data[i + 3] > 0) {
            hasSignature = true;
            break;
          }
        }

        if (!hasSignature) {
          alert("Silakan bubuhkan tanda tangan terlebih dahulu!");
          return;
        }
      }
    }

    setShowConfirmation(true);
  };

  const handleConfirm = async () => {
    setIsSubmitting(true);
    setSubmitError("");

    try {
      const canvas = canvasRef.current;
      if (!canvas) {
        throw new Error("Canvas not found");
      }

      const signatureData = canvas.toDataURL();

      if (isEditMode && editId) {
        // Update existing BA
        await updateBA(parseInt(editId), {
          jenisBA: formData.jenisBA as "BAPB" | "BAPP",
          nomorKontrak: formData.nomorKontrak,
          tanggalPemeriksaan: formData.tanggalPemeriksaan,
          lokasiPemeriksaan: formData.lokasiPemeriksaan,
          namaPIC: formData.namaPIC,
          jabatanPIC: formData.jabatanPIC,
          deskripsiBarang: formData.deskripsiBarang,
          jumlahBarang: formData.jumlahBarang,
          kondisiBarang: formData.kondisiBarang,
          keterangan: formData.keterangan || undefined,
          signatureVendor: signatureData,
        });

        alert("BA berhasil diperbarui dan akan direview kembali!");
        router.push(`/ba/${editId}`);
      } else {
        // Create new BA
        const createdBA = await createBA({
          jenisBA: formData.jenisBA as "BAPB" | "BAPP",
          nomorKontrak: formData.nomorKontrak,
          tanggalPemeriksaan: formData.tanggalPemeriksaan,
          lokasiPemeriksaan: formData.lokasiPemeriksaan,
          namaPIC: formData.namaPIC,
          jabatanPIC: formData.jabatanPIC,
          deskripsiBarang: formData.deskripsiBarang,
          jumlahBarang: formData.jumlahBarang,
          kondisiBarang: formData.kondisiBarang,
          keterangan: formData.keterangan || undefined,
          signatureVendor: signatureData,
        });

        console.log("BA Created:", createdBA);

        // Store BA ID in sessionStorage for success page
        sessionStorage.setItem("lastCreatedBAId", createdBA.id.toString());

        setShowConfirmation(false);
        router.push("/ba/success");
      }
    } catch (error: any) {
      console.error(isEditMode ? "Error updating BA:" : "Error creating BA:", error);
      setSubmitError(error.message || `Failed to ${isEditMode ? "update" : "create"} BA. Please try again.`);
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setShowConfirmation(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white flex flex-col">
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoadingBA ? (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Memuat data BA...</p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
            {/* Rejection Info Alert */}
            {rejectionInfo && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-red-600 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-red-800 mb-1">
                      BA Ditolak pada {new Date(rejectionInfo.rejectedAt).toLocaleDateString("id-ID")}
                    </h3>
                    <p className="text-sm text-red-700 mb-2">
                      <strong>Alasan Penolakan:</strong> {rejectionInfo.reason}
                    </p>
                    <p className="text-xs text-red-600">
                      Silakan perbaiki data sesuai catatan di atas, kemudian submit ulang untuk direview kembali.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {isEditMode ? "Edit Berita Acara" : "Formulir Pembuatan Berita Acara"}
              </h2>
              <p className="text-base text-gray-600">
                {isEditMode 
                  ? "Perbarui data yang diperlukan dan submit ulang untuk direview"
                  : "Lengkapi semua data di bawah ini untuk membuat Berita Acara"
                }
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
            {/* Jenis BA */}
            <div>
              <label className="block text-base font-semibold text-gray-900 mb-2">
                Jenis Berita Acara <span className="text-red-500">*</span>
              </label>
              <select
                name="jenisBA"
                value={formData.jenisBA}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 text-base border-2 border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white text-gray-900"
              >
                <option value="">Pilih Jenis BA</option>
                <option value="BAPB">
                  BAPB - Berita Acara Pemeriksaan Barang
                </option>
                <option value="BAPP">
                  BAPP - Berita Acara Pemeriksaan Pekerjaan
                </option>
              </select>
            </div>

            {/* Nomor Kontrak */}
            <div>
              <label className="block text-base font-semibold text-gray-900 mb-2">
                Nomor Kontrak <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="nomorKontrak"
                value={formData.nomorKontrak}
                onChange={handleInputChange}
                required
                placeholder="Contoh: K-2024/11/001"
                className="w-full px-4 py-3 text-base border-2 border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-900 placeholder-gray-400"
              />
            </div>

            {/* Nama Vendor */}
            <div>
              <label className="block text-base font-semibold text-gray-900 mb-2">
                Nama Vendor <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="namaVendor"
                value={formData.namaVendor}
                onChange={handleInputChange}
                required
                placeholder="Contoh: PT. Vendor Teknologi Indonesia"
                className="w-full px-4 py-3 text-base border-2 border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-900 placeholder-gray-400"
              />
            </div>

            {/* Tanggal Pemeriksaan */}
            <div>
              <label className="block text-base font-semibold text-gray-900 mb-2">
                Tanggal Pemeriksaan <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="tanggalPemeriksaan"
                value={formData.tanggalPemeriksaan}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 text-base border-2 border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-900"
              />
            </div>

            {/* Lokasi Pemeriksaan */}
            <div>
              <label className="block text-base font-semibold text-gray-900 mb-2">
                Lokasi Pemeriksaan <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="lokasiPemeriksaan"
                value={formData.lokasiPemeriksaan}
                onChange={handleInputChange}
                required
                placeholder="Contoh: Gudang Pusat Jakarta"
                className="w-full px-4 py-3 text-base border-2 border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-900 placeholder-gray-400"
              />
            </div>

            {/* Deskripsi Barang/Pekerjaan */}
            <div>
              <label className="block text-base font-semibold text-gray-900 mb-2">
                Deskripsi Barang/Pekerjaan{" "}
                <span className="text-red-500">*</span>
              </label>
              <textarea
                name="deskripsiBarang"
                value={formData.deskripsiBarang}
                onChange={handleInputChange}
                required
                rows={4}
                placeholder="Contoh: Komputer Desktop Dell OptiPlex 7010, Spesifikasi: Intel Core i7, RAM 16GB, SSD 512GB"
                className="w-full px-4 py-3 text-base border-2 border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-900 placeholder-gray-400"
              />
            </div>

            {/* Jumlah Barang */}
            <div>
              <label className="block text-base font-semibold text-gray-900 mb-2">
                Jumlah Barang <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="jumlahBarang"
                value={formData.jumlahBarang}
                onChange={handleInputChange}
                required
                min="1"
                placeholder="Contoh: 25"
                className="w-full px-4 py-3 text-base border-2 border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-900 placeholder-gray-400"
              />
            </div>

            {/* Kondisi Barang */}
            <div>
              <label className="block text-base font-semibold text-gray-900 mb-2">
                Kondisi Barang <span className="text-red-500">*</span>
              </label>
              <select
                name="kondisiBarang"
                value={formData.kondisiBarang}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 text-base border-2 border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white text-gray-900"
              >
                <option value="">Pilih Kondisi</option>
                <option value="Baik">Baik - Sesuai Spesifikasi</option>
                <option value="Rusak Ringan">
                  Rusak Ringan - Perlu Perbaikan Kecil
                </option>
                <option value="Rusak Berat">
                  Rusak Berat - Tidak Dapat Digunakan
                </option>
              </select>
            </div>

            {/* Keterangan Tambahan */}
            <div>
              <label className="block text-base font-semibold text-gray-900 mb-2">
                Keterangan Tambahan
              </label>
              <textarea
                name="keterangan"
                value={formData.keterangan}
                onChange={handleInputChange}
                rows={3}
                placeholder="Masukkan catatan atau keterangan tambahan jika ada (opsional)"
                className="w-full px-4 py-3 text-base border-2 border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-900 placeholder-gray-400"
              />
            </div>

            {/* Tanda Tangan Digital */}
            <div className="border-t-2 border-gray-200 pt-6 mt-6">
              <label className="block text-base font-semibold text-gray-900 mb-3">
                Tanda Tangan Vendor <span className="text-red-500">*</span>
              </label>
              <p className="text-sm text-gray-600 mb-4">
                Gunakan mouse atau touchpad untuk membubuhkan tanda tangan Anda
                di area di bawah ini
              </p>

              <div className="border-2 border-primary-300 rounded-lg p-4 bg-gray-50">
                <canvas
                  ref={canvasRef}
                  width={600}
                  height={200}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  className="w-full h-48 bg-white border-2 border-dashed border-gray-300 rounded cursor-crosshair"
                  style={{ touchAction: "none" }}
                />
                <div className="flex justify-between items-center mt-3">
                  <p className="text-sm text-gray-600 italic">
                    Area Tanda Tangan
                  </p>
                  <button
                    type="button"
                    onClick={clearSignature}
                    className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                  >
                    Hapus Tanda Tangan
                  </button>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                className="flex-1 bg-primary-600 text-white py-4 rounded-lg text-lg font-bold hover:bg-primary-700 transition-colors shadow-md"
              >
                {isEditMode ? "Perbarui & Submit Ulang" : "Buat Berita Acara"}
              </button>
              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="flex-1 bg-gray-300 text-gray-800 py-4 rounded-lg text-lg font-bold hover:bg-gray-400 transition-colors"
              >
                Batal
              </button>
            </div>
          </form>
          </div>
        )}
      </main>

      <Footer />

      {/* Popup Konfirmasi */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex flex-col items-center text-center">
              {/* Icon */}
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-10 h-10 text-primary-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {isEditMode ? "Konfirmasi Update Berita Acara" : "Konfirmasi Pembuatan Berita Acara"}
              </h3>

              {/* Message */}
              <p className="text-base text-gray-700 mb-6 leading-relaxed">
                {isEditMode 
                  ? "Apakah Anda yakin ingin memperbarui Berita Acara ini? Data akan direview ulang oleh Direksi."
                  : "Apakah Anda yakin ingin membuat Berita Acara dengan data yang telah diisi? Pastikan semua informasi dan tanda tangan sudah benar."
                }
              </p>

              {/* Error Message */}
              {submitError && (
                <div className="w-full mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700">{submitError}</p>
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-3 w-full">
                <button
                  onClick={handleCancel}
                  disabled={isSubmitting}
                  className="flex-1 bg-gray-300 text-gray-800 py-3 rounded-lg text-base font-bold hover:bg-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Batal
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={isSubmitting}
                  className="flex-1 bg-primary-600 text-white py-3 rounded-lg text-base font-bold hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      {isEditMode ? "Memperbarui..." : "Membuat..."}
                    </>
                  ) : (
                    isEditMode ? "Ya, Perbarui BA" : "Ya, Buat BA"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
