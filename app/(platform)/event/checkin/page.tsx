"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
const QrReader = dynamic(
  () =>
    import("react-qr-reader").then((mod) => {
      return mod.QrReader || mod.default;
    }),
  { ssr: false }
);

export default function ScanQR() {
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white via-green-50 to-green-100 p-6 sm:p-12 text-slate-900">
      <h1 className="text-4xl sm:text-6xl font-extrabold mb-8 text-green-900 drop-shadow-sm">Scan QR Code</h1>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center gap-6">
        <div className="w-full rounded-lg overflow-hidden border-2 border-green-300 shadow-inner">
          <QrReader
            constraints={{ facingMode: "environment" }}
            onResult={(result, error) => {
              if (result) {
                setResult(result.getText());
                setError(null);
              }
              if (error) {
                setError(error.message || "Unknown error");
              }
            }}
            className="w-full"
          />
        </div>

        <div className="text-center mt-2 w-full">
          {result ? (
            <>
              <p className="text-green-700 font-semibold mb-3 text-lg">QR Code detected!</p>
              <p className="break-words px-4 py-3 bg-green-50 rounded-md text-green-900 select-text shadow-sm">{result}</p>
            </>
          ) : (
            <p className="text-slate-600 italic">Arahkan kamera ke QR Code untuk memindai.</p>
          )}

          {error && <p className="text-red-600 mt-4 font-medium bg-red-50 rounded-md px-3 py-2 shadow-sm">{error}</p>}
        </div>
      </div>
    </main>
  );
}
