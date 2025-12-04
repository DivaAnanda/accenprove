"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function DireksiDashboard() {
  const navigationItems = [
    {
      name: "Dashboard",
      href: "/direksi",
      description: "Lihat ringkasan dan statistik utama.",
    },
    {
      name: "Daftar Berita Acara",
      href: "/direksi/ba",
      description: "Kelola dan setujui semua Berita Acara.",
    },
    {
      name: "Profil Pengguna",
      href: "/direksi/profile",
      description: "Atur informasi dan preferensi akun Anda.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar userRole="direksi" userName="Budi Santoso" />

      <main className="flex-grow max-w-7xl mx-auto px-6 py-10 w-full">
        <h1 className="text-3xl font-bold text-gray-900">
          Selamat Datang, Budi Santoso!
        </h1>
        <p className="text-gray-600 mt-1">Pilih menu di bawah untuk memulai.</p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {navigationItems.map((item) => (
            <Link href={item.href} key={item.name}>
              <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md hover:border-primary-300 transition-all duration-300 h-full">
                <h2 className="text-xl font-semibold text-gray-800">
                  {item.name}
                </h2>
                <p className="mt-2 text-gray-500">{item.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
