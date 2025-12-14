"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import DashboardChartsPreview from "@/components/DashboardChartsPreview";
import Footer from "@/components/Footer";
import {
  FileText,
  CheckCircle,
  Shield,
  Download,
  ArrowRight,
  Users,
  Clock,
  TrendingUp,
  Zap,
  Eye,
  PenTool,
  ChevronRight,
} from "lucide-react";

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Auto-redirect to dashboard if already logged in
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  // Show loading state during auth check
  if (!mounted || user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-20">
        {/* Gradient Mesh */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-blue-50"></div>
        
        {/* Animated Blobs */}
        <div className="absolute top-0 -left-4 w-72 h-72 bg-primary-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <Navbar />

      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto mb-16">
            {/* Main Headline */}
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold text-gray-900 mb-6 leading-[1.1] tracking-tight">
              Digitalisasi
              <br />
              <span className="bg-gradient-to-r from-primary-600 via-blue-700 to-blue-800 bg-clip-text text-transparent animate-gradient">
                Berita Acara
              </span>
              <br />
              dengan Tanda Tangan Digital
            </h1>

            {/* Subtitle */}
            <p className="text-xl sm:text-2xl text-gray-600 mb-12 leading-relaxed max-w-3xl mx-auto font-light">
              Platform approval BA yang aman, cepat, dan terintegrasi penuh.
              Hemat waktu, tingkatkan transparansi.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link
                href="/login"
                className="group px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-800 text-white rounded-xl hover:shadow-2xl transition-all hover:scale-105 font-semibold text-lg flex items-center justify-center gap-2"
              >
                Masuk ke Dashboard
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#features"
                className="px-8 py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-xl hover:border-primary-600 hover:text-primary-600 transition-all font-semibold text-lg hover:shadow-lg"
              >
                Pelajari Lebih Lanjut
              </a>
            </div>
          </div>

          {/* Dashboard Preview with Real Charts */}
          <div className="relative max-w-6xl mx-auto perspective-1000">
            <div className="relative transform hover:scale-[1.02] transition-transform duration-500">
              {/* Main Dashboard Container */}
              <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200 p-8">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-400"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                      <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    </div>
                    <span className="text-sm text-gray-500 font-medium">Dashboard Preview</span>
                  </div>
                </div>
                
                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  {[
                    { label: "Total BA", value: "145", icon: FileText, color: "primary" },
                    { label: "Approved", value: "98", icon: CheckCircle, color: "green" },
                    { label: "Pending", value: "32", icon: Clock, color: "orange" },
                    { label: "Vendors", value: "24", icon: Users, color: "purple" },
                  ].map((stat, i) => (
                    <div
                      key={i}
                      className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-100 hover:shadow-md transition-shadow"
                    >
                      <div className={`w-8 h-8 bg-${stat.color}-100 rounded-lg flex items-center justify-center mb-2`}>
                        <stat.icon className={`w-4 h-4 text-${stat.color}-600`} />
                      </div>
                      <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                      <div className="text-xs text-gray-600">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Charts Grid - Using Real Chart Components */}
                <DashboardChartsPreview />
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-6 -right-6 bg-white rounded-xl shadow-xl p-4 border border-gray-200 animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">BA Approved</div>
                    <div className="font-semibold text-gray-900">+12 Today</div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl p-4 border border-gray-200 animate-float animation-delay-2000">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Pending Review</div>
                    <div className="font-semibold text-gray-900">8 Items</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 rounded-full mb-6">
              <span className="text-sm font-semibold text-primary-600">Features</span>
            </div>
            <h2 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
              Fitur Unggulan
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Solusi lengkap untuk digitalisasi proses Berita Acara dengan teknologi modern
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: PenTool,
                title: "Digital Signature",
                description: "Tanda tangan elektronik yang legal dan aman tanpa perlu print dokumen",
                color: "primary",
                gradient: "from-primary-500 to-primary-600",
              },
              {
                icon: Zap,
                title: "Fast Approval",
                description: "Workflow otomatis multi-level untuk proses approval yang lebih cepat",
                color: "orange",
                gradient: "from-orange-500 to-orange-600",
              },
              {
                icon: Eye,
                title: "Audit Trail",
                description: "Track semua perubahan dan aktivitas untuk transparansi penuh",
                color: "blue",
                gradient: "from-primary-500 to-primary-700",
              },
              {
                icon: Download,
                title: "Export PDF",
                description: "Download BA dengan signature dalam format PDF berkualitas tinggi",
                color: "green",
                gradient: "from-green-500 to-green-600",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="group relative bg-white rounded-2xl p-8 border border-gray-200 hover:border-primary-300 transition-all hover:shadow-2xl hover:-translate-y-2"
              >
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-50/0 to-blue-50/0 group-hover:from-primary-50/50 group-hover:to-blue-100/50 rounded-2xl transition-all"></div>
                
                <div className="relative">
                  <div className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}>
                    <feature.icon className="w-7 h-7 text-white group-hover:scale-110 transition-transform" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 rounded-full mb-6">
              <span className="text-sm font-semibold text-primary-600">How It Works</span>
            </div>
            <h2 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
              Proses Sederhana
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Hanya 3 langkah untuk menyelesaikan approval Berita Acara
            </p>
          </div>

          <div className="relative">
            {/* Connection Line */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-primary-200 via-blue-300 to-blue-200 -translate-y-1/2"></div>

            <div className="grid md:grid-cols-3 gap-12 relative">
              {[
                {
                  step: "01",
                  title: "Upload",
                  description: "Vendor submit BA dengan form digital dan bubuhkan tanda tangan",
                  icon: FileText,
                },
                {
                  step: "02",
                  title: "Review",
                  description: "Direksi review dan approve/reject BA melalui dashboard",
                  icon: CheckCircle,
                },
                {
                  step: "03",
                  title: "Download",
                  description: "DK download BA final dengan semua signature untuk pembayaran",
                  icon: Download,
                },
              ].map((step, i) => (
                <div key={i} className="relative text-center">
                  {/* Step Card */}
                  <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-2xl transition-all hover:-translate-y-2 group">
                    <div className="relative inline-flex items-center justify-center mb-6">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-primary-800 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                      <div className="relative w-20 h-20 bg-gradient-to-br from-primary-600 to-primary-800 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-xl group-hover:scale-110 transition-transform duration-300">
                        <step.icon className="w-10 h-10 group-hover:rotate-12 transition-transform duration-300" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center text-xs font-bold text-primary-600 border-2 border-primary-600 group-hover:animate-pulse">
                        {step.step}
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Role Benefits */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 rounded-full mb-6">
              <span className="text-sm font-semibold text-primary-600">For Everyone</span>
            </div>
            <h2 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
              Manfaat untuk Semua Role
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Setiap user mendapatkan dashboard dan fitur yang disesuaikan dengan perannya
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                role: "Admin",
                icon: Shield,
                color: "primary",
                benefits: [
                  "Full control & user management",
                  "System configuration",
                  "Audit logs access",
                  "Analytics dashboard",
                ],
              },
              {
                role: "Direksi",
                icon: CheckCircle,
                color: "green",
                benefits: [
                  "Quick approval dashboard",
                  "Digital signature",
                  "Pending BA alerts",
                  "Approval history",
                ],
              },
              {
                role: "DK",
                icon: Download,
                color: "blue",
                benefits: [
                  "One-click export",
                  "Batch download",
                  "Approved BA only",
                  "Payment processing",
                ],
              },
              {
                role: "Vendor",
                icon: FileText,
                color: "purple",
                benefits: [
                  "Real-time status tracking",
                  "Easy BA creation",
                  "Rejection notifications",
                  "Document archive",
                ],
              },
            ].map((role, i) => (
              <div
                key={i}
                className="group bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border border-gray-200 hover:border-primary-300 transition-all hover:shadow-2xl hover:-translate-y-1"
              >
                <div className={`w-12 h-12 bg-${role.color}-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <role.icon className={`w-6 h-6 text-${role.color}-600`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {role.role}
                </h3>
                <ul className="space-y-2">
                  {role.benefits.map((benefit, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-gray-600">
                      <ChevronRight className="w-4 h-4 text-primary-600 mt-0.5 flex-shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl opacity-10 animate-blob"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-overlay filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <h2 className="text-5xl sm:text-6xl font-bold text-white mb-6 tracking-tight hover:scale-105 transition-transform duration-300">
            Siap Memulai?
          </h2>
          <p className="text-xl text-primary-100 mb-12 max-w-2xl mx-auto">
            Bergabung dengan Accenprove dan rasakan kemudahan digitalisasi Berita Acara
          </p>
          <Link
            href="/login"
            className="group inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-600 rounded-xl hover:bg-primary-50 transition-all hover:shadow-2xl hover:scale-110 font-bold text-lg relative overflow-hidden"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-primary-50 to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity"></span>
            <span className="relative flex items-center gap-2">
              Masuk ke Dashboard
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
        </div>
      </section>

      <Footer />

      {/* Custom Animations Styles */}
      <style jsx global>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -20px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(20px, 20px) scale(1.05); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }

        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 3s linear infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </div>
  );
}
