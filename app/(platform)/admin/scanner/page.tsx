"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Header from "@/components/Header";

const QrReader = dynamic(() => import("react-qr-reader").then((mod) => mod.QrReader || mod.default), { ssr: false });

export default function ScanQRPage() {
  const [mode, setMode] = useState<"none" | "scan" | "manual">("none");
  const [result, setResult] = useState<string | null>(null);
  const [manualInput, setManualInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const constraints = {
    video: { facingMode: { ideal: "environment" }, width: { ideal: 640 }, height: { ideal: 480 } },
  };

  // Auto-reset 5 detik
  useEffect(() => {
    if (result) {
      const timer = setTimeout(() => {
        setResult(null);
        setMode("none");
        setManualInput("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [result]);

  const handleScan = (res: any, err: any) => {
    try {
      if (res) {
        const text = res.getText?.() || res;
        let parsed = text;
        try {
          const obj = JSON.parse(text);
          if (obj.ticketId) parsed = obj.ticketId;
        } catch {}
        setResult(parsed);
        setError(null);
        setMode("none");
      }
      if (err) console.warn("QR decode error:", err);
    } catch {
      setError("Terjadi kesalahan saat memproses QR Code.");
    }
  };

  const handleManualSubmit = () => {
    if (!manualInput.trim()) return setError("Silakan masukkan Ticket ID");
    setResult(manualInput.trim());
    setError(null);
    setMode("none");
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <main className="flex-1 p-6 flex flex-col items-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-green-900 drop-shadow-sm mb-8 text-center">Scan QR Code / Ticket ID</h1>

        <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl p-6 flex flex-col items-center gap-6">
          {/* Mode Selector */}
          <div className="flex gap-4 w-full justify-center mb-4">
            <button
              onClick={() => {
                setMode("scan");
                setError(null);
                setResult(null);
              }}
              className={`flex-1 py-3 rounded-2xl font-semibold transition shadow-md text-lg text-center ${mode === "scan" ? "bg-green-600 text-white" : "bg-green-100 text-green-800 hover:bg-green-200"}`}
            >
              Scan QR
            </button>
            <button
              onClick={() => {
                setMode("manual");
                setError(null);
                setResult(null);
              }}
              className={`flex-1 py-3 rounded-2xl font-semibold transition shadow-md text-lg text-center ${mode === "manual" ? "bg-green-600 text-white" : "bg-green-100 text-green-800 hover:bg-green-200"}`}
            >
              Input Ticket ID
            </button>
          </div>

          {/* Mode Content */}
          {mode === "scan" && (
            <>
              <div className="relative w-full aspect-square rounded-2xl overflow-hidden border-2 border-green-400 shadow-inner">
                {/* Kamera live terlihat jelas */}
                <QrReader constraints={{ video: { facingMode: "environment" } }} onResult={handleScan} videoStyle={{ width: "100%", height: "100%", objectFit: "cover", backgroundColor: "white" }} />

                {/* Garis scan animasi */}
                <div className="absolute inset-0 flex justify-center">
                  <div className="w-11/12 border-t-4 border-green-500 animate-scan"></div>
                </div>
              </div>

              <p className="text-slate-600 italic mt-2 text-center">Arahkan kamera ke QR Code untuk memindai</p>
            </>
          )}

          {mode === "manual" && (
            <div className="w-full flex flex-col gap-3">
              <input
                type="text"
                placeholder="Masukkan Ticket ID"
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-green-400 text-lg"
              />
              <button onClick={handleManualSubmit} className="w-full px-6 py-3 bg-green-600 text-white rounded-2xl font-semibold shadow hover:bg-green-700 transition text-lg">
                Submit Ticket ID
              </button>
            </div>
          )}

          {/* Result / Error */}
          {(result || error) && (
            <div className="w-full mt-4 flex flex-col gap-2">
              {result && (
                <div className="bg-green-50 px-4 py-3 rounded-xl shadow-sm">
                  <p className="text-green-700 font-semibold mb-1 text-lg">Ticket ID terdeteksi!</p>
                  <p className="select-text text-green-900 font-medium">{result}</p>
                  <p className="text-sm text-slate-500 mt-1 italic">(Scanner/manual akan reset otomatis dalam 5 detik)</p>
                </div>
              )}
              {error && (
                <div className="bg-red-50 px-4 py-3 rounded-xl shadow-sm">
                  <p className="text-red-600 font-medium">{error}</p>
                </div>
              )}
            </div>
          )}
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
    </div>
  );
}
