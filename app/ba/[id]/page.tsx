"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";

interface BAData {
  id: number;
  nomorBA: string;
  jenisBA: "BAPB" | "BAPP";
  nomorKontrak: string;
  namaVendor: string;
  tanggalPemeriksaan: string;
  lokasiPemeriksaan: string;
  namaPIC: string;
  jabatanPIC: string;
  deskripsiBarang: string;
  jumlahBarang: string;
  kondisiBarang: string;
  keterangan: string;
  signatureVendor: string;
  signatureDireksi?: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  approvedAt?: string;
}

export default function DetailBeritaAcara() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const printRef = useRef<HTMLDivElement>(null);

  const [baData, setBAData] = useState<BAData | null>(null);
  const [loading, setLoading] = useState(true);
  const [user] = useState({ role: "vendor", name: "User Vendor" }); // Mock user - will be replaced with auth

  useEffect(() => {
    // Fetch BA from localStorage
    const allBA = JSON.parse(localStorage.getItem("beritaAcara") || "[]");
    const foundBA = allBA.find((ba: BAData) => ba.id.toString() === id);
    
    if (foundBA) {
      setBAData(foundBA);
    } else {
      // BA not found
      alert("Berita Acara tidak ditemukan");
      router.push("/dashboard");
    }
    setLoading(false);
  }, [id, router]);

  const handleDownloadPDF = () => {
    if (!baData) return;

    // Import jsPDF dinamis untuk client-side
    import("jspdf").then((module) => {
      const jsPDF = module.default;
      const doc = new jsPDF();

      // Header
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      const headerText = baData.jenisBA === "BAPB" 
        ? "BERITA ACARA PEMERIKSAAN BARANG"
        : "BERITA ACARA PENERIMAAN PEKERJAAN";
      doc.text(headerText, 105, 20, { align: "center" });

      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text(`Nomor: ${baData.nomorBA}`, 105, 28, { align: "center" });

      // Line separator
      doc.setLineWidth(0.5);
      doc.line(20, 32, 190, 32);

      let yPos = 40;

      // Informasi Kontrak
      doc.setFont("helvetica", "bold");
      doc.text("INFORMASI KONTRAK", 20, yPos);
      yPos += 8;

      doc.setFont("helvetica", "normal");
      doc.text(`Nomor Kontrak: ${baData.nomorKontrak}`, 20, yPos);
      yPos += 6;
      doc.text(`Tanggal Pemeriksaan: ${baData.tanggalPemeriksaan}`, 20, yPos);
      yPos += 6;
      doc.text(`Lokasi Pemeriksaan: ${baData.lokasiPemeriksaan}`, 20, yPos);
      yPos += 10;

      // Informasi Vendor
      doc.setFont("helvetica", "bold");
      doc.text("INFORMASI VENDOR", 20, yPos);
      yPos += 8;

      doc.setFont("helvetica", "normal");
      doc.text(`Nama Vendor: ${baData.namaVendor}`, 20, yPos);
      yPos += 6;
      doc.text(`PIC: ${baData.namaPIC}`, 20, yPos);
      yPos += 6;
      doc.text(`Jabatan PIC: ${baData.jabatanPIC}`, 20, yPos);
      yPos += 10;

      // Detail Barang
      doc.setFont("helvetica", "bold");
      doc.text("DETAIL BARANG/PEKERJAAN", 20, yPos);
      yPos += 8;

      doc.setFont("helvetica", "normal");
      doc.text("Deskripsi:", 20, yPos);
      yPos += 6;
      const descLines = doc.splitTextToSize(baData.deskripsiBarang, 170);
      doc.text(descLines, 20, yPos);
      yPos += descLines.length * 6 + 6;

      doc.text(`Jumlah: ${baData.jumlahBarang}`, 20, yPos);
      yPos += 6;
      doc.text(`Kondisi: ${baData.kondisiBarang}`, 20, yPos);
      yPos += 10;

      // Keterangan
      if (baData.keterangan) {
        doc.setFont("helvetica", "bold");
        doc.text("KETERANGAN", 20, yPos);
        yPos += 8;

        doc.setFont("helvetica", "normal");
        const keteranganLines = doc.splitTextToSize(baData.keterangan, 170);
        doc.text(keteranganLines, 20, yPos);
        yPos += keteranganLines.length * 6 + 10;
      }

      // Tanda Tangan
      yPos += 10;
      doc.setFont("helvetica", "bold");
      doc.text("TANDA TANGAN", 20, yPos);
      yPos += 10;

      doc.setFont("helvetica", "normal");
      doc.text("Vendor", 30, yPos);
      doc.text("Direksi", 110, yPos);
      yPos += 25;

      // Add signature images if available
      if (baData.signatureVendor) {
        try {
          doc.addImage(baData.signatureVendor, "PNG", 30, yPos - 20, 40, 15);
        } catch (e) {
          console.error("Error adding vendor signature to PDF:", e);
        }
      }

      if (baData.signatureDireksi) {
        try {
          doc.addImage(baData.signatureDireksi, "PNG", 110, yPos - 20, 40, 15);
        } catch (e) {
          console.error("Error adding direksi signature to PDF:", e);
        }
      }

      doc.text("(_________________)", 30, yPos);
      doc.text("(_________________)", 110, yPos);
      yPos += 6;
      doc.text(baData.namaPIC, 30, yPos);
      doc.text("Direktur Utama", 110, yPos);

      // Footer
      doc.setFontSize(10);
      const createdDate = new Date(baData.createdAt).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
      doc.text(
        `Dokumen dibuat pada: ${createdDate} WIB`,
        105,
        280,
        { align: "center" }
      );

      // Save PDF
      doc.save(`BA_${baData.nomorBA.replace(/\//g, "_")}.pdf`);
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const getStatusBadge = () => {
    if (!baData) return null;

    const statusConfig = {
      PENDING: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        border: "border-yellow-300",
        label: "Menunggu Persetujuan Direksi",
        icon: (
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
              clipRule="evenodd"
            />
          </svg>
        ),
      },
      APPROVED: {
        bg: "bg-green-100",
        text: "text-green-800",
        border: "border-green-300",
        label: "Disetujui",
        icon: (
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        ),
      },
      REJECTED: {
        bg: "bg-red-100",
        text: "text-red-800",
        border: "border-red-300",
        label: "Ditolak",
        icon: (
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        ),
      },
    };

    const config = statusConfig[baData.status];

    return (
      <span
        className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold border-2 ${config.bg} ${config.text} ${config.border}`}
      >
        {config.icon}
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat data...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!baData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-gray-600 mb-4">Berita Acara tidak ditemukan</p>
            <button
              onClick={() => router.push("/dashboard")}
              className="text-primary-600 hover:text-primary-700 font-semibold"
            >
              ← Kembali ke Dashboard
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const jenisBALengkap = baData.jenisBA === "BAPB" 
    ? "Berita Acara Pemeriksaan Barang"
    : "Berita Acara Penerimaan Pekerjaan";

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Action Buttons - No Print */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6 print:hidden">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleDownloadPDF}
              className="flex-1 min-w-[200px] bg-primary-600 text-white py-3 px-6 rounded-lg text-base font-bold hover:bg-primary-700 transition-colors flex items-center justify-center"
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
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Download PDF
            </button>

            <button
              onClick={handlePrint}
              className="flex-1 min-w-[200px] bg-white border-2 border-primary-600 text-primary-600 py-3 px-6 rounded-lg text-base font-bold hover:bg-primary-50 transition-colors flex items-center justify-center"
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
                  d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                />
              </svg>
              Print
            </button>

            <button
              onClick={() => router.push("/dashboard")}
              className="min-w-[200px] bg-gray-100 border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-lg text-base font-bold hover:bg-gray-200 transition-colors flex items-center justify-center"
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
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Kembali ke Dashboard
            </button>
          </div>
        </div>

        {/* Document Preview */}
        <div
          ref={printRef}
          className="bg-white rounded-lg shadow-md overflow-hidden"
        >
          {/* Document Header */}
          <div className="bg-primary-600 px-8 py-6 text-center">
            <h2 className="text-2xl font-bold text-white mb-2">
              {jenisBALengkap.toUpperCase()}
            </h2>
            <p className="text-white text-lg">Nomor: {baData.nomorBA}</p>
          </div>

          {/* Document Body */}
          <div className="p-8">
            {/* Status Badge */}
            <div className="mb-6 print:hidden">{getStatusBadge()}</div>

            {/* Informasi Kontrak */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-primary-600">
                INFORMASI KONTRAK
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-1">
                    Nomor Kontrak
                  </p>
                  <p className="text-base font-semibold text-gray-900">
                    {baData.nomorKontrak}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-1">
                    Jenis BA
                  </p>
                  <p className="text-base font-semibold text-gray-900">
                    {baData.jenisBA} - {jenisBALengkap}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-1">
                    Tanggal Pemeriksaan
                  </p>
                  <p className="text-base font-semibold text-gray-900">
                    {baData.tanggalPemeriksaan}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-1">
                    Lokasi Pemeriksaan
                  </p>
                  <p className="text-base font-semibold text-gray-900">
                    {baData.lokasiPemeriksaan}
                  </p>
                </div>
              </div>
            </div>

            {/* Informasi Vendor */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-primary-600">
                INFORMASI VENDOR
              </h3>
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 mb-1">
                      Nama Vendor
                    </p>
                    <p className="text-base font-semibold text-gray-900">
                      {baData.namaVendor}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600 mb-1">
                      PIC Vendor
                    </p>
                    <p className="text-base font-semibold text-gray-900">
                      {baData.namaPIC}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600 mb-1">
                      Jabatan PIC
                    </p>
                    <p className="text-base font-semibold text-gray-900">
                      {baData.jabatanPIC}
                    </p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-300">
                  <div className="flex items-center text-sm text-gray-700">
                    <svg
                      className="w-5 h-5 mr-2 text-green-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="font-semibold">
                      Tanda Tangan Digital Vendor Telah Dibubuhkan
                    </span>
                  </div>
                  {baData.status === "APPROVED" && baData.signatureDireksi && (
                    <div className="flex items-center text-sm text-gray-700 mt-2">
                      <svg
                        className="w-5 h-5 mr-2 text-green-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="font-semibold">
                        Tanda Tangan Digital Direksi Telah Dibubuhkan
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Detail Barang */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-primary-600">
                DETAIL BARANG/PEKERJAAN
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-2">
                    Deskripsi
                  </p>
                  <p className="text-base text-gray-900 leading-relaxed">
                    {baData.deskripsiBarang}
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 mb-1">
                      Jumlah
                    </p>
                    <p className="text-base font-bold text-gray-900">
                      {baData.jumlahBarang}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600 mb-1">
                      Kondisi
                    </p>
                    <p className="text-base font-bold text-green-700">
                      {baData.kondisiBarang}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Keterangan */}
            {baData.keterangan && (
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-primary-600">
                  KETERANGAN
                </h3>
                <p className="text-base text-gray-900 leading-relaxed">
                  {baData.keterangan}
                </p>
              </div>
            )}

            {/* Tanda Tangan */}
            <div className="mt-12 pt-8 border-t-2 border-gray-300">
              <h3 className="text-xl font-bold text-gray-900 mb-8">
                TANDA TANGAN
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Vendor */}
                <div className="text-center">
                  <p className="text-base font-semibold text-gray-900 mb-4">
                    Vendor
                  </p>
                  {baData.signatureVendor && (
                    <div className="flex justify-center mb-4">
                      <img
                        src={baData.signatureVendor}
                        alt="Tanda Tangan Vendor"
                        className="border border-gray-300 rounded max-w-[200px] max-h-[100px]"
                      />
                    </div>
                  )}
                  <div className="border-t-2 border-gray-900 inline-block px-8 pt-2">
                    <p className="text-base font-semibold text-gray-900">
                      {baData.namaPIC}
                    </p>
                    <p className="text-sm text-gray-600">{baData.jabatanPIC}</p>
                  </div>
                </div>

                {/* Direksi */}
                <div className="text-center">
                  <p className="text-base font-semibold text-gray-900 mb-4">
                    Direksi
                  </p>
                  {baData.signatureDireksi ? (
                    <>
                      <div className="flex justify-center mb-4">
                        <img
                          src={baData.signatureDireksi}
                          alt="Tanda Tangan Direksi"
                          className="border border-gray-300 rounded max-w-[200px] max-h-[100px]"
                        />
                      </div>
                      <div className="border-t-2 border-gray-900 inline-block px-8 pt-2">
                        <p className="text-base font-semibold text-gray-900">
                          Direktur Utama
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="text-gray-400 italic py-12">
                      Menunggu Tanda Tangan
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer Info */}
            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-500">
                Dokumen dibuat pada:{" "}
                {new Date(baData.createdAt).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}{" "}
                WIB
              </p>
              {baData.approvedAt && (
                <p className="text-sm text-gray-500 mt-1">
                  Disetujui pada:{" "}
                  {new Date(baData.approvedAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}{" "}
                  WIB
                </p>
              )}
              <p className="text-xs text-gray-400 mt-2">
                Dokumen ini dibuat secara digital melalui sistem Accenprove
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          .print\\:hidden {
            display: none !important;
          }
          header,
          footer,
          .bg-gray-50 {
            background: white !important;
          }
        }
      `}</style>
    </div>
  );
}
