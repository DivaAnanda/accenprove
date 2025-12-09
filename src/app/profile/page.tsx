'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { ProfileData } from '@/types/profile';
import { profileStorage } from '@/lib/storage';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<'view' | 'edit'>('view');
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: '',
    lastName: '',
    email: 'user@email.com',
    phone: '',
    address: '',
    role: 'Staff',
    department: 'Keuangan',
    photo: '/default-avatar.png',
  });
  const [editData, setEditData] = useState<ProfileData>(profileData);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
    show: false,
    message: '',
    type: 'success',
  });

  useEffect(() => {
    const savedProfile = profileStorage.get();
    if (savedProfile) {
      setProfileData(savedProfile);
      setEditData(savedProfile);
    }
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png'];
    const maxSize = 2 * 1024 * 1024; // 2MB

    if (!allowedTypes.includes(file.type)) {
      showToast('Format foto harus JPG atau PNG', 'error');
      e.target.value = '';
      return;
    }

    if (file.size > maxSize) {
      showToast('Ukuran foto maksimal 2MB', 'error');
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setPreviewImage(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!editData.firstName || !editData.lastName) {
      showToast('Nama depan dan belakang wajib diisi', 'error');
      setIsLoading(false);
      return;
    }

    const phoneRegex = /^\+?\d{9,15}$/;
    if (!phoneRegex.test(editData.phone)) {
      showToast('Nomor telepon tidak valid', 'error');
      setIsLoading(false);
      return;
    }

    // Simulate save delay
    setTimeout(() => {
      const dataToSave = {
        ...editData,
        photo: previewImage || editData.photo,
      };

      try {
        profileStorage.set(dataToSave);
        profileStorage.addHistory(dataToSave);
        setProfileData(dataToSave);
        setActiveTab('view');
        showToast('Perubahan profile berhasil disimpan!', 'success');
      } catch (error) {
        showToast('Gagal menyimpan data. Storage mungkin penuh.', 'error');
      } finally {
        setIsLoading(false);
      }
    }, 1000);
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  const fullName = `${profileData.firstName} ${profileData.lastName}`.trim() || 'User';

  return (
    <>
      <Header title="Profile Saya" />
      
      <div className="max-w-7xl mx-auto p-8">
        {/* Tabs */}
        <div className="flex gap-4 border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab('view')}
            className={`pb-3 px-6 font-semibold transition-all ${
              activeTab === 'view'
                ? 'border-b-3 border-[#116669] text-[#116669]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Lihat Profile
          </button>
          <button
            onClick={() => setActiveTab('edit')}
            className={`pb-3 px-6 font-semibold transition-all ${
              activeTab === 'edit'
                ? 'border-b-3 border-[#116669] text-[#116669]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Edit Profile
          </button>
        </div>

        {/* View Profile Tab */}
        {activeTab === 'view' && (
          <div className="space-y-6">
            {/* Profile Header Card */}
            <div className="bg-white rounded-xl shadow-sm p-8 flex items-center gap-8">
              <img
                src={profileData.photo}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
              />
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  {fullName}
                  <span className="text-xs font-bold bg-[#e6f7f8] text-[#116669] px-3 py-1 rounded-full">
                    {profileData.role}
                  </span>
                </h2>
                <p className="text-gray-600 mt-1">{profileData.department}</p>
                <p className="text-sm text-gray-500 mt-2"> {profileData.address || 'Alamat belum diisi'}</p>
              </div>
            </div>

            {/* Info Card */}
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h3 className="text-xl font-semibold mb-6 pb-3 border-b border-gray-200">Informasi Pribadi</h3>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nama Depan</label>
                  <input
                    type="text"
                    value={profileData.firstName}
                    readOnly
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nama Belakang</label>
                  <input
                    type="text"
                    value={profileData.lastName}
                    readOnly
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Kantor</label>
                  <input
                    type="email"
                    value={profileData.email}
                    readOnly
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nomor Telepon</label>
                  <input
                    type="text"
                    value={profileData.phone}
                    readOnly
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                  />
                </div>
              </div>

              <button
                onClick={() => setActiveTab('edit')}
                className="mt-6 bg-gradient-to-r from-[#116669] to-[#22c9cf] text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                Ubah Data Profile
              </button>
            </div>

            {/* Security Card */}
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h3 className="text-xl font-semibold mb-4 pb-3 border-b border-gray-200">Keamanan Akun</h3>
              <p className="text-gray-600 mb-6">Kelola password dan keamanan akun Anda</p>
              
              <a
                href="/ganti-password"
                className="inline-flex items-center gap-2 px-6 py-3 border border-[#116669] text-[#116669] rounded-lg font-semibold hover:bg-[#116669] hover:text-white transition-all"
              >
                Ganti Password
              </a>
            </div>
          </div>
        )}

        {/* Edit Profile Tab */}
        {activeTab === 'edit' && (
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h3 className="text-xl font-semibold mb-6">Edit Profile</h3>
            
            <form onSubmit={handleSubmit}>
              {/* Photo Upload */}
              <div className="flex items-center gap-6 mb-8">
                <img
                  src={previewImage || editData.photo}
                  alt="Preview"
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ganti Foto Profil</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#116669] file:text-white hover:file:bg-[#0d5052]"
                  />
                  <p className="text-xs text-gray-500 mt-1">Format: JPG, PNG. Maks 2MB.</p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nama Depan *</label>
                  <input
                    type="text"
                    value={editData.firstName}
                    onChange={(e) => setEditData({ ...editData, firstName: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#116669] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nama Belakang *</label>
                  <input
                    type="text"
                    value={editData.lastName}
                    onChange={(e) => setEditData({ ...editData, lastName: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#116669] focus:border-transparent"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email (Read Only)</label>
                  <input
                    type="email"
                    value={editData.email}
                    readOnly
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                  <select
                    value={editData.role}
                    onChange={(e) => setEditData({ ...editData, role: e.target.value as any })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#116669] focus:border-transparent"
                  >
                    <option value="Staff">Staff</option>
                    <option value="Admin">Admin</option>
                    <option value="Keuangan">Keuangan</option>
                    <option value="Direksi">Direksi</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                  <input
                    type="text"
                    value={editData.department}
                    onChange={(e) => setEditData({ ...editData, department: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#116669] focus:border-transparent"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nomor Telepon *</label>
                  <input
                    type="tel"
                    value={editData.phone}
                    onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                    placeholder="+62 123 456 789"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#116669] focus:border-transparent"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Alamat Domisili</label>
                  <textarea
                    value={editData.address}
                    onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#116669] focus:border-transparent"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 justify-end mt-8">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('view');
                    setEditData(profileData);
                    setPreviewImage(null);
                  }}
                  className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`px-6 py-3 bg-gradient-to-r from-[#116669] to-[#22c9cf] text-white rounded-lg font-semibold hover:shadow-lg transition-all ${
                    isLoading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed bottom-8 right-8 px-6 py-4 rounded-lg shadow-lg text-white font-medium animate-slide-up ${
          toast.type === 'success' ? 'bg-[#116669]' : 'bg-red-600'
        }`}>
          {toast.message}
        </div>
      )}
    </>
  );
}
