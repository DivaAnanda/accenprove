'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface MenuItem {
  href: string;
  label: string;
  icon?: string;
}

const menuItems: MenuItem[] = [
  { href: '/profile', label: 'Profile' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/pengajuan-ba', label: 'Cara Pengajuan BA' },
  { href: '/buat-ba', label: 'Buat Berita Acara' },
  { href: '/tentang', label: 'Tentang Accenprove' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#116669] rounded-full" />
            <span className="text-xl font-bold text-[#116669]">Accenprove</span>
          </Link>

          {/* Menu */}
          <ul className="flex items-center gap-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`
                      px-4 py-2 rounded-lg font-medium transition-all text-sm
                      ${isActive 
                        ? 'bg-[#116669] text-white' 
                        : 'text-gray-600 hover:bg-gray-100'
                      }
                    `}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Logout */}
          <button className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all text-sm font-medium">
            <span>⏏</span>
            Keluar
          </button>
        </div>
      </div>
    </nav>
  );
}
