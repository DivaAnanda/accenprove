import Header from '@/components/Header';

export default function PengajuanBAPage() {
  return (
    <>
      <Header title="Informasi Cara Pengajuan Berita Acara" />
      
      <div className="max-w-7xl mx-auto p-8">
        <div className="bg-white rounded-xl shadow-sm p-8 max-w-4xl">
          <h2 className="text-2xl font-bold text-[#116669] mb-6">Langkah-langkah Pengajuan Berita Acara</h2>
          
          <ol className="space-y-4 mb-8 text-gray-700">
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 bg-[#116669] text-white rounded-full flex items-center justify-center font-bold">1</span>
              <span className="pt-1">Login ke akun Accenprove Anda sesuai role.</span>
            </li>
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 bg-[#116669] text-white rounded-full flex items-center justify-center font-bold">2</span>
              <span className="pt-1">Pilih menu <strong>Buat Berita Acara</strong> pada sidebar.</span>
            </li>
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 bg-[#116669] text-white rounded-full flex items-center justify-center font-bold">3</span>
              <span className="pt-1">Isi form pengajuan berita acara dengan data yang lengkap dan benar.</span>
            </li>
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 bg-[#116669] text-white rounded-full flex items-center justify-center font-bold">4</span>
              <span className="pt-1">Upload dokumen pendukung jika diperlukan.</span>
            </li>
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 bg-[#116669] text-white rounded-full flex items-center justify-center font-bold">5</span>
              <span className="pt-1">Klik tombol <strong>Kirim Pengajuan</strong>.</span>
            </li>
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 bg-[#116669] text-white rounded-full flex items-center justify-center font-bold">6</span>
              <span className="pt-1">Pengajuan akan diproses oleh departemen terkait dan status dapat dipantau di menu <strong>Riwayat BA</strong>.</span>
            </li>
          </ol>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-3"> Persyaratan Pengajuan</h3>
            <ul className="space-y-2 text-gray-700 list-disc list-inside">
              <li>Data pengajuan harus valid dan sesuai dengan ketentuan perusahaan.</li>
              <li>Dokumen pendukung (jika ada) harus dalam format PDF/JPG/PNG dan maksimal 5MB.</li>
              <li>Pengajuan hanya dapat dilakukan oleh user yang sudah terdaftar.</li>
            </ul>
          </div>

          <div className="bg-green-50 border-l-4 border-green-500 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3"> Alur Proses</h3>
            <ol className="space-y-2 text-gray-700 list-decimal list-inside">
              <li>Pengajuan masuk ke sistem dan diverifikasi oleh Admin.</li>
              <li>Jika valid, pengajuan diteruskan ke Direksi/Keuangan untuk persetujuan.</li>
              <li>Status pengajuan dapat dipantau di menu Riwayat BA.</li>
            </ol>
          </div>

          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-[#116669] font-medium">
              Untuk pertanyaan lebih lanjut, silakan hubungi Admin Accenprove.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
