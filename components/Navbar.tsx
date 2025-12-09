"use client";

import Link from "next/link";
import { useState } from "react";

type UserRole = "admin" | "direksi" | "dk" | "vendor" | null;

interface NavbarProps {
  userRole?: UserRole;
  userName?: string;
}

export default function Navbar({ userRole = null, userName }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Menu items based on role
  const getMenuItems = () => {
    switch (userRole) {
      case "admin":
        return [
          { label: "Dashboard", href: "/dashboard" },
          { label: "Daftar BA", href: "/ba" },
          { label: "Daftar User", href: "/users" },
          { label: "Profile", href: "/profile" },
        ];
      case "direksi":
        return [
          { label: "Dashboard", href: "/dashboard" },
          { label: "Daftar BA", href: "/ba" },
          { label: "Profile", href: "/profile" },
        ];
      case "dk":
        return [
          { label: "Dashboard", href: "/dashboard" },
          { label: "Daftar BA", href: "/ba" },
          { label: "Profile", href: "/profile" },
        ];
      case "vendor":
        return [
          { label: "Dashboard", href: "/dashboard" },
          { label: "Buat BA", href: "/ba/create" },
          { label: "BA Saya", href: "/ba/my" },
          { label: "Profile", href: "/profile" },
        ];
      default:
        return [
          { label: "Dashboard", href: "/" },
          { label: "Masuk", href: "/login" },
          { label: "Buat Akun", href: "/register" },
        ];
    }
  };

  const menuItems = getMenuItems();

  return (
    <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href={userRole ? "/dashboard" : "/"} className="text-2xl font-bold text-primary-600">
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
            {userRole && userName && (
              <div className="ml-4 pl-4 border-l border-gray-300">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-sm">
                    <p className="font-medium text-gray-900">{userName}</p>
                    <p className="text-xs text-gray-500 capitalize">{userRole}</p>
                  </div>
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
            {userRole && userName && (
              <div className="mt-4 pt-4 border-t border-gray-200 px-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-semibold">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{userName}</p>
                    <p className="text-sm text-gray-500 capitalize">{userRole}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
