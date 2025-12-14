"use client";

import { useAuth } from "@/contexts/AuthContext";
import { getBAById, approveBA, rejectBA } from "@/lib/ba-api";
import type { BAData } from "@/lib/ba-api";
import toast from "react-hot-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { StatusRibbon } from "@/components/ba/StatusRibbon";
import { BATimeline } from "@/components/ba/BATimeline";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";

export default function DetailBeritaAcara() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const printRef = useRef<HTMLDivElement>(null);

  const [baData, setBAData] = useState<BAData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user, loading: authLoading } = useAuth();

  // Approve/Reject Modal States
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const signatureCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (authLoading) return;

    async function fetchBA() {
      try {
        const ba = await getBAById(parseInt(id));
        setBAData(ba);
      } catch (err: any) {
        console.error("Error fetching BA:", err);
        setError(err.message || "Failed to load BA");
        setTimeout(() => router.push("/dashboard"), 2000);
      } finally {
        setLoading(false);
      }
    }

    fetchBA();
  }, [id, authLoading, router]);

  // Initialize signature canvas
  useEffect(() => {
    const canvas = signatureCanvasRef.current;
    if (canvas && showApproveModal) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
      }
    }
  }, [showApproveModal]);

  // Signature drawing helpers
  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = signatureCanvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let clientX: number, clientY: number;

    if ('touches' in e) {
      // Touch event
      const touch = e.touches[0] || e.changedTouches[0];
      clientX = touch.clientX;
      clientY = touch.clientY;
    } else {
      // Mouse event
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  // Signature drawing handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    setIsDrawing(true);
    const canvas = signatureCanvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (ctx && canvas) {
      const { x, y } = getCoordinates(e);
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!isDrawing) return;
    const canvas = signatureCanvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (ctx && canvas) {
      const { x, y } = getCoordinates(e);
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = signatureCanvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (ctx && canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  // Approve BA handler
  const handleApprove = async () => {
    setIsSubmitting(true);
    setSubmitError("");

    try {
      const canvas = signatureCanvasRef.current;
      if (!canvas) {
        throw new Error("Canvas not found");
      }

      // Check if signature exists
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
          throw new Error("Silakan bubuhkan tanda tangan terlebih dahulu!");
        }
      }

      const signatureData = canvas.toDataURL();
      const loadingToast = toast.loading("Menyetujui Berita Acara...");

      await approveBA(parseInt(id), signatureData);

      // Refresh BA data
      const updatedBA = await getBAById(parseInt(id));
      setBAData(updatedBA);

      setShowApproveModal(false);
      toast.success("Berita Acara berhasil disetujui!", { id: loadingToast });
    } catch (error: any) {
      console.error("Error approving BA:", error);
      setSubmitError(error.message || "Failed to approve BA");
      toast.error(error.message || "Gagal menyetujui BA");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reject BA handler
  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      setSubmitError("Alasan penolakan harus diisi!");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");
    const loadingToast = toast.loading("Menolak Berita Acara...");

    try {
      await rejectBA(parseInt(id), rejectionReason);

      // Refresh BA data
      const updatedBA = await getBAById(parseInt(id));
      setBAData(updatedBA);

      setShowRejectModal(false);
      setRejectionReason("");
      toast.success("Berita Acara telah ditolak.", { id: loadingToast });
    } catch (error: any) {
      console.error("Error rejecting BA:", error);
      setSubmitError(error.message || "Failed to reject BA");
      toast.error(error.message || "Gagal menolak BA", { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!baData) return;
    
    const loadingToast = toast.loading("Mengunduh PDF...");

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
      doc.text(`Nomor Kontrak/Resi/Lainnya: ${baData.nomorKontrak}`, 20, yPos);
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

      doc.text(`Jumlah Barang/Pekerjaan: ${baData.jumlahBarang}`, 20, yPos);
      yPos += 6;
      doc.text(`Kondisi Barang/Pekerjaan: ${baData.kondisiBarang}`, 20, yPos);
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
      toast.success("PDF berhasil diunduh!", { id: loadingToast });
    }).catch((error) => {
      console.error("Error generating PDF:", error);
      toast.error("Gagal mengunduh PDF", { id: loadingToast });
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const getStatusBadge = () => {
    if (!baData) return null;

    const statusConfig = {
      PENDING: {
        bg: "bg-gradient-to-r from-yellow-100 to-orange-100",
        text: "text-yellow-800",
        border: "border-yellow-300",
        label: "Menunggu Persetujuan Direksi",
        icon: (
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
              clipRule="evenodd"
            />
          </svg>
        ),
      },
      APPROVED: {
        bg: "bg-gradient-to-r from-green-100 to-emerald-100",
        text: "text-green-800",
        border: "border-green-300",
        label: "Disetujui",
        icon: (
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        ),
      },
      REJECTED: {
        bg: "bg-gradient-to-r from-red-100 to-pink-100",
        text: "text-red-800",
        border: "border-red-300",
        label: "Ditolak",
        icon: (
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
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
        className={`inline-flex items-center px-5 py-2.5 rounded-xl text-base font-bold border-2 ${config.bg} ${config.text} ${config.border} shadow-sm`}
      >
        {config.icon}
        {config.label}
      </span>
    );
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50/20">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-200 border-t-primary-600 mx-auto mb-4"></div>
              <div className="absolute inset-0 rounded-full bg-primary-100/20 blur-xl"></div>
            </div>
            <p className="text-gray-700 font-medium text-lg">Memuat data BA...</p>
            <p className="text-gray-500 text-sm mt-2">Harap tunggu sebentar</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return null; // Middleware will handle redirect
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50/20">
      <Navbar />

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Action Buttons - No Print */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-6 mb-6 print:hidden">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleDownloadPDF}
              className="flex-1 min-w-[200px] bg-gradient-to-r from-primary-600 to-primary-700 text-white py-3 px-6 rounded-xl text-base font-bold hover:scale-105 transition-transform flex items-center justify-center shadow-md"
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
              className="flex-1 min-w-[200px] bg-white border-2 border-primary-600 text-primary-600 py-3 px-6 rounded-xl text-base font-bold hover:bg-primary-50 transition-colors flex items-center justify-center"
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
              className="min-w-[200px] bg-white border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-xl text-base font-bold hover:bg-gray-50 transition-colors flex items-center justify-center"
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

        {/* Direksi Action Buttons - Only show for PENDING BA */}
        {user.role === "direksi" && baData.status === "PENDING" && (
          <div className="bg-white border-2 border-primary-200 rounded-2xl shadow-lg p-6 mb-6 print:hidden">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Aksi Direksi</h3>
                <p className="text-sm text-gray-600">Setujui atau tolak berita acara ini</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowApproveModal(true)}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-700 text-white py-3 px-6 rounded-xl text-base font-bold hover:scale-105 transition-transform flex items-center justify-center shadow-md"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Setujui BA
              </button>
              <button
                onClick={() => setShowRejectModal(true)}
                className="flex-1 bg-gradient-to-r from-red-600 to-pink-700 text-white py-3 px-6 rounded-xl text-base font-bold hover:scale-105 transition-transform flex items-center justify-center shadow-md"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                Tolak BA
              </button>
            </div>
          </div>
        )}

        {/* Rejection Notes Alert - Show if BA is rejected */}
        {baData.status === "REJECTED" && baData.rejectionReason && (
          <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-300 rounded-2xl p-6 mb-6 print:hidden shadow-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="h-6 w-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="ml-4 flex-1">
                <h3 className="text-base font-bold text-red-900">BA Ditolak</h3>
                <p className="text-sm text-red-800 mt-2 leading-relaxed">{baData.rejectionReason}</p>
                {user.role === "vendor" && (
                  <button
                    onClick={() => router.push(`/ba/create?edit=${baData.id}`)}
                    className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold text-sm"
                  >
                    Edit dan Submit Ulang
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Document Preview */}
        <div
          ref={printRef}
          className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden"
        >
          {/* Status Ribbon */}
          <div className="print:hidden">
            <StatusRibbon status={baData.status} />
          </div>

          {/* Document Header */}
          <div className="bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 px-8 py-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-white/5"></div>
            <div className="relative z-10">
              <h2 className="text-3xl font-bold text-white mb-3">
                {jenisBALengkap.toUpperCase()}
              </h2>
              <p className="text-white text-xl font-semibold">Nomor: {baData.nomorBA}</p>
            </div>
          </div>

          {/* Document Body */}
          <div className="p-8">
            {/* Informasi Kontrak */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-primary-600">
                INFORMASI KONTRAK
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-1">
                    Nomor Kontrak / Resi / Lainnya
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
              {baData.rejectedAt && (
                <p className="text-sm text-gray-500 mt-1">
                  Ditolak pada:{" "}
                  {new Date(baData.rejectedAt).toLocaleDateString("id-ID", {
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

        {/* Timeline Section */}
        <div className="mt-8 print:hidden">
          <BATimeline baData={baData} />
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

      {/* Approve Modal */}
      {showApproveModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 border border-gray-200 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Setujui Berita Acara</h3>
                <p className="text-sm text-gray-600 mt-1">Bubuhkan tanda tangan digital Anda</p>
              </div>
            </div>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Dengan menyetujui BA ini, Anda menyatakan bahwa semua informasi telah diperiksa dan disetujui.
            </p>

            {/* Signature Canvas */}
            <div className="mb-6">
              <label className="block text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Tanda Tangan Direksi <span className="text-red-500">*</span>
              </label>
              <div className="border-2 border-primary-300 rounded-xl p-5 bg-gradient-to-br from-gray-50 to-primary-50/30">
                <canvas
                  ref={signatureCanvasRef}
                  width={600}
                  height={200}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  className="w-full h-48 bg-white border-2 border-dashed border-gray-300 rounded-lg cursor-crosshair shadow-inner"
                  style={{ touchAction: "none" }}
                />
                <button
                  type="button"
                  onClick={clearSignature}
                  className="mt-3 px-4 py-2 text-sm bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Hapus Tanda Tangan
                </button>
              </div>
            </div>

            {submitError && (
              <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
                <p className="text-sm text-red-700 font-medium">{submitError}</p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setShowApproveModal(false)}
                disabled={isSubmitting}
                className="flex-1 bg-white border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleApprove}
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-700 text-white py-3 rounded-xl font-bold hover:scale-105 disabled:opacity-50 flex items-center justify-center gap-2 transition-transform shadow-md"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Memproses...
                  </>
                ) : (
                  "Setujui BA"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 border border-gray-200 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Tolak Berita Acara</h3>
                <p className="text-sm text-gray-600 mt-1">Berikan alasan penolakan</p>
              </div>
            </div>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Berikan alasan penolakan agar vendor dapat memperbaiki BA ini.
            </p>

            <div className="mb-6">
              <label className="block text-base font-semibold text-gray-900 mb-3">
                Alasan Penolakan <span className="text-red-500">*</span>
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
                placeholder="Contoh: Data barang tidak sesuai dengan kontrak..."
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 hover:border-gray-400 transition-all resize-none"
              />
            </div>

            {submitError && (
              <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
                <p className="text-sm text-red-700 font-medium">{submitError}</p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionReason("");
                  setSubmitError("");
                }}
                disabled={isSubmitting}
                className="flex-1 bg-white border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleReject}
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-red-600 to-pink-700 text-white py-3 rounded-xl font-bold hover:scale-105 disabled:opacity-50 flex items-center justify-center gap-2 transition-transform shadow-md"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Memproses...
                  </>
                ) : (
                  "Tolak BA"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
