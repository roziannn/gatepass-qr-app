"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Lock, Eye, EyeOff } from "lucide-react";
import Footer from "@/components/Footer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AdminLogin() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleShowPassword = () => setShowPassword((prev) => !prev);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast.error("Semua field wajib diisi.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Format email tidak valid.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      if (email === "admin@example.com" && password === "admin123") {
        toast.success("Login berhasil!");
        setEmail("");
        setPassword("");

        setTimeout(() => {
          router.push("/admin/dashboard");
        }, 1000);
      } else {
        toast.error("Email atau password salah.");
      }
    }, 1500);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-white via-green-50 to-green-100 p-6 sm:p-10 text-slate-900">
        <div className="w-full max-w-lg flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <Link href="/" className="flex items-center gap-1 text-green-600 hover:text-green-800 text-sm font-semibold w-fit" aria-label="Kembali ke Beranda">
              <ArrowLeft className="w-4 h-4" /> Kembali
            </Link>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800">Login Admin</h1>
            <p className="text-slate-600 text-sm sm:text-base max-w-md">Masukkan email dan password admin Anda untuk mengakses dashboard. Pastikan data yang Anda masukkan benar.</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6 bg-white p-8 rounded-2xl shadow-lg shadow-green-200 border border-green-200">
            <div>
              <label htmlFor="email" className="font-semibold text-slate-700 text-base">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@domain.com"
                className="mt-2 px-5 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-500 text-slate-900 w-full text-lg"
                disabled={loading}
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="font-semibold text-slate-700 text-base">
                Password
              </label>
              <div className="relative mt-2">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                  className="peer px-5 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-500 text-slate-900 w-full text-lg"
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  onClick={toggleShowPassword}
                  tabIndex={-1}
                  className="absolute top-3.5 right-3 w-5 h-5 text-slate-500 hover:text-green-600 transition-colors"
                  aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-lg font-semibold rounded-xl shadow-lg shadow-green-300/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
            >
              <Lock className="w-6 h-6" />
              {loading ? "Memproses..." : "Login"}
            </button>
          </form>
        </div>
      </main>

      <Footer />

      <ToastContainer position="top-center" autoClose={3000} hideProgressBar={false} pauseOnHover theme="colored" />
    </div>
  );
}
