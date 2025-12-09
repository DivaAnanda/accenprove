"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function TentangPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white flex flex-col">
      <Navbar />
      <div className="flex-1 max-w-4xl w-full mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Tentang Accenprove
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            Accenprove adalah sistem manajemen Berita Acara (BA) yang dirancang
            untuk mempermudah proses persetujuan dan pelacakan dokumen Berita
            Acara di lingkungan perusahaan. Dengan Accenprove, proses yang
            sebelumnya memakan waktu dan rentan kesalahan kini dapat dilakukan
            secara digital, terstruktur, dan efisien.
          </p>
        </div>

        {/* Main Features */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Fitur Utama
          </h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Pengajuan BA Digital
                </h3>
                <p className="text-gray-600">
                  Vendor dapat mengajukan Berita Acara secara online dengan
                  form yang terstruktur dan mudah digunakan. Tidak perlu lagi
                  mengirimkan dokumen fisik atau email bolak-balik.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Alur Persetujuan Berjenjang
                </h3>
                <p className="text-gray-600">
                  Setiap BA akan melalui proses persetujuan yang jelas: dari
                  Direksi Keuangan (DK), kemudian Direksi, dan terakhir Admin.
                  Status setiap tahap dapat dipantau secara real-time.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Dashboard dan Statistik
                </h3>
                <p className="text-gray-600">
                  Dashboard informatif memberikan gambaran menyeluruh tentang
                  status BA: berapa yang pending, approved, atau rejected.
                  Memudahkan pengambilan keputusan dan monitoring.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Filtering dan Export Data
                </h3>
                <p className="text-gray-600">
                  Sistem dilengkapi dengan filter canggih (status, vendor,
                  tanggal, pencarian) dan fitur export ke Excel/CSV untuk
                  keperluan pelaporan dan analisis data.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Why Choose Accenprove */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Mengapa Memilih Accenprove?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
              <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Efisiensi Waktu
              </h3>
              <p className="text-gray-700 text-sm">
                Proses persetujuan yang tadinya berhari-hari kini bisa selesai
                dalam hitungan jam. Tidak ada lagi dokumen yang tercecer atau
                tertunda.
              </p>
            </div>

            <div className="p-4 bg-green-50 rounded-lg border border-green-100">
              <h3 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Transparansi Penuh
              </h3>
              <p className="text-gray-700 text-sm">
                Setiap pihak dapat melihat status BA secara real-time. Vendor
                tahu kapan BA mereka diproses, approver tahu berapa BA yang
                menunggu keputusan.
              </p>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
              <h3 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Audit Trail Lengkap
              </h3>
              <p className="text-gray-700 text-sm">
                Semua aktivitas tercatat dengan timestamp dan user yang
                melakukan aksi. Memudahkan audit dan pelacakan histori
                dokumen.
              </p>
            </div>

            <div className="p-4 bg-orange-50 rounded-lg border border-orange-100">
              <h3 className="font-semibold text-orange-900 mb-2 flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Hemat Biaya
              </h3>
              <p className="text-gray-700 text-sm">
                Mengurangi penggunaan kertas, biaya pengiriman dokumen fisik,
                dan mengurangi potensi kesalahan manual yang bisa menimbulkan
                biaya tambahan.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
