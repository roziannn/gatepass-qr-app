"use client";

import Link from "next/link";
import { FormInput, LucideUser, QrCodeIcon, Search } from "lucide-react";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-white via-green-50 to-green-100 text-slate-900">
      <main className="relative flex flex-col items-center justify-center flex-1 p-6 sm:p-10">
        <Link
          href="/login"
          className="
            absolute top-4 right-4
            flex items-center gap-2 px-4 py-3
            bg-red-500 hover:bg-red-600 text-white
            text-sm font-semibold rounded-lg shadow
            transition-all duration-200
          "
        >
          <LucideUser size={16} />
          Login Administrator
        </Link>

        <div className="mb-4">
          <FormInput size={48} className="text-green-600 animate-bounce" />
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold mb-6 text-center drop-shadow-lg">Selamat Datang di Gatepass</h1>
        <p className="mb-8 sm:mb-10 max-w-md sm:max-w-lg text-center text-base sm:text-lg leading-relaxed text-slate-700">Silakan isi formulir pendaftaran untuk mendapatkan tiket QR Code Anda.</p>

        <div className="flex flex-col gap-4 w-full max-w-xs sm:max-w-sm">
          <Link
            href="/event/register"
            className="flex items-center justify-center gap-3 px-6 py-4 
              bg-gradient-to-r from-green-500 to-green-600 
              hover:from-green-600 hover:to-green-700 
              text-white font-semibold text-lg rounded-xl 
              shadow-lg shadow-green-300/50 transition-all duration-300 
              transform hover:scale-[1.02] active:scale-95"
          >
            <FormInput size={24} />
            Formulir Register
          </Link>

          <Link
            href="/event/lookup"
            className="flex items-center justify-center gap-3 px-6 py-4 
              bg-gradient-to-r from-blue-500 to-blue-600 
              hover:from-blue-600 hover:to-blue-700 
              text-white font-semibold text-lg rounded-xl 
              shadow-lg shadow-blue-300/50 transition-all duration-300 
              transform hover:scale-[1.02] active:scale-95"
          >
            <Search size={24} />
            Lookup Tiket
          </Link>

          <Link
            href="/event/checkin"
            className="flex items-center justify-center gap-3 px-6 py-4 
              bg-gradient-to-r from-purple-500 to-purple-600 
              hover:from-purple-600 hover:to-purple-700 
              text-white font-semibold text-lg rounded-xl 
              shadow-lg shadow-purple-300/50 transition-all duration-300 
              transform hover:scale-[1.02] active:scale-95"
          >
            <QrCodeIcon size={24} />
            Scan Now
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
