"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import type { Result } from "@zxing/library";
import { CheckCircle, Info as InfoIcon } from "lucide-react";

const QrReader = dynamic(() => import("react-qr-reader").then((mod) => mod.QrReader || mod.default), { ssr: false });

type TicketData = {
  fullName: string;
  email: string;
  eventName?: string;
  ticketCode: string;
  scanDate?: string | null;
  checkedIn?: boolean;
  justCheckedIn?: boolean;
};

export default function ScanQR() {
  const router = useRouter();
  const [scanning, setScanning] = useState(false);
  const [ticketData, setTicketData] = useState<TicketData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const constraints = {
    video: {
      facingMode: { ideal: "environment" },
      width: { ideal: 640 },
      height: { ideal: 480 },
    },
  };

  const checkTicket = async (ticketCode: string) => {
    try {
      setLoading(true);
      setError(null);
      setTicketData(null);

      const res = await fetch("/api/scanner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticketCode }),
      });

      const data = await res.json();
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (!res.ok || !data.success) {
        setError(data.message || data.error || "Ticket tidak valid");
      } else {
        setTicketData(data.data);
      }
    } catch (err) {
      console.error(err);
      setError("Gagal memeriksa tiket");
    } finally {
      setLoading(false);
    }
  };

  const handleScan = (res: Result | null, err: Error | null) => {
    if (loading || ticketData) return;

    if (res) {
      let parsed = res.getText().trim();
      try {
        const obj = JSON.parse(parsed);
        if (obj.ticketCode) parsed = obj.ticketCode.trim();
      } catch {}

      checkTicket(parsed);
    }

    if (err) console.warn("QR decode error:", err);
  };

  // reset scanner otomatis 5 detik setelah hasil muncul
  useEffect(() => {
    if (ticketData || error) {
      const timeout = setTimeout(() => {
        setTicketData(null);
        setError(null);
        setLoading(false);
      }, 4000);

      return () => clearTimeout(timeout);
    }
  }, [ticketData, error]);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-white via-green-50 to-green-100 text-slate-900">
      <main className="flex flex-col items-center justify-center flex-1 p-6 sm:p-12">
        <h1 className="text-4xl sm:text-6xl font-extrabold mb-8 text-green-900 drop-shadow-sm">Scan QR Code</h1>

        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center gap-6">
          {!scanning ? (
            <button
              onClick={() => {
                setScanning(true);
                setError(null);
                setTicketData(null);
              }}
              className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold shadow hover:bg-green-700 transition"
            >
              Mulai Scan
            </button>
          ) : (
            <div className="relative w-full aspect-square rounded-lg overflow-hidden border-2 border-green-400 shadow-inner">
              {loading ? (
                <div className="w-full h-full flex flex-col items-center justify-center">
                  <div className="w-10 h-10 border-4 border-green-300 border-t-green-600 rounded-full animate-spin mb-2"></div>
                  <p className="text-slate-500 italic">Memvalidasi tiket...</p>
                </div>
              ) : ticketData ? (
                <div className={`w-full h-full flex flex-col items-center justify-center text-center p-4 ${ticketData.justCheckedIn ? "bg-blue-50 border-blue-200" : "bg-red-50 border-red-200"}`}>
                  {ticketData.justCheckedIn ? (
                    <>
                      <CheckCircle className="w-16 h-16 text-blue-600 mb-3" />
                      <p className="text-blue-700 font-extrabold text-2xl mb-2">Berhasil Checked-in</p>
                      <p className="text-slate-600 font-bold mb-3">Tiket berhasil divalidasi</p>
                    </>
                  ) : (
                    <>
                      <InfoIcon className="w-16 h-16 text-red-600 mb-3" />
                      <p className="text-red-700 font-extrabold text-2xl mb-2">Sudah Check-in</p>
                      {ticketData?.scanDate && (
                        <p className="text-slate-600 font-bold mt-1">
                          Ticket discan pada:{" "}
                          {new Date(ticketData.scanDate).toLocaleString("id-ID", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </p>
                      )}
                    </>
                  )}

                  <div className="mt-4 space-y-2">
                    <p className="text-blue-900 text-lg font-semibold">{ticketData.fullName}</p>
                    <p className="text-slate-600">{ticketData.email}</p>
                    {ticketData.eventName && (
                      <p className="text-slate-700">
                        <span className="font-medium">Event:</span> {ticketData.eventName}
                      </p>
                    )}
                    <p className="text-slate-500 select-text">
                      <span className="font-medium">No. Tiket:</span> {ticketData.ticketCode}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="relative w-full h-full">
                  <QrReader constraints={constraints} onResult={handleScan} className="w-full h-full object-cover" />
                  {/* Garis scanner animasi */}
                  <div className="absolute inset-0 flex justify-center pointer-events-none">
                    <div className="w-11/12 border-t-4 border-green-500 animate-scan"></div>
                  </div>
                </div>
              )}
            </div>
          )}

          {error && <p className="text-red-600 mt-4 font-medium bg-red-50 rounded-md px-3 py-2 shadow-sm w-full text-center">{error}</p>}

          <div className="flex justify-center w-full mt-4">
            <button onClick={() => router.push("/")} className="px-6 py-3 bg-gray-300 text-gray-800 rounded-xl font-semibold shadow hover:bg-gray-400 transition">
              Kembali ke Home
            </button>
          </div>
        </div>
      </main>

      <footer className="bg-green-100 text-green-900 py-4 text-center shadow-inner mt-auto">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} <b>Gatepass App</b>. All rights reserved.
        </p>
      </footer>

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
    </div>
  );
}
