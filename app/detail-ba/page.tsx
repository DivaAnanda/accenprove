"use client";

import { useRouter } from "next/navigation";
import { useRef } from "react";

export default function DetailBeritaAcara() {
  const router = useRouter();
  const printRef = useRef<HTMLDivElement>(null);

  // Simulasi data BA
  const baData = {
    nomorBA: "BA/2024/11/001",
    jenisBA: "BAPB",
    jenisBALengkap: "Berita Acara Pemeriksaan Barang",
    nomorKontrak: "K-2024/11/001",
    namaVendor: "PT. Vendor Teknologi Indonesia",
    alamatVendor: "Jl. Sudirman No. 123, Jakarta Pusat",
    picVendor: "Budi Santoso",
    emailVendor: "budi@vendortech.com",
    telpVendor: "+62 812-3456-7890",
    tanggalDibuat: new Date().toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    waktuDibuat: "14:30 WIB",
    tanggalPemeriksaan: "25 November 2024",
    lokasiPemeriksaan: "Gudang Pusat Jakarta",
    deskripsiBarang:
      "Komputer Desktop Dell OptiPlex 7010, Spesifikasi: Intel Core i7, RAM 16GB, SSD 512GB",
    jumlahBarang: "25",
    satuanBarang: "Unit",
    kondisiBarang: "Baik - Sesuai Spesifikasi",
    keterangan:
      "Semua barang diterima dalam kondisi baik dan sesuai dengan spesifikasi kontrak.",
    nilaiKontrak: "Rp 625.000.000",
    status: "Menunggu Persetujuan Direksi",
  };

  const handleDownloadPDF = () => {
    // Import jsPDF dinamis untuk client-side
    import("jspdf").then((module) => {
      const jsPDF = module.default;
      const doc = new jsPDF();

      // Header
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text("BERITA ACARA PEMERIKSAAN BARANG", 105, 20, { align: "center" });

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
      doc.text(`Nilai Kontrak: ${baData.nilaiKontrak}`, 20, yPos);
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
      doc.text(`Alamat: ${baData.alamatVendor}`, 20, yPos);
      yPos += 6;
      doc.text(`PIC: ${baData.picVendor}`, 20, yPos);
      yPos += 6;
      doc.text(`Email: ${baData.emailVendor}`, 20, yPos);
      yPos += 6;
      doc.text(`Telepon: ${baData.telpVendor}`, 20, yPos);
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

      doc.text(
        `Jumlah: ${baData.jumlahBarang} ${baData.satuanBarang}`,
        20,
        yPos
      );
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

      doc.text("(_________________)", 30, yPos);
      doc.text("(_________________)", 110, yPos);
      yPos += 6;
      doc.text(baData.picVendor, 30, yPos);
      doc.text("Direktur Utama", 110, yPos);

      // Footer
      doc.setFontSize(10);
      doc.text(
        `Dokumen dibuat pada: ${baData.tanggalDibuat}, ${baData.waktuDibuat}`,
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - No Print */}
      <header className="bg-white shadow-sm border-b print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-teal-700">Accenprove</h1>
            <button
              onClick={() => router.back()}
              className="text-sm text-gray-600 hover:text-gray-900 font-medium"
            >
              ← Kembali
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Action Buttons - No Print */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6 print:hidden">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleDownloadPDF}
              className="flex-1 min-w-[200px] bg-teal-700 text-white py-3 px-6 rounded-lg text-base font-bold hover:bg-teal-800 transition-colors flex items-center justify-center"
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
              className="flex-1 min-w-[200px] bg-white border-2 border-teal-700 text-teal-700 py-3 px-6 rounded-lg text-base font-bold hover:bg-teal-50 transition-colors flex items-center justify-center"
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
          </div>
        </div>

        {/* Document Preview */}
        <div
          ref={printRef}
          className="bg-white rounded-lg shadow-md overflow-hidden"
        >
          {/* Document Header */}
          <div className="bg-teal-700 px-8 py-6 text-center">
            <h2 className="text-2xl font-bold text-white mb-2">
              BERITA ACARA PEMERIKSAAN BARANG
            </h2>
            <p className="text-white text-lg">Nomor: {baData.nomorBA}</p>
          </div>

          {/* Document Body */}
          <div className="p-8">
            {/* Status Badge */}
            <div className="mb-6 print:hidden">
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold border-2 bg-yellow-100 text-yellow-800 border-yellow-300">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                    clipRule="evenodd"
                  />
                </svg>
                {baData.status}
              </span>
            </div>

            {/* Informasi Kontrak */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-teal-600">
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
                    Nilai Kontrak
                  </p>
                  <p className="text-base font-semibold text-gray-900">
                    {baData.nilaiKontrak}
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
              <h3 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-teal-600">
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
                      {baData.picVendor}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm font-semibold text-gray-600 mb-1">
                      Alamat
                    </p>
                    <p className="text-base font-semibold text-gray-900">
                      {baData.alamatVendor}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600 mb-1">
                      Email
                    </p>
                    <p className="text-base font-semibold text-gray-900">
                      {baData.emailVendor}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600 mb-1">
                      Telepon
                    </p>
                    <p className="text-base font-semibold text-gray-900">
                      {baData.telpVendor}
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
                      Tanda Tangan Digital Telah Dibubuhkan
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Detail Barang */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-teal-600">
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
                      {baData.jumlahBarang} {baData.satuanBarang}
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
                <h3 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-teal-600">
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
                  <p className="text-base font-semibold text-gray-900 mb-16">
                    Vendor
                  </p>
                  <div className="border-t-2 border-gray-900 inline-block px-8 pt-2">
                    <p className="text-base font-semibold text-gray-900">
                      {baData.picVendor}
                    </p>
                  </div>
                </div>

                {/* Direksi */}
                <div className="text-center">
                  <p className="text-base font-semibold text-gray-900 mb-16">
                    Direksi
                  </p>
                  <div className="border-t-2 border-gray-900 inline-block px-8 pt-2">
                    <p className="text-base font-semibold text-gray-900">
                      Direktur Utama
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Info */}
            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-500">
                Dokumen dibuat pada: {baData.tanggalDibuat},{" "}
                {baData.waktuDibuat}
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Dokumen ini dibuat secara digital melalui sistem Accenprove
              </p>
            </div>
          </div>
        </div>
      </main>

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
          .bg-gray-50 {
            background: white !important;
          }
        }
      `}</style>
    </div>
  );
}
