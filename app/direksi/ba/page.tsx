"use client";

import { useEffect, useState } from "react";
import { getAllBA, BAData } from "@/lib/ba-storage";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

const statusLabelMap: Record<string, string> = {
  PENDING: "Menunggu Persetujuan",
  APPROVED: "Disetujui",
  REJECTED: "Ditolak",
};

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    APPROVED: "bg-green-100 text-green-700",
    PENDING: "bg-yellow-100 text-yellow-700",
    REJECTED: "bg-red-100 text-red-700",
  };
  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-medium ${
        colors[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {statusLabelMap[status] || status}
    </span>
  );
}

export default function Page() {
  const [data, setData] = useState<BAData[]>([]);
  const [filteredData, setFilteredData] = useState<BAData[]>([]);

  const [search, setSearch] = useState("");
  const [jenisFilter, setJenisFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  useEffect(() => {
    const allBA = getAllBA();
    setData(allBA);
    setFilteredData(allBA);
  }, []);

  // Apply filter
  useEffect(() => {
    let temp = data;

    if (search) {
      temp = temp.filter(
        (ba) =>
          ba.nomorBA.toLowerCase().includes(search.toLowerCase()) ||
          ba.nomorKontrak.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (jenisFilter) {
      temp = temp.filter((ba) => ba.jenisBA === jenisFilter);
    }

    if (statusFilter) {
      temp = temp.filter((ba) => ba.status === statusFilter);
    }

    setFilteredData(temp);
    setCurrentPage(1); // reset page kalau filter berubah
  }, [search, jenisFilter, statusFilter, data, itemsPerPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      <Navbar userRole="direksi" userName="Budi Santoso" />
      <main className="max-w-7xl mx-auto px-6 py-10 min-h-screen">
        <h1 className="text-3xl font-bold text-gray-900">
          Daftar Berita Acara
        </h1>
        <p className="text-gray-600 mt-1">
          Kelola dan pantau semua Berita Acara yang telah dibuat dalam sistem
        </p>

        {/* Filter */}
        <div className="bg-white border rounded-xl p-6 mt-6 shadow-sm">
          <p className="text-lg font-semibold mb-4">Filter & Pencarian</p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Cari nomor BA atau kontrak..."
              className="border rounded-lg px-3 py-2 w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              className="border rounded-lg px-3 py-2 w-full"
              value={jenisFilter}
              onChange={(e) => setJenisFilter(e.target.value)}
            >
              <option value="">Jenis BA</option>
              <option value="BAPP">BAPP</option>
              <option value="BAPB">BAPB</option>
            </select>

            <select
              className="border rounded-lg px-3 py-2 w-full"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">Status</option>
              <option value="PENDING">PENDING</option>
              <option value="APPROVED">APPROVED</option>
              <option value="REJECTED">REJECTED</option>
            </select>

            <button
              className="border rounded-lg px-3 py-2 hover:bg-gray-50"
              onClick={() => {
                setSearch("");
                setJenisFilter("");
                setStatusFilter("");
              }}
            >
              Reset Filter
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="mt-8">
          <p className="text-gray-700 mb-2">
            Menampilkan {paginatedData.length} dari {filteredData.length} Berita
            Acara
          </p>

          <div className="overflow-x-auto border rounded-xl bg-white shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-gray-100">
                <tr className="text-gray-600">
                  <th className="p-3">Nomor BA</th>
                  <th className="p-3">Jenis</th>
                  <th className="p-3">Vendor</th>
                  <th className="p-3">Nomor Kontrak</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Tanggal</th>
                  <th className="p-3">Aksi</th>
                </tr>
              </thead>

              <tbody>
                {paginatedData.map((row: BAData) => (
                  <tr key={row.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 text-primary-600">{row.nomorBA}</td>
                    <td className="p-3">{row.jenisBA}</td>
                    <td className="p-3">{row.namaVendor}</td>
                    <td className="p-3">{row.nomorKontrak}</td>
                    <td className="p-3">
                      <StatusBadge status={row.status} />
                    </td>
                    <td className="p-3">
                      {new Date(row.createdAt).toLocaleDateString("id-ID")}
                    </td>
                    <td className="p-3">
                      <Link
                        href={`/direksi/ba/${row.id}`}
                        className="text-gray-600 hover:text-primary-600"
                      >
                        👁 Lihat
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <div>
              <label
                htmlFor="itemsPerPage"
                className="text-sm text-gray-600 mr-2"
              >
                Baris per halaman:
              </label>
              <select
                id="itemsPerPage"
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1); // Reset ke halaman pertama saat jumlah baris diubah
                }}
                className="border rounded-lg px-2 py-1 text-sm"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Sebelumnya
              </button>
              <span>
                Halaman {currentPage} dari {totalPages > 0 ? totalPages : 1}
              </span>
              <button
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Berikutnya
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
