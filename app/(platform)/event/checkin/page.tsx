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
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white via-green-50 to-green-100 p-6 sm:p-10 text-slate-900">
      <h1 className="text-3xl sm:text-5xl font-extrabold mb-6">Scan QR Code</h1>

      <div className="w-full max-w-sm bg-white rounded-lg shadow-md p-4 flex flex-col items-center gap-4">
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

        <div className="text-center mt-4">
          {result ? (
            <>
              <p className="text-green-600 font-semibold mb-2">QR Code detected!</p>
              <p className="break-words">{result}</p>
            </>
          ) : (
            <p className="text-slate-700">Arahkan kamera ke QR Code untuk memindai.</p>
          )}
          {error && <p className="text-red-600 mt-4">{error}</p>}
        </div>
      </div>
    </main>
  );
}
