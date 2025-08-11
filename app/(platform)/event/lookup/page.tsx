"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Search, Download, CheckCircle } from "lucide-react";

export default function Lookup() {
  const [email, setEmail] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<null | {
    id: string;
    name: string;
    event: string;
    date: string;
    location: string;
    seat: string;
  }>(null);
  const [error, setError] = useState("");

  const dummyData = [
    {
      id: "EVT-2025-0001",
      email: "firda@example.com",
      birthDate: "1995-08-10",
      name: "Firda Rosiana",
      event: "Gatepass Launch Event",
      date: "2025-09-15",
      location: "Jakarta Convention Center, Jakarta",
      seat: "A12",
    },
    {
      id: "EVT-2025-0002",
      email: "john.doe@example.com",
      birthDate: "1990-01-15",
      name: "John Doe",
      event: "Annual Tech Conference 2025",
      date: "2025-11-03",
      location: "Bali Nusa Dua Convention Center, Bali",
      seat: "VIP-B5",
    },
    {
      id: "EVT-2025-0003",
      email: "jane.smith@example.com",
      birthDate: "1988-12-05",
      name: "Jane Smith",
      event: "Music Festival 2025",
      date: "2025-08-30",
      location: "Gelora Bung Karno Stadium, Jakarta",
      seat: "F-221",
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setResult(null);

    if (!email.trim() || !birthDate.trim()) {
      setError("Email dan tanggal lahir wajib diisi.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Format email tidak valid.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      const found = dummyData.find((item) => item.email.toLowerCase() === email.toLowerCase() && item.birthDate === birthDate);
      if (found) {
        setResult(found);
      } else {
        setError("Data tidak ditemukan. Silakan coba lagi.");
      }
    }, 1500);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white via-green-50 to-green-100 p-6 sm:p-10 text-slate-900">
      <div className="w-full max-w-lg flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <Link href="/" className="flex items-center gap-1 text-green-600 hover:text-green-800 text-sm font-semibold w-fit" aria-label="Kembali ke Beranda">
            <ArrowLeft className="w-4 h-4" /> Kembali
          </Link>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800">Cari Tiket Anda</h1>
        </div>

        {/* Form */}
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
              placeholder="contoh@domain.com"
              className="mt-2 px-5 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-500 text-slate-900 w-full text-lg"
              disabled={loading}
              required
            />
          </div>

          <div>
            <label htmlFor="birthDate" className="font-semibold text-slate-700 text-base">
              Tanggal Lahir
            </label>
            <input
              id="birthDate"
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="mt-2 px-5 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-500 text-slate-900 w-full text-lg"
              disabled={loading}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 
                       text-white text-lg font-semibold rounded-xl shadow-lg shadow-green-300/50 transition-all duration-300 
                       disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
          >
            <Search className="w-6 h-6" />
            {loading ? "Mencari..." : "Cari Tiket"}
          </button>
        </form>

        {/* Error */}
        {error && <p className="text-red-600 font-semibold text-center text-lg">{error}</p>}

        {/* Result */}
        {result && (
          <div className="bg-white p-6 rounded-2xl shadow-lg shadow-green-200 border border-green-200">
            <div className="flex items-center gap-3 p-4 mb-4 bg-green-50 border border-green-300 rounded-lg">
              <CheckCircle className="text-green-600 w-6 h-6" />
              <span className="text-green-700 font-semibold text-base">Tiket ditemukan!</span>
            </div>

            <div className="border border-dashed border-green-400 rounded-lg p-5">
              <p className="text-sm text-slate-500 mb-1">
                ID Tiket: <span className="font-mono">{result.id}</span>
              </p>
              <p className="text-lg font-bold mb-1">{result.name}</p>
              <p className="text-green-600 font-semibold mb-2">{result.event}</p>
              <p className="text-sm text-slate-600 mb-1">📅 {result.date}</p>
              <p className="text-sm text-slate-600 mb-3">📍 {result.location}</p>
              <p className="text-sm font-semibold">🪑 Nomor Kursi: {result.seat}</p>
            </div>

            <button
              onClick={() => alert("Fitur unduh QR Code belum tersedia")}
              className="flex items-center justify-center gap-3 w-full mt-4 px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 
                         text-white text-lg font-semibold rounded-xl shadow-lg shadow-blue-300/50 transition-all duration-300 
                         transform hover:scale-[1.02]"
            >
              <Download className="w-6 h-6" /> Unduh QR Code
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
