"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import SignatureCanvas from "react-signature-canvas";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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
  namaDireksi?: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  approvedAt?: string;
}

export default function DetailBeritaAcara() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const printRef = useRef<HTMLDivElement>(null);
  const sigCanvasRef = useRef<SignatureCanvas>(null);

  const [baData, setBAData] = useState<BAData | null>(null);
  const [loading, setLoading] = useState(true);
  const [ttd, setTtd] = useState(""); // base64 tanda tangan
  const [namaDireksi, setNamaDireksi] = useState(""); // Nama Direksi input

  useEffect(() => {
    const allBA = JSON.parse(localStorage.getItem("beritaAcara") || "[]");
    const foundBA = allBA.find((ba: BAData) => ba.id.toString() === id);
    if (foundBA) {
      setBAData(foundBA);

      // Load nama Direksi lama
      if (foundBA.namaDireksi) setNamaDireksi(foundBA.namaDireksi);

      // Load TTD lama ke canvas
      if (foundBA.signatureDireksi) setTtd(foundBA.signatureDireksi);
      setTimeout(() => {
        if (foundBA.signatureDireksi && sigCanvasRef.current) {
          sigCanvasRef.current.fromDataURL(foundBA.signatureDireksi);
        }
      }, 100);
    } else {
      alert("Berita Acara tidak ditemukan");
      router.push("/dashboard");
    }
    setLoading(false);
  }, [id, router]);

  // Save dari canvas ke state
  const handleSaveTTD = () => {
    if (!sigCanvasRef.current) return;
    if (sigCanvasRef.current.isEmpty()) {
      alert("Tanda tangan kosong!");
      return;
    }
    const dataURL = sigCanvasRef.current.toDataURL("image/png");
    setTtd(dataURL);
    alert("Tanda tangan disimpan! Silakan update status untuk menyetujui.");
  };

  // Upload file TTD
  const handleUploadTTD = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setTtd(base64);
      if (sigCanvasRef.current) {
        sigCanvasRef.current.fromDataURL(base64);
      }
    };
    reader.readAsDataURL(file);
  };

  // Update status (approve/reject/revisi)
  const handleStatusChange = (newStatus: BAData["status"]) => {
    if (!baData) return;
    if ((newStatus === "APPROVED" || newStatus === "REJECTED") && !ttd) {
      alert("Mohon isi tanda tangan Direksi terlebih dahulu!");
      return;
    }

    const allBA = JSON.parse(localStorage.getItem("beritaAcara") || "[]");
    const updatedBA = allBA.map((ba: BAData) =>
      ba.id === baData.id
        ? {
            ...ba,
            signatureDireksi: ttd || ba.signatureDireksi,
            namaDireksi: namaDireksi,
            status: newStatus,
            approvedAt:
              newStatus === "APPROVED"
                ? new Date().toISOString()
                : ba.approvedAt,
          }
        : ba
    );

    localStorage.setItem("beritaAcara", JSON.stringify(updatedBA));
    setBAData({
      ...baData,
      signatureDireksi: ttd || baData.signatureDireksi,
      namaDireksi: namaDireksi,
      status: newStatus,
      approvedAt:
        newStatus === "APPROVED" ? new Date().toISOString() : baData.approvedAt,
    });
    alert(`Status diperbarui menjadi ${newStatus}`);
  };

  const handleDownloadPDF = async () => {
    if (!baData) return;
    const { default: jsPDF } = await import("jspdf");
    const doc = new jsPDF();

    const title =
      baData.jenisBA === "BAPB"
        ? "BERITA ACARA PEMERIKSAAN BARANG"
        : "BERITA ACARA PENERIMAAN PEKERJAAN";
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text(title, 105, 20, { align: "center" });
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Nomor: ${baData.nomorBA}`, 105, 28, { align: "center" });

    doc.setLineWidth(0.5);
    doc.line(20, 32, 190, 32);

    let y = 40;
    doc.setFont("helvetica", "bold");
    doc.text("INFORMASI KONTRAK", 20, y);
    y += 8;
    doc.setFont("helvetica", "normal");
    doc.text(`Nomor Kontrak: ${baData.nomorKontrak}`, 20, y);
    y += 6;
    doc.text(`Tanggal Pemeriksaan: ${baData.tanggalPemeriksaan}`, 20, y);
    y += 6;
    doc.text(`Lokasi Pemeriksaan: ${baData.lokasiPemeriksaan}`, 20, y);
    y += 10;

    doc.setFont("helvetica", "bold");
    doc.text("INFORMASI VENDOR", 20, y);
    y += 8;
    doc.setFont("helvetica", "normal");
    doc.text(`Nama Vendor: ${baData.namaVendor}`, 20, y);
    y += 6;
    doc.text(`PIC: ${baData.namaPIC}`, 20, y);
    y += 6;
    doc.text(`Jabatan PIC: ${baData.jabatanPIC}`, 20, y);
    y += 10;

    doc.setFont("helvetica", "bold");
    doc.text("DETAIL BARANG/PEKERJAAN", 20, y);
    y += 8;
    doc.setFont("helvetica", "normal");
    doc.text("Keterangan:", 20, y);
    y += 6;
    const descLines = doc.splitTextToSize(baData.deskripsiBarang, 170);
    doc.text(descLines, 20, y);
    y += descLines.length * 6;
    doc.text(`Jumlah: ${baData.jumlahBarang}`, 20, y);
    y += 6;
    doc.text(`Kondisi: ${baData.kondisiBarang}`, 20, y);
    y += 10;

    if (baData.keterangan) {
      doc.setFont("helvetica", "bold");
      doc.text("KETERANGAN", 20, y);
      y += 8;
      doc.setFont("helvetica", "normal");
      const ketLines = doc.splitTextToSize(baData.keterangan, 170);
      doc.text(ketLines, 20, y);
      y += ketLines.length * 6 + 10;
      y += 10;
    }
    y += 10;

    doc.setFont("helvetica", "bold");
    doc.text("Vendor", 30, y - 25);
    doc.text("Direksi", 110, y - 25);
    y += 10;

    if (baData.signatureVendor)
      doc.addImage(baData.signatureVendor, "PNG", 30, y - 20, 40, 15);
    if (baData.signatureDireksi)
      doc.addImage(baData.signatureDireksi, "PNG", 110, y - 20, 40, 15);

    doc.text("(_________________)", 30, y);
    doc.text("(_________________)", 110, y);
    y += 6;
    doc.text(baData.namaPIC, 30, y);
    doc.text(namaDireksi || "Direktur Utama", 110, y);

    const createdDate = new Date(baData.createdAt).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    doc.setFontSize(10);
    doc.text(`Dokumen dibuat pada: ${createdDate} WIB`, 105, 280, {
      align: "center",
    });

    doc.save(`BA_${baData.nomorBA.replace(/\//g, "_")}.pdf`);
  };

  const handlePrint = () => window.print();

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Memuat data...</div>
      </div>
    );

  if (!baData) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userRole="direksi" userName="Budi Santoso" />

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Buttons */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6 print:hidden flex flex-wrap gap-3">
          <button
            onClick={handleDownloadPDF}
            className="bg-primary-600 text-white py-3 px-6 rounded-lg flex-1"
          >
            Download PDF
          </button>
          <button
            onClick={handlePrint}
            className="bg-white border-2 border-primary-600 text-primary-600 py-3 px-6 rounded-lg flex-1"
          >
            Print
          </button>
          <button
            onClick={() => router.push("/direksi")}
            className="bg-gray-100 border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-lg flex-1"
          >
            Kembali ke Dashboard
          </button>
        </div>

        {/* BA Preview */}
        <div
          ref={printRef}
          className="bg-white rounded-lg shadow-md overflow-hidden p-6"
        >
          <div className="bg-primary-600 px-8 py-6 text-center text-white">
            <h2 className="text-2xl font-bold">
              {baData.jenisBA} - {baData.nomorBA}
            </h2>
          </div>

          <div className="space-y-6 mt-6">
            {/* Informasi Kontrak */}
            <div>
              <h3 className="font-bold text-lg mb-2">INFORMASI KONTRAK</h3>
              <p>Nomor Kontrak: {baData.nomorKontrak}</p>
              <p>Tanggal Pemeriksaan: {baData.tanggalPemeriksaan}</p>
              <p>Lokasi: {baData.lokasiPemeriksaan}</p>
            </div>

            {/* Informasi Vendor */}
            <div>
              <h3 className="font-bold text-lg mb-2">INFORMASI VENDOR</h3>
              <p>Nama Vendor: {baData.namaVendor}</p>
              <p>PIC: {baData.namaPIC}</p>
              <p>Jabatan: {baData.jabatanPIC}</p>
            </div>

            {/* Detail Barang */}
            <div>
              <h3 className="font-bold text-lg mb-2">
                DETAIL BARANG/PEKERJAAN
              </h3>
              <p>{baData.deskripsiBarang}</p>
              <p>Jumlah: {baData.jumlahBarang}</p>
              <p>Kondisi: {baData.kondisiBarang}</p>
            </div>

            {/* Keterangan */}
            {baData.keterangan && (
              <div>
                <h3 className="font-bold text-lg mb-2">KETERANGAN</h3>
                <p>{baData.keterangan}</p>
              </div>
            )}

            {/* TTD Direksi */}
            <div className="grid grid-cols-2 gap-8 mt-12 border-t-2 pt-8">
              {/* Vendor */}
              <div className="text-center">
                <p className="font-semibold mb-2">Vendor</p>
                {baData.signatureVendor && (
                  <img
                    src={baData.signatureVendor}
                    alt="Tanda Tangan Vendor"
                    className="mx-auto border rounded max-h-[100px]"
                  />
                )}
                <p>{baData.namaPIC}</p>
                <p>{baData.jabatanPIC}</p>
              </div>

              {/* Direksi */}
              <div className="text-center">
                <p className="font-semibold mb-2">Direksi</p>

                {/* Canvas TTD */}
                <SignatureCanvas
                  penColor="black"
                  canvasProps={{
                    width: 300,
                    height: 100,
                    className: "border rounded mx-auto",
                    style: { backgroundColor: "#fff" },
                  }}
                  ref={sigCanvasRef}
                />

                {/* Tombol Clear / Simpan / Upload */}
                <div className="mt-2 flex justify-center gap-2">
                  <button
                    onClick={() => sigCanvasRef.current?.clear()}
                    className="bg-gray-200 px-3 py-1 rounded"
                  >
                    Clear
                  </button>
                  <button
                    onClick={handleSaveTTD}
                    className="bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    Simpan
                  </button>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleUploadTTD}
                    className="ml-2"
                  />
                </div>

                {/* Input Nama Direksi */}
                <input
                  type="text"
                  placeholder="Nama Direksi"
                  value={namaDireksi}
                  onChange={(e) => setNamaDireksi(e.target.value)}
                  className="mt-2 border rounded-lg px-3 py-1 w-full text-center"
                />

                {/* Status Tersimpan */}
                {ttd && (
                  <p className="mt-1 text-sm text-green-600">
                    Tanda tangan tersimpan
                  </p>
                )}

                <p className="mt-1 font-semibold">Direktur Utama</p>
              </div>
            </div>

            {/* Status Dropdown */}
            <div className="mt-6">
              <label className="block mb-1 font-semibold">
                Status Persetujuan
              </label>
              <select
                value={baData.status}
                onChange={(e) =>
                  handleStatusChange(e.target.value as BAData["status"])
                }
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="PENDING">PENDING</option>
                <option value="APPROVED">APPROVED</option>
                <option value="REJECTED">REJECTED</option>
              </select>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
