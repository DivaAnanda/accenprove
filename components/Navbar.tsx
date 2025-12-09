"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  // Menu items based on role
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
          { label: "Audit Logs", href: "/audit-logs" },
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
    <nav className="border-b border-gray-100 bg-white/70 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href={user ? "/dashboard" : "/"} className="text-2xl font-bold text-primary-600">
              Accenprove
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-1">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-4 py-2 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors font-medium"
              >
                {item.label}
              </Link>
            ))}
            
            {/* User Info (if logged in) */}
            {user && (
              <div className="ml-4 pl-4 border-l border-gray-300">
                <div className="flex items-center gap-2">
                  {user.photo ? (
                    <img
                      src={user.photo}
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover border-2 border-primary-100"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                      {user.firstName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="text-sm">
                    <p className="font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                    <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                  </div>
                  <button
                    onClick={logout}
                    className="ml-2 px-3 py-1 text-xs text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Logout"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-4 py-2 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            
            {/* User Info Mobile */}
            {user && (
              <div className="mt-4 pt-4 border-t border-gray-200 px-4">
                <div className="flex items-center gap-3 mb-3">
                  {user.photo ? (
                    <img
                      src={user.photo}
                      alt="Profile"
                      className="w-10 h-10 rounded-full object-cover border-2 border-primary-100"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-semibold">
                      {user.firstName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                    <p className="text-sm text-gray-500 capitalize">{user.role}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left font-medium"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
