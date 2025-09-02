"use client";

import { useEffect, useState } from "react";
import DownloadTicket from "../downloadTicket";
import { CheckCircle } from "lucide-react";

interface Participant {
  fullName: string;
  email: string;
  eventName: string;
  ticketCode: string;
}

export default function SuccessPage() {
  const [participant, setParticipant] = useState<Participant | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const stored = sessionStorage.getItem("participant");
    if (stored) {
      const part: Participant = JSON.parse(stored);
      setParticipant(part);

      setTimeout(() => {
        sessionStorage.removeItem("participant");
      }, 15000);
    }
  }, []);

  if (!participant) return <p className="text-center text-lg mt-10">Data tiket tidak ditemukan.</p>;

  const qrData = JSON.stringify(participant);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white via-green-50 to-green-100 p-6 sm:p-10 text-slate-900">
      <div className="flex flex-col items-center gap-4 bg-white p-8 rounded-2xl shadow-lg shadow-green-200 border border-green-200">
        <CheckCircle className="w-16 h-16 text-green-600" />
        <h1 className="text-3xl sm:text-4xl font-extrabold text-green-700 text-center">Pendaftaran Berhasil!</h1>
        <p className="text-slate-700 text-center text-lg">
          Hai <span className="font-semibold">{participant.fullName}</span>, tiket untuk acara <span className="font-semibold">{participant.eventName}</span> sudah berhasil dibuat.
        </p>

        <DownloadTicket qrData={qrData} fullName={participant.fullName} email={participant.email} eventName={participant.eventName} ticketCode={participant.ticketCode} />
      </div>
    </main>
  );
}
