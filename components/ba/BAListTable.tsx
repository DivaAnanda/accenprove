"use client";

import Link from "next/link";
import { formatDate } from "@/lib/utils";

interface BAItem {
  ba: {
    id: number;
    nomorBA: string;
    jenisBA: "BAPB" | "BAPP";
    namaVendor: string;
    status: "PENDING" | "APPROVED" | "REJECTED";
    createdAt: Date;
    nomorKontrak: string;
    deskripsiBarang: string;
  };
  vendor: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  } | null;
}

interface BAListTableProps {
  data: BAItem[];
  loading?: boolean;
}

export default function BAListTable({ data, loading = false }: BAListTableProps) {
  if (loading) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-12">
        <div className="flex flex-col items-center justify-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-200 border-t-primary-600"></div>
            <div className="absolute inset-0 rounded-full bg-primary-100/20 blur-xl"></div>
          </div>
          <span className="mt-6 text-gray-700 font-medium text-lg">Memuat data BA...</span>
          <span className="mt-2 text-gray-500 text-sm">Harap tunggu sebentar</span>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-12">
        <div className="text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-xl font-bold text-gray-900 mb-2">Tidak Ada Data BA</p>
          <p className="text-gray-600">Coba ubah filter atau buat BA baru untuk memulai</p>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { bg: "bg-gradient-to-r from-yellow-100 to-orange-100", text: "text-yellow-800", border: "border-yellow-300", label: "Pending" },
      APPROVED: { bg: "bg-gradient-to-r from-green-100 to-emerald-100", text: "text-green-800", border: "border-green-300", label: "Approved" },
      REJECTED: { bg: "bg-gradient-to-r from-red-100 to-pink-100", text: "text-red-800", border: "border-red-300", label: "Rejected" },
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;
    return (
      <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold ${config.bg} ${config.text} border ${config.border} shadow-sm`}>
        {config.label}
      </span>
    );
  };

  const getJenisBadge = (jenis: string) => {
    return (
      <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 border border-blue-300 shadow-sm">
        {jenis}
      </span>
    );
  };

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden md:block bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                Nomor BA
              </th>
              <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                Tipe
              </th>
              <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                Vendor
              </th>
              <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                Tanggal Dibuat
              </th>
              <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item) => (
              <tr key={item.ba.id} className="group hover:bg-primary-50/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-left">
                  <div className="text-sm font-bold text-gray-900">{item.ba.nomorBA}</div>
                  <div className="text-xs text-gray-500">{item.ba.nomorKontrak}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  {getJenisBadge(item.ba.jenisBA)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-left">
                  <div className="text-sm text-gray-900 font-medium">{item.ba.namaVendor}</div>
                  {item.vendor && (
                    <div className="text-xs text-gray-500">{item.vendor.email}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center">
                  {formatDate(item.ba.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  {getStatusBadge(item.ba.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                  <Link
                    href={`/ba/${item.ba.id}`}
                    className="inline-flex items-center gap-1.5 text-primary-600 hover:text-primary-800 hover:underline transition-colors font-medium"
                  >
                    Lihat Detail
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {data.map((item) => (
          <div key={item.ba.id} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-5 border border-gray-200 hover:-translate-y-1 transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-sm font-bold text-gray-900">{item.ba.nomorBA}</h3>
                <p className="text-xs text-gray-500 mt-1">{item.ba.nomorKontrak}</p>
              </div>
              <div className="ml-2">
                {getJenisBadge(item.ba.jenisBA)}
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center text-sm">
                <span className="text-gray-500 w-24 font-medium">Vendor:</span>
                <span className="text-gray-900 font-semibold">{item.ba.namaVendor}</span>
              </div>
              <div className="flex items-center text-sm">
                <span className="text-gray-500 w-24 font-medium">Tanggal:</span>
                <span className="text-gray-900">{formatDate(item.ba.createdAt)}</span>
              </div>
              <div className="flex items-center text-sm">
                <span className="text-gray-500 w-24 font-medium">Status:</span>
                {getStatusBadge(item.ba.status)}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <Link
                href={`/ba/${item.ba.id}`}
                className="flex items-center justify-center gap-2 w-full text-primary-600 hover:text-primary-800 hover:underline transition-colors font-medium text-sm"
              >
                Lihat Detail
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
