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
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <span className="ml-4 text-gray-600">Memuat data...</span>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="text-center text-gray-500">
          <p className="text-lg font-medium">Tidak ada data BA</p>
          <p className="text-sm mt-2">Coba ubah filter atau buat BA baru</p>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Pending" },
      APPROVED: { bg: "bg-green-100", text: "text-green-800", label: "Approved" },
      REJECTED: { bg: "bg-red-100", text: "text-red-800", label: "Rejected" },
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const getJenisBadge = (jenis: string) => {
    return (
      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
        {jenis}
      </span>
    );
  };

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden md:block bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nomor BA
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipe
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vendor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tanggal Dibuat
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item) => (
              <tr key={item.ba.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{item.ba.nomorBA}</div>
                  <div className="text-xs text-gray-500">{item.ba.nomorKontrak}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getJenisBadge(item.ba.jenisBA)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{item.ba.namaVendor}</div>
                  {item.vendor && (
                    <div className="text-xs text-gray-500">{item.vendor.email}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(item.ba.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(item.ba.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <Link
                    href={`/ba/${item.ba.id}`}
                    className="text-primary-600 hover:text-primary-900 font-medium"
                  >
                    Lihat Detail →
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
          <div key={item.ba.id} className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h3 className="text-sm font-bold text-gray-900">{item.ba.nomorBA}</h3>
                <p className="text-xs text-gray-500 mt-1">{item.ba.nomorKontrak}</p>
              </div>
              <div className="ml-2">
                {getJenisBadge(item.ba.jenisBA)}
              </div>
            </div>

            <div className="space-y-2 mb-3">
              <div className="flex items-center text-sm">
                <span className="text-gray-500 w-24">Vendor:</span>
                <span className="text-gray-900 font-medium">{item.ba.namaVendor}</span>
              </div>
              <div className="flex items-center text-sm">
                <span className="text-gray-500 w-24">Tanggal:</span>
                <span className="text-gray-900">{formatDate(item.ba.createdAt)}</span>
              </div>
              <div className="flex items-center text-sm">
                <span className="text-gray-500 w-24">Status:</span>
                {getStatusBadge(item.ba.status)}
              </div>
            </div>

            <div className="pt-3 border-t border-gray-200">
              <Link
                href={`/ba/${item.ba.id}`}
                className="block w-full text-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium text-sm"
              >
                Lihat Detail
              </Link>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
