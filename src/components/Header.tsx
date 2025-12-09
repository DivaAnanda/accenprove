'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { profileStorage } from '@/lib/storage';

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  const [userName, setUserName] = useState('User');
  const [userPhoto, setUserPhoto] = useState('/default-avatar.png');

  useEffect(() => {
    const profile = profileStorage.get();
    if (profile) {
      const fullName = `${profile.firstName} ${profile.lastName}`.trim();
      setUserName(fullName || 'User');
      setUserPhoto(profile.photo || '/default-avatar.png');
    }
  }, []);

  return (
    <header className="bg-white border-b border-gray-200 px-8 py-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">{title}</h1>
        
        <Link href="/profile" className="flex items-center gap-4 hover:opacity-80 transition-opacity cursor-pointer">
          <span className="font-semibold text-gray-700">{userName}</span>
          <div className="relative w-10 h-10">
            <Image
              src={userPhoto}
              alt="User Avatar"
              fill
              className="rounded-full object-cover border-2 border-gray-200 shadow-sm"
            />
          </div>
        </Link>
      </div>
    </header>
  );
}
