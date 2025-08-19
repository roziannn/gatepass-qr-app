"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, FormInput, CheckCircle, Download } from "lucide-react";
import QRCode from "react-qr-code";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(""); // ✅ state event
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [qrData, setQrData] = useState<string | null>(null);
  const qrRef = useRef<SVGSVGElement | null>(null);

  // 🔽 Fungsi download QR Code
  const downloadQRCode = () => {
    if (!qrRef.current) return;

    const svg = qrRef.current;
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svg);

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    const size = 180;
    canvas.width = size;
    canvas.height = size;

    const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      ctx?.clearRect(0, 0, size, size);
      ctx?.drawImage(img, 0, 0, size, size);
      URL.revokeObjectURL(url);

      const pngUrl = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = "qrcode.png";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    };

    img.onerror = () => {
      alert("Gagal mengunduh QR Code.");
      URL.revokeObjectURL(url);
    };

    img.src = url;
  };

  // 🔽 Submit form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setQrData(null);

    if (!fullName.trim() || !email.trim() || !birthDate.trim() || !selectedEvent.trim()) {
      setError("Semua field wajib diisi.");
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
      setSuccess(true);

      // 🔽 Data QR termasuk event
      const dataString = JSON.stringify({
        fullName,
        email,
        birthDate,
        event: selectedEvent,
      });

      setQrData(dataString);
    }, 1500);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white via-green-50 to-green-100 p-6 sm:p-10 text-slate-900">
      <div className="w-full max-w-lg flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <Link href="/" className="flex items-center gap-1 text-green-600 hover:text-green-800 text-sm font-semibold w-fit">
            <ArrowLeft className="w-4 h-4" /> Kembali
          </Link>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800">Formulir Pendaftaran</h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 bg-white p-8 rounded-2xl shadow-lg shadow-green-200 border border-green-200">
          <div>
            <label htmlFor="fullName" className="font-semibold text-slate-700 text-base">
              Nama Lengkap
            </label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Nama lengkap"
              className="mt-2 px-5 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-500 text-slate-900 w-full text-lg"
              disabled={loading}
              required
            />
          </div>

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

          {/* 🔽 Select Event */}
          <div>
            <label htmlFor="event" className="font-semibold text-slate-700 text-base">
              Pilih Event
            </label>
            <select
              id="event"
              value={selectedEvent}
              onChange={(e) => setSelectedEvent(e.target.value)}
              className="mt-2 px-5 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-500 text-slate-900 w-full text-lg"
              disabled={loading}
              required
            >
              <option value="">-- Pilih Event --</option>
              <option value="Tech Conference 2025">Tech Conference 2025</option>
              <option value="Workshop ReactJS">Workshop ReactJS</option>
              <option value="Seminar AI & Data">Seminar AI & Data</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 
                       text-white text-lg font-semibold rounded-xl shadow-lg shadow-green-300/50 transition-all duration-300 
                       disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
          >
            <FormInput className="w-6 h-6" />
            {loading ? "Mendaftar..." : "Daftar Sekarang"}
          </button>
        </form>

        {/* Error */}
        {error && <p className="text-red-600 font-semibold text-center text-lg">{error}</p>}

        {/* Success & QR Code */}
        {success && (
          <div className="bg-green-50 border border-green-300 rounded-lg p-5 flex flex-col items-center gap-4">
            <CheckCircle className="text-green-600 w-6 h-6" />
            <span className="text-green-700 font-semibold text-base">Pendaftaran berhasil! Silakan cek QR Code Anda di bawah.</span>

            {qrData && (
              <>
                <div className="bg-white p-6 rounded-lg mt-2 shadow-md">
                  <QRCode
                    value={qrData}
                    size={180}
                    ref={(el) => {
                      qrRef.current = el;
                    }}
                  />
                </div>

                <button
                  onClick={downloadQRCode}
                  className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow transition duration-300 select-none"
                  type="button"
                  aria-label="Download QR Code"
                >
                  <Download className="w-5 h-5" />
                  Download QR
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
