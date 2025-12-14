import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PengajuanBAPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white flex flex-col">
      <Navbar />
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-50 via-white to-primary-50/30 p-8 border border-primary-100 mb-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-200/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary-300/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative z-10">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Informasi Cara Pengajuan Berita Acara
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Ikuti langkah-langkah berikut untuk mengajukan Berita Acara secara digital melalui sistem Accenprove.
            </p>
          </div>
        </div>

        {/* Steps - Timeline */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Langkah-langkah Pengajuan
          </h2>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-8">
            <div className="relative space-y-8 pl-2">
              {/* Timeline Line - Centered at badge (24px from left edge) */}
              <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-primary-200 to-primary-300" />
              
              {/* Step 1 */}
              <div className="relative flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-700 text-white rounded-full flex items-center justify-center text-lg font-bold shadow-lg z-10">
                  1
                </div>
                <div className="pt-2">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Login ke Akun</h3>
                  <p className="text-gray-600">
                    Login ke akun Accenprove Anda sesuai role yang telah diberikan.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-700 text-white rounded-full flex items-center justify-center text-lg font-bold shadow-lg z-10">
                  2
                </div>
                <div className="pt-2">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Buka Menu BA</h3>
                  <p className="text-gray-600">
                    Pilih menu <span className="font-semibold text-primary-600">Buat Berita Acara</span> pada sidebar untuk mulai mengajukan BA baru.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-700 text-white rounded-full flex items-center justify-center text-lg font-bold shadow-lg z-10">
                  3
                </div>
                <div className="pt-2">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Isi Form</h3>
                  <p className="text-gray-600">
                    Isi form pengajuan berita acara dengan data yang lengkap dan benar sesuai ketentuan.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="relative flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-700 text-white rounded-full flex items-center justify-center text-lg font-bold shadow-lg z-10">
                  4
                </div>
                <div className="pt-2">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Upload Dokumen</h3>
                  <p className="text-gray-600">
                    Upload dokumen pendukung jika diperlukan (PDF/JPG/PNG, max 5MB).
                  </p>
                </div>
              </div>

              {/* Step 5 */}
              <div className="relative flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-700 text-white rounded-full flex items-center justify-center text-lg font-bold shadow-lg z-10">
                  5
                </div>
                <div className="pt-2">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Kirim Pengajuan</h3>
                  <p className="text-gray-600">
                    Klik tombol <span className="font-semibold text-primary-600">Kirim Pengajuan</span> untuk mengirimkan BA Anda ke sistem.
                  </p>
                </div>
              </div>

              {/* Step 6 */}
              <div className="relative flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-700 text-white rounded-full flex items-center justify-center text-lg font-bold shadow-lg z-10">
                  6
                </div>
                <div className="pt-2">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Pantau Status</h3>
                  <p className="text-gray-600">
                    Pengajuan diproses departemen terkait. Status dapat dipantau di menu <span className="font-semibold text-primary-600">Riwayat BA</span>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Requirements */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-blue-500 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Persyaratan Pengajuan</h3>
            </div>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Data pengajuan harus valid dan sesuai ketentuan perusahaan</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Dokumen pendukung format PDF/JPG/PNG, maksimal 5MB</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Hanya user terdaftar yang dapat mengajukan</span>
              </li>
            </ul>
          </div>

          {/* Process Flow */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-green-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-green-500 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Alur Proses</h3>
            </div>
            <ol className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                <span>Pengajuan masuk dan diverifikasi Admin</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                <span>Jika valid, diteruskan ke Direksi/Keuangan</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                <span>Pantau status di menu Riwayat BA</span>
              </li>
            </ol>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-3">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <p className="text-white font-medium text-lg">
              Untuk pertanyaan lebih lanjut, silakan hubungi Admin Accenprove
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
