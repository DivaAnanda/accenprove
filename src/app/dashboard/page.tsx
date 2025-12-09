import Header from '@/components/Header';

export default function DashboardPage() {
  return (
    <>
      <Header title="Dashboard" />
      
      <div className="max-w-7xl mx-auto p-8">
        <div className="bg-white rounded-xl shadow-sm p-8 flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="text-6xl mb-4">📊</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Dashboard</h2>
            <p className="text-gray-600">Halaman ini sedang dalam pengembangan oleh tim lain.</p>
          </div>
        </div>
      </div>
    </>
  );
}
