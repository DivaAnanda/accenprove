"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function Footer() {
  const { user } = useAuth();

  // Menu items based on role (same logic as Navbar)
  const getMenuItems = () => {
    if (!user) {
      return [
        { label: "Beranda", href: "/" },
        { label: "Tentang", href: "/tentang" },
        { label: "Pengajuan BA", href: "/pengajuan-ba" },
        { label: "Masuk", href: "/login" },
        { label: "Daftar", href: "/register" },
      ];
    }

    switch (user.role) {
      case "admin":
        return [
          { label: "Dashboard", href: "/dashboard" },
          { label: "Daftar BA", href: "/ba" },
          { label: "Daftar User", href: "/users" },
          { label: "Profile", href: "/profile" },
          { label: "Tentang", href: "/tentang" },
          { label: "Pengajuan BA", href: "/pengajuan-ba" },
        ];
      case "direksi":
        return [
          { label: "Dashboard", href: "/dashboard" },
          { label: "Daftar BA", href: "/ba" },
          { label: "Profile", href: "/profile" },
          { label: "Tentang", href: "/tentang" },
          { label: "Pengajuan BA", href: "/pengajuan-ba" },
        ];
      case "dk":
        return [
          { label: "Dashboard", href: "/dashboard" },
          { label: "Daftar BA", href: "/ba" },
          { label: "Profile", href: "/profile" },
          { label: "Tentang", href: "/tentang" },
          { label: "Pengajuan BA", href: "/pengajuan-ba" },
        ];
      case "vendor":
        return [
          { label: "Dashboard", href: "/dashboard" },
          { label: "Buat BA", href: "/ba/create" },
          { label: "BA Saya", href: "/ba/my" },
          { label: "Profile", href: "/profile" },
          { label: "Tentang", href: "/tentang" },
          { label: "Pengajuan BA", href: "/pengajuan-ba" },
        ];
      default:
        return [
          { label: "Beranda", href: "/" },
          { label: "Tentang", href: "/tentang" },
          { label: "Pengajuan BA", href: "/pengajuan-ba" },
          { label: "Masuk", href: "/login" },
        ];
    }
  };

  const menuItems = getMenuItems();

  return (
    <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold mb-4">Accenprove</h3>
            <p className="text-gray-400">
              Digitalisasi Berita Acara untuk Efisiensi Bisnis
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Menu</h4>
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-gray-400 hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Kontak</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Email: info@accenprove.com</li>
              <li>Telp: +62 xxx xxxx xxxx</li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-gray-800 text-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Accenprove. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
