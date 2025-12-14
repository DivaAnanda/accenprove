"use client";

import { useState } from "react";
import { Search, Filter, Calendar, ArrowUpDown, X, FileText } from "lucide-react";

interface BAListFiltersProps {
  onFilterChange: (filters: FilterValues) => void;
  role?: string;
}

export interface FilterValues {
  status: string;
  jenisBA: string;
  search: string;
  startDate: string;
  endDate: string;
  sortBy: string;
  sortOrder: string;
  limit: string;
}

export default function BAListFilters({ 
  onFilterChange, 
  role = "vendor"
}: BAListFiltersProps) {
  const [filters, setFilters] = useState<FilterValues>({
    status: "",
    jenisBA: "",
    search: "",
    startDate: "",
    endDate: "",
    sortBy: "createdAt",
    sortOrder: "desc",
    limit: "10",
  });

  const handleFilterChange = (key: keyof FilterValues, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    const resetFilters: FilterValues = {
      status: "",
      jenisBA: "",
      search: "",
      startDate: "",
      endDate: "",
      sortBy: "createdAt",
      sortOrder: "desc",
      limit: "10",
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900">Filter & Pencarian</h3>
        </div>
        
        {/* Reset Button - Top Right */}
        <button
          onClick={handleReset}
          className="group inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-gray-700 hover:text-red-600 bg-gray-100 hover:bg-red-50 rounded-xl transition-all hover:shadow-md hover:scale-105"
        >
          <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
          Reset Filter
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Pencarian
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Nomor BA, vendor, kontrak..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all hover:border-primary-300 bg-white shadow-sm"
            />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <Filter className="w-4 h-4 text-primary-600" />
            Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange("status", e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all hover:border-primary-300 bg-white shadow-sm appearance-none cursor-pointer"
          >
            <option value="">Semua Status</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>

        {/* Jenis BA Filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary-600" />
            Jenis BA
          </label>
          <select
            value={filters.jenisBA}
            onChange={(e) => handleFilterChange("jenisBA", e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all hover:border-primary-300 bg-white shadow-sm appearance-none cursor-pointer"
          >
            <option value="">Semua Jenis</option>
            <option value="BAPB">BAPB</option>
            <option value="BAPP">BAPP</option>
          </select>
        </div>

        {/* Limit Per Page */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <Filter className="w-4 h-4 text-primary-600" />
            Item Per Halaman
          </label>
          <select
            value={filters.limit}
            onChange={(e) => handleFilterChange("limit", e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all hover:border-primary-300 bg-white shadow-sm appearance-none cursor-pointer"
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
            <option value="all">Semua</option>
          </select>
        </div>

        {/* Start Date */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary-600" />
            Dari Tanggal
          </label>
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => handleFilterChange("startDate", e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all hover:border-primary-300 bg-white shadow-sm"
          />
        </div>

        {/* End Date */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary-600" />
            Sampai Tanggal
          </label>
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => handleFilterChange("endDate", e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all hover:border-primary-300 bg-white shadow-sm"
          />
        </div>

        {/* Sort By */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-primary-600" />
            Urutkan Berdasarkan
          </label>
          <select
            value={filters.sortBy}
            onChange={(e) => handleFilterChange("sortBy", e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all hover:border-primary-300 bg-white shadow-sm appearance-none cursor-pointer"
          >
            <option value="createdAt">Tanggal Dibuat</option>
            <option value="status">Status</option>
            <option value="namaVendor">Nama Vendor</option>
          </select>
        </div>

        {/* Sort Order */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-primary-600" />
            Urutan
          </label>
          <select
            value={filters.sortOrder}
            onChange={(e) => handleFilterChange("sortOrder", e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all hover:border-primary-300 bg-white shadow-sm appearance-none cursor-pointer"
          >
            <option value="desc">Terbaru</option>
            <option value="asc">Terlama</option>
          </select>
        </div>
      </div>
    </div>
  );
}
