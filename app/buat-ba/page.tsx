"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function BuatBeritaAcara() {
  const router = useRouter();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
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

  const handleConfirm = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const signatureData = canvas.toDataURL();
      console.log("Data BA:", formData);
      console.log("Tanda Tangan:", signatureData);
    }
    setShowConfirmation(false);
    router.push("/ba-berhasil");
  };

  const handleCancel = () => {
    setShowConfirmation(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-teal-700">Accenprove</h1>
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
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Formulir Pembuatan Berita Acara
            </h2>
            <p className="text-base text-gray-600">
              Lengkapi semua data di bawah ini untuk membuat Berita Acara
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
                className="w-full px-4 py-3 text-base border-2 border-teal-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white text-gray-900"
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
                className="w-full px-4 py-3 text-base border-2 border-teal-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900 placeholder-gray-400"
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
                className="w-full px-4 py-3 text-base border-2 border-teal-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900 placeholder-gray-400"
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
                className="w-full px-4 py-3 text-base border-2 border-teal-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900"
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
                className="w-full px-4 py-3 text-base border-2 border-teal-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900 placeholder-gray-400"
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
                className="w-full px-4 py-3 text-base border-2 border-teal-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900 placeholder-gray-400"
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
                className="w-full px-4 py-3 text-base border-2 border-teal-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900 placeholder-gray-400"
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
                className="w-full px-4 py-3 text-base border-2 border-teal-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white text-gray-900"
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
                className="w-full px-4 py-3 text-base border-2 border-teal-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900 placeholder-gray-400"
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

              <div className="border-3 border-teal-600 rounded-lg p-4 bg-gray-50">
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
                className="flex-1 bg-teal-700 text-white py-4 rounded-lg text-lg font-bold hover:bg-teal-800 transition-colors shadow-md"
              >
                Buat Berita Acara
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
      </main>

      {/* Popup Konfirmasi */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex flex-col items-center text-center">
              {/* Icon */}
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-10 h-10 text-teal-700"
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
                Konfirmasi Pembuatan Berita Acara
              </h3>

              {/* Message */}
              <p className="text-base text-gray-700 mb-6 leading-relaxed">
                Apakah Anda yakin ingin membuat Berita Acara dengan data yang
                telah diisi? Pastikan semua informasi dan tanda tangan sudah
                benar.
              </p>

              {/* Buttons */}
              <div className="flex gap-3 w-full">
                <button
                  onClick={handleCancel}
                  className="flex-1 bg-gray-300 text-gray-800 py-3 rounded-lg text-base font-bold hover:bg-gray-400 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleConfirm}
                  className="flex-1 bg-teal-700 text-white py-3 rounded-lg text-base font-bold hover:bg-teal-800 transition-colors"
                >
                  Ya, Buat BA
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
