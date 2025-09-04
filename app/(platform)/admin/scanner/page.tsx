"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Header from "@/components/Header";
import type { Result } from "@zxing/library";
import { CheckCircle, InfoIcon } from "lucide-react";
import { Button } from "@headlessui/react";

const QrReader = dynamic(() => import("react-qr-reader").then((mod) => mod.QrReader || mod.default), { ssr: false });

export default function ScanQRPage() {
  const [mode, setMode] = useState<"none" | "scan" | "manual">("none");
  const [manualInput, setManualInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showLoadingAnim, setShowLoadingAnim] = useState(false);

  type TicketData = {
    fullName: string;
    email: string;
    eventName?: string;
    ticketCode: string;
    scanDate?: string | null;
    checkedIn?: boolean;
    justCheckedIn?: boolean;
  };

  const [ticketData, setTicketData] = useState<TicketData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const checkTicket = async (ticketCode: string) => {
    try {
      setLoading(true);
      setShowLoadingAnim(true);
      setError(null);
      setTicketData(null);

      const res = await fetch("/api/scanner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticketCode }),
      });

      const data = await res.json();
      await new Promise((resolve) => setTimeout(resolve, 1200));

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
      setShowLoadingAnim(false);
      setMode("none");
      setManualInput("");
    }
  };

  const handleScan = (res: Result | null, err: Error | null) => {
    if (res) {
      let parsed = res.getText();
      try {
        const obj = JSON.parse(parsed);
        if (obj.ticketId) parsed = obj.ticketId;
      } catch {}
      checkTicket(parsed);
    }
    if (err) console.warn("QR decode error:", err);
  };

  const handleManualSubmit = () => {
    if (!manualInput.trim()) {
      return setError("Silakan masukkan No. Ticket terlebih dahulu");
    }
    checkTicket(manualInput.trim());
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <main className="flex-1 p-6 flex flex-col items-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-green-900 drop-shadow-sm mb-8 text-center">Scan QR Code / No. Ticket</h1>

        <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl p-6 flex flex-col items-center gap-4">
          <div className="flex gap-4 w-full justify-center mb-4">
            <Button
              onClick={() => {
                setMode("scan");
                setError(null);
                setTicketData(null);
              }}
              className={`flex-1 py-3 rounded-2xl font-semibold transition shadow-md text-lg text-center ${mode === "scan" ? "bg-slate-600 text-white" : "bg-slate-200 text-slate-800 hover:bg-slate-300"}`}
            >
              Scan QR
            </Button>
            <Button
              onClick={() => {
                setMode("manual");
                setError(null);
                setTicketData(null);
              }}
              className={`flex-1 py-3 rounded-2xl font-semibold transition shadow-md text-lg text-center ${mode === "manual" ? "bg-slate-600 text-white" : "bg-slate-200 text-slate-800 hover:bg-slate-300"}`}
            >
              No. Ticket
            </Button>
          </div>

          {/* QR Scanner */}
          {mode === "scan" && (
            <div className="relative w-96 aspect-square rounded-2xl overflow-hidden border-2 border-green-400 shadow-inner">
              <QrReader constraints={{ video: { facingMode: "environment" } }} onResult={handleScan} videoStyle={{ width: "100%", height: "100%", objectFit: "cover", backgroundColor: "white" }} />
              <div className="absolute inset-0 flex justify-center">
                <div className="w-11/12 border-t-4 border-green-500 animate-scan"></div>
              </div>
              <p className="text-slate-600 italic mt-2 text-center">Arahkan kamera ke QR Code untuk memindai</p>
            </div>
          )}

          {/* Manual Input */}
          {mode === "manual" && (
            <div className="w-full flex flex-col gap-3">
              <input
                type="text"
                placeholder="Masukkan No. Ticket"
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-green-400 text-lg"
              />
              <button onClick={handleManualSubmit} className="w-full px-6 py-3 bg-green-600 text-white rounded-2xl font-semibold shadow hover:bg-green-700 transition text-lg">
                Submit
              </button>
            </div>
          )}

          {showLoadingAnim && (
            <div className="flex flex-col items-center gap-2 mt-4">
              <div className="w-12 h-12 border-4 border-blue-300 border-t-blue-600 rounded-full animate-spin"></div>
              <p className="text-slate-500 italic">Memvalidasi tiket...</p>
            </div>
          )}

          {ticketData && (
            <div className={`px-6 py-8 rounded-2xl shadow-md border w-full ${ticketData.justCheckedIn ? "bg-blue-50 border-blue-200" : "bg-red-50 border-red-200"}`}>
              <div className="text-center mb-4 flex flex-col items-center">
                {ticketData.justCheckedIn ? (
                  <>
                    <CheckCircle className="w-12 h-12 text-blue-600 mb-2" />
                    <p className="text-blue-700 font-extrabold text-2xl mb-2">Berhasil Checked-in</p>
                    <p className="text-slate-600 font-bold">Tiket berhasil divalidasi</p>
                  </>
                ) : (
                  <>
                    <InfoIcon className="w-12 h-12 text-red-600 mb-2" />
                    <p className="text-red-700 font-extrabold text-2xl mb-2">Sudah Check-in</p>
                    {/* <p className="text-slate-600 font-bold text-sm">Tiket sudah divalidasi sebelumnya</p> */}
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
              </div>

              <div className="space-y-3 divide-y divide-slate-200 text-center">
                <div className="pt-2">
                  <p className="text-blue-900 text-xl font-semibold">{ticketData.fullName}</p>
                  <p className="text-slate-600 text-lg">{ticketData.email}</p>
                </div>
                {ticketData.eventName && (
                  <div className="pt-2">
                    <p className="text-slate-700">
                      <span className="font-medium">Event:</span> {ticketData.eventName}
                    </p>
                  </div>
                )}
                <div className="pt-2">
                  <p className="text-slate-500 select-text">
                    <span className="font-medium">No. Tiket:</span> {ticketData.ticketCode}
                  </p>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 px-4 py-3 rounded-xl shadow-sm w-full">
              <p className="text-red-600 font-medium">{error}</p>
            </div>
          )}
        </div>

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
