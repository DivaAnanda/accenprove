"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getBAById } from "@/lib/ba-api";
import type { BAData } from "@/lib/ba-api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function BASuccessPage() {
  const router = useRouter();
  const [baData, setBAData] = useState<BAData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Get BA ID from sessionStorage
    const baId = sessionStorage.getItem("lastCreatedBAId");
    
    if (!baId) {
      // No BA ID found, redirect to dashboard
      router.push("/dashboard");
      return;
    }

    // Fetch BA from API
    async function fetchBA() {
      try {
        const ba = await getBAById(parseInt(baId!));
        setBAData(ba);
        // Clear from sessionStorage
        sessionStorage.removeItem("lastCreatedBAId");
      } catch (err: any) {
        console.error("Error fetching BA:", err);
        setError(err.message || "Failed to load BA data");
      } finally {
        setLoading(false);
      }
    }

    fetchBA();
  }, [router]);

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

  if (error || !baData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white flex items-center justify-center">
        <div className="text-center max-w-md">
          <p className="text-red-600 mb-4">{error || "BA data not found"}</p>
          <button
            onClick={() => router.push("/dashboard")}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Kembali ke Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white flex flex-col">
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message Card */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 mb-6">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center animate-pulse">
              <svg
                className="w-14 h-14 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-3">
            Berita Acara Berhasil Dibuat!
          </h2>

          <p className="text-base text-gray-700 text-center mb-2">
            Berita Acara Anda telah berhasil dibuat dan disimpan dalam sistem.
          </p>
          <p className="text-base text-gray-600 text-center">
            Dokumen sedang menunggu persetujuan dari pihak terkait.
          </p>
          
          {/* BA Number */}
          <div className="mt-6 p-4 bg-primary-50 rounded-lg border border-primary-200">
            <p className="text-sm text-gray-600 text-center">Nomor Berita Acara:</p>
            <p className="text-xl font-bold text-primary-600 text-center">{baData.nomorBA}</p>
          </div>
        </div>

        {/* BA Details Card */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden mb-6">
          {/* Header Card */}
          <div className="bg-primary-600 px-6 py-4">
            <h3 className="text-xl font-bold text-white">Alur Persetujuan</h3>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Timeline Persetujuan */}
            <div className="space-y-4">
              {/* Step 1 - Vendor */}
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-lg font-bold text-gray-900">
                    Vendor - Dokumen Dibuat
                  </p>
                  <p className="text-sm text-gray-600">
                    {new Date(baData.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}, {new Date(baData.createdAt).toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })} WIB
                  </p>
                </div>
              </div>

              {/* Connector Line */}
              <div className="ml-5 border-l-2 border-gray-300 h-8"></div>

              {/* Step 2 - Direksi */}
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-lg font-bold text-gray-900">
                    Direksi - Menunggu Persetujuan
                  </p>
                  <p className="text-sm text-gray-600">Dalam proses review</p>
                </div>
              </div>

              {/* Connector Line */}
              <div className="ml-5 border-l-2 border-gray-300 h-8"></div>

              {/* Step 3 - Departemen Keuangan */}
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-base font-bold text-gray-600">3</span>
                  </div>
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-lg font-bold text-gray-500">
                    Departemen Keuangan - Belum Diproses
                  </p>
                  <p className="text-sm text-gray-400">
                    Menunggu approval sebelumnya
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Alert */}
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 rounded-r-lg shadow-sm">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-6 w-6 text-blue-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-semibold text-blue-800">
                <strong>Informasi Penting:</strong>
              </p>
              <p className="text-sm text-blue-700 mt-1">
                Anda akan menerima notifikasi melalui email dan dashboard ketika
                Berita Acara telah disetujui, ditolak, atau memerlukan revisi
                dari pihak terkait.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="space-y-3">
            <button
              onClick={() => router.push(`/ba/${baData.id}`)}
              className="w-full bg-primary-600 text-white py-4 rounded-lg text-base font-bold hover:bg-primary-700 transition-colors shadow-md flex items-center justify-center"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              Lihat Detail & Download BA
            </button>

            <button
              onClick={() => router.push("/ba/create")}
              className="w-full bg-white border-2 border-primary-600 text-primary-600 py-4 rounded-lg text-base font-bold hover:bg-primary-50 transition-colors flex items-center justify-center"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Buat BA Baru
            </button>

            <button
              onClick={() => router.push("/dashboard")}
              className="w-full bg-gray-300 text-gray-800 py-4 rounded-lg text-base font-bold hover:bg-gray-400 transition-colors flex items-center justify-center"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Kembali ke Dashboard
            </button>
          </div>

          {/* Footer Info */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center">
              Butuh bantuan atau ada pertanyaan?
            </p>
            <p className="text-sm text-center mt-1">
              <a
                href="mailto:info@accenprove.com"
                className="text-primary-600 hover:underline font-semibold"
              >
                info@accenprove.com
              </a>
              {" atau "}
              <a
                href="tel:+62xxxxxxxxxx"
                className="text-primary-600 hover:underline font-semibold"
              >
                +62 xxx xxxx xxxx
              </a>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
