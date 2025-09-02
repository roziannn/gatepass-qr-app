"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const QrReader = dynamic(() => import("react-qr-reader").then((mod) => mod.QrReader || mod.default), { ssr: false });

export default function ScanQR() {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // auto stop scanning setelah 5 detik hasil kebaca
  useEffect(() => {
    if (result) {
      const timer = setTimeout(() => {
        setResult(null);
        setScanning(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [result]);

  const constraints = {
    video: {
      facingMode: { ideal: "environment" },
      width: { ideal: 640 },
      height: { ideal: 480 },
    },
  };

  const handleScan = (res: any, err: any) => {
    try {
      if (res) {
        const text = res.getText();
        let parsedName = text;

        // coba parse JSON
        try {
          const obj = JSON.parse(text);
          if (obj.fullName) parsedName = obj.fullName;
        } catch {
          // kalau bukan JSON biarin raw
          parsedName = text;
        }

        setResult(parsedName);
        setError(null);
        setScanning(false); // stop scanning langsung setelah dapat
      }
      if (err) {
        console.warn("QR decode error:", err);
      }
    } catch (decodeErr) {
      console.error("Decode exception:", decodeErr);
      setError("Terjadi kesalahan saat memproses QR Code.");
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white via-green-50 to-green-100 p-6 sm:p-12 text-slate-900">
      <h1 className="text-4xl sm:text-6xl font-extrabold mb-8 text-green-900 drop-shadow-sm">Scan QR Code</h1>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center gap-6">
        {!scanning ? (
          <button
            onClick={() => {
              setScanning(true);
              setError(null);
            }}
            className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold shadow hover:bg-green-700 transition"
          >
            Mulai Scan
          </button>
        ) : (
          <div className="relative w-full aspect-square rounded-lg overflow-hidden border-2 border-green-400 shadow-inner">
            <QrReader constraints={constraints} onResult={handleScan} className="w-full h-full object-cover" />

            {/* Animasi garis scanner */}
            <div className="absolute inset-0 flex justify-center">
              <div className="w-11/12 border-t-4 border-green-500 animate-scan"></div>
            </div>
          </div>
        )}

        <div className="text-center mt-2 w-full">
          {result ? (
            <>
              <p className="text-green-700 font-semibold mb-3 text-lg">QR Code terdeteksi!</p>
              <p className="px-4 py-3 bg-green-50 rounded-md text-green-900 select-text shadow-sm">{result}</p>
              <p className="text-sm text-slate-500 mt-2 italic">(Scanner akan reset otomatis dalam 5 detik)</p>
            </>
          ) : (
            <p className="text-slate-600 italic">{!scanning ? "Klik tombol untuk mulai scan." : "Arahkan kamera ke QR Code untuk memindai."}</p>
          )}

          {error && <p className="text-red-600 mt-4 font-medium bg-red-50 rounded-md px-3 py-2 shadow-sm">{error}</p>}
        </div>
      </div>

      {/* Tailwind custom animation */}
      <style jsx global>{`
        @keyframes scan {
          0% {
            transform: translateY(0%);
          }
          100% {
            transform: translateY(100%);
          }
        }
        .animate-scan {
          animation: scan 2s linear infinite alternate;
        }
      `}</style>
    </main>
  );
}
