import Header from '@/components/Header';

export default function TentangPage() {
  return (
    <>
      <Header title="Tentang Accenprove" />
      
      <div className="max-w-7xl mx-auto p-8">
        <div className="bg-white rounded-xl shadow-sm p-8 max-w-4xl">
          <h2 className="text-2xl font-bold text-[#116669] mb-4">Apa itu Accenprove?</h2>
          <p className="text-gray-600 text-lg leading-relaxed mb-8">
            Accenprove adalah sebuah platform web berita acara yang dirancang khusus untuk kebutuhan 
            perusahaan dalam mengelola, mencatat, dan mendokumentasikan berbagai aktivitas penting. 
            Dengan tampilan modern dan sistem yang mudah digunakan, Accenprove membantu perusahaan 
            menjaga transparansi, akuntabilitas, dan efisiensi dalam setiap proses pencatatan berita acara.
          </p>

          <h3 className="text-xl font-semibold text-gray-800 mb-4">Fitur Utama Accenprove</h3>
          <ul className="space-y-3 mb-8 text-gray-700">
            <li className="flex items-start gap-3">
              <span><strong>Manajemen Berita Acara:</strong> Membuat, mengedit, dan menyimpan berita acara secara digital.</span>
            </li>
            <li className="flex items-start gap-3">
              <span><strong>Riwayat & Arsip:</strong> Menyimpan riwayat berita acara untuk kemudahan pencarian dan audit.</span>
            </li>
            <li className="flex items-start gap-3">
              <span><strong>Profile Pengguna:</strong> Setiap staf dapat mengelola data profil secara mandiri.</span>
            </li>
            <li className="flex items-start gap-3">
              <span><strong>Keamanan Data:</strong> Data tersimpan secara aman dengan kontrol akses berbasis role.</span>
            </li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mb-4">Mengapa Memilih Accenprove?</h3>
          <p className="text-gray-600 leading-relaxed">
            Accenprove hadir untuk mendukung digitalisasi proses administrasi perusahaan, meminimalisir 
            kesalahan manual, dan mempercepat alur kerja. Dengan antarmuka yang intuitif dan desain yang 
            konsisten, setiap pengguna dapat beradaptasi dengan cepat tanpa pelatihan khusus.
          </p>
        </div>
      </div>
    </>
  );
}
