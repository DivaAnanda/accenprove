"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function TentangPage() {
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});

  const toggleFlip = (cardId: string) => {
    setFlippedCards(prev => ({ ...prev, [cardId]: !prev[cardId] }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white flex flex-col">
      <Navbar />
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-50 via-white to-primary-50/30 p-8 border border-primary-100 mb-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-200/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary-300/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative z-10">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
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
        </div>

        {/* Main Features - Flip Cards */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Fitur Utama
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Feature 1 */}
            <div 
              className="flip-card h-64 cursor-pointer"
              onClick={() => toggleFlip('feature-1')}
              onMouseEnter={() => setFlippedCards(prev => ({ ...prev, 'feature-1': true }))}
              onMouseLeave={() => setFlippedCards(prev => ({ ...prev, 'feature-1': false }))}
            >
              <div className={`flip-card-inner ${flippedCards['feature-1'] ? 'flipped' : ''}`}>
                <div className="flip-card-front bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200 rounded-xl p-6 shadow-md">
                  <svg className="w-4 h-4 text-blue-400 absolute top-2 right-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <div className="flex flex-col items-center justify-center text-center h-full">
                    <div className="p-3 bg-blue-500 rounded-lg mb-4">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-blue-900 mb-2">
                      Pengajuan BA Digital
                    </h3>
                    <p className="text-blue-700 text-sm">Hover untuk detail</p>
                  </div>
                </div>
                <div className="flip-card-back bg-gradient-to-br from-blue-600 to-blue-700 border border-blue-500 rounded-xl p-6 shadow-md">
                  <div className="flex flex-col items-center justify-center text-center h-full">
                    <h3 className="text-xl font-bold text-white mb-4">
                      Pengajuan BA Digital
                    </h3>
                    <p className="text-blue-100 leading-relaxed">
                      Vendor dapat mengajukan Berita Acara secara online dengan form yang terstruktur dan mudah digunakan. Tidak perlu lagi mengirimkan dokumen fisik atau email bolak-balik.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div 
              className="flip-card h-64 cursor-pointer"
              onClick={() => toggleFlip('feature-2')}
              onMouseEnter={() => setFlippedCards(prev => ({ ...prev, 'feature-2': true }))}
              onMouseLeave={() => setFlippedCards(prev => ({ ...prev, 'feature-2': false }))}
            >
              <div className={`flip-card-inner ${flippedCards['feature-2'] ? 'flipped' : ''}`}>
                <div className="flip-card-front bg-gradient-to-br from-green-50 to-green-100/50 border border-green-200 rounded-xl p-6 shadow-md">
                  <svg className="w-4 h-4 text-green-400 absolute top-2 right-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <div className="flex flex-col items-center justify-center text-center h-full">
                    <div className="p-3 bg-green-500 rounded-lg mb-4">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-green-900 mb-2">
                      Alur Persetujuan Berjenjang
                    </h3>
                    <p className="text-green-700 text-sm">Hover untuk detail</p>
                  </div>
                </div>
                <div className="flip-card-back bg-gradient-to-br from-green-600 to-green-700 border border-green-500 rounded-xl p-6 shadow-md">
                  <div className="flex flex-col items-center justify-center text-center h-full">
                    <h3 className="text-xl font-bold text-white mb-4">
                      Alur Persetujuan Berjenjang
                    </h3>
                    <p className="text-green-100 leading-relaxed">
                      Setiap BA akan melalui proses persetujuan yang jelas: dari Direksi Keuangan (DK), kemudian Direksi, dan terakhir Admin. Status setiap tahap dapat dipantau secara real-time.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 3 */}
            <div 
              className="flip-card h-64 cursor-pointer"
              onClick={() => toggleFlip('feature-3')}
              onMouseEnter={() => setFlippedCards(prev => ({ ...prev, 'feature-3': true }))}
              onMouseLeave={() => setFlippedCards(prev => ({ ...prev, 'feature-3': false }))}
            >
              <div className={`flip-card-inner ${flippedCards['feature-3'] ? 'flipped' : ''}`}>
                <div className="flip-card-front bg-gradient-to-br from-purple-50 to-purple-100/50 border border-purple-200 rounded-xl p-6 shadow-md">
                  <svg className="w-4 h-4 text-purple-400 absolute top-2 right-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <div className="flex flex-col items-center justify-center text-center h-full">
                    <div className="p-3 bg-purple-500 rounded-lg mb-4">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-purple-900 mb-2">
                      Dashboard dan Statistik
                    </h3>
                    <p className="text-purple-700 text-sm">Hover untuk detail</p>
                  </div>
                </div>
                <div className="flip-card-back bg-gradient-to-br from-purple-600 to-purple-700 border border-purple-500 rounded-xl p-6 shadow-md">
                  <div className="flex flex-col items-center justify-center text-center h-full">
                    <h3 className="text-xl font-bold text-white mb-4">
                      Dashboard dan Statistik
                    </h3>
                    <p className="text-purple-100 leading-relaxed">
                      Dashboard informatif memberikan gambaran menyeluruh tentang status BA: berapa yang pending, approved, atau rejected. Memudahkan pengambilan keputusan dan monitoring.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 4 */}
            <div 
              className="flip-card h-64 cursor-pointer"
              onClick={() => toggleFlip('feature-4')}
              onMouseEnter={() => setFlippedCards(prev => ({ ...prev, 'feature-4': true }))}
              onMouseLeave={() => setFlippedCards(prev => ({ ...prev, 'feature-4': false }))}
            >
              <div className={`flip-card-inner ${flippedCards['feature-4'] ? 'flipped' : ''}`}>
                <div className="flip-card-front bg-gradient-to-br from-orange-50 to-orange-100/50 border border-orange-200 rounded-xl p-6 shadow-md">
                  <svg className="w-4 h-4 text-orange-400 absolute top-2 right-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <div className="flex flex-col items-center justify-center text-center h-full">
                    <div className="p-3 bg-orange-500 rounded-lg mb-4">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-orange-900 mb-2">
                      Filtering dan Export Data
                    </h3>
                    <p className="text-orange-700 text-sm">Hover untuk detail</p>
                  </div>
                </div>
                <div className="flip-card-back bg-gradient-to-br from-orange-600 to-orange-700 border border-orange-500 rounded-xl p-6 shadow-md">
                  <div className="flex flex-col items-center justify-center text-center h-full">
                    <h3 className="text-xl font-bold text-white mb-4">
                      Filtering dan Export Data
                    </h3>
                    <p className="text-orange-100 leading-relaxed">
                      Sistem dilengkapi dengan filter canggih (status, vendor, tanggal, pencarian) dan fitur export ke Excel/CSV untuk keperluan pelaporan dan analisis data.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Why Choose Accenprove - Card Grid */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Mengapa Memilih Accenprove?
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Benefit 1 */}
            <div className="flex gap-4 p-6 bg-gradient-to-br from-white to-gray-50/50 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex-shrink-0">
                <div className="p-3 bg-cyan-100 rounded-lg">
                  <svg className="w-8 h-8 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Efisiensi Waktu
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Proses persetujuan yang tadinya berhari-hari kini bisa selesai dalam hitungan jam. Tidak ada lagi dokumen yang tercecer atau tertunda.
                </p>
              </div>
            </div>

            {/* Benefit 2 */}
            <div className="flex gap-4 p-6 bg-gradient-to-br from-white to-gray-50/50 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex-shrink-0">
                <div className="p-3 bg-emerald-100 rounded-lg">
                  <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Transparansi Penuh
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Setiap pihak dapat melihat status BA secara real-time. Vendor tahu kapan BA mereka diproses, approver tahu berapa BA yang menunggu keputusan.
                </p>
              </div>
            </div>

            {/* Benefit 3 */}
            <div className="flex gap-4 p-6 bg-gradient-to-br from-white to-gray-50/50 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex-shrink-0">
                <div className="p-3 bg-pink-100 rounded-lg">
                  <svg className="w-8 h-8 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Audit Trail Lengkap
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Semua aktivitas tercatat dengan timestamp dan user yang melakukan aksi. Memudahkan audit dan pelacakan histori dokumen.
                </p>
              </div>
            </div>

            {/* Benefit 4 */}
            <div className="flex gap-4 p-6 bg-gradient-to-br from-white to-gray-50/50 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex-shrink-0">
                <div className="p-3 bg-amber-100 rounded-lg">
                  <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Hemat Biaya
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Mengurangi penggunaan kertas, biaya pengiriman dokumen fisik, dan mengurangi potensi kesalahan manual yang bisa menimbulkan biaya tambahan.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CSS for Flip Animation */}
        <style jsx>{`
          .flip-card {
            perspective: 1000px;
          }
          .flip-card-inner {
            position: relative;
            width: 100%;
            height: 100%;
            transition: transform 0.6s;
            transform-style: preserve-3d;
          }
          .flip-card-inner.flipped {
            transform: rotateY(180deg);
          }
          .flip-card-front, .flip-card-back {
            position: absolute;
            width: 100%;
            height: 100%;
            backface-visibility: hidden;
            display: flex;
            flex-direction: column;
            justify-content: center;
          }
          .flip-card-back {
            transform: rotateY(180deg);
          }
        `}</style>
      </div>
      <Footer />
    </div>
  );
}
