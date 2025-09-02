"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, FormInput } from "lucide-react";
import DownloadTicket from "./downloadTicket"; // import component partial

interface EventOption {
  id: number;
  name: string;
}

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [selectedEventId, setSelectedEventId] = useState<number | "">("");
  const [events, setEvents] = useState<EventOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [qrData, setQrData] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch("/api/events");
        const data = await res.json();
        setEvents(data || []);
      } catch (err) {
        console.error("Gagal fetch events:", err);
      }
    }
    fetchEvents();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setQrData(null);

    if (!fullName.trim() || !email.trim() || !birthDate.trim() || !selectedEventId) {
      setError("Semua field wajib diisi.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Format email tidak valid.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/participants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, birthDate, eventId: selectedEventId }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Gagal mendaftar");
        setLoading(false);
        return;
      }

      setSuccess(true);
      const qrString = JSON.stringify({
        id: data.participant.id,
        fullName: data.participant.fullName,
        email: data.participant.email,
        eventId: data.participant.eventId,
        ticketCode: data.participant.ticketCode,
      });
      setQrData(qrString);
    } catch (err) {
      console.error(err);
      setError("Terjadi kesalahan saat mendaftar");
    } finally {
      setLoading(false);
    }
  };

  const selectedEventName = events.find((ev) => ev.id === selectedEventId)?.name || "";

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white via-green-50 to-green-100 p-6 sm:p-10 text-slate-900">
      <div className="w-full max-w-lg flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <Link href="/" className="flex items-center gap-1 text-green-600 hover:text-green-800 text-sm font-semibold w-fit">
            <ArrowLeft className="w-4 h-4" /> Kembali
          </Link>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800">Formulir Pendaftaran</h1>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 bg-white p-8 rounded-2xl shadow-lg shadow-green-200 border border-green-200">
          {/* Nama Lengkap */}
          <div className="flex flex-col">
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
              required
            />
          </div>

          {/* Email */}
          <div className="flex flex-col">
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
              required
            />
          </div>

          {/* Tanggal Lahir */}
          <div className="flex flex-col">
            <label htmlFor="birthDate" className="font-semibold text-slate-700 text-base">
              Tanggal Lahir
            </label>
            <input
              id="birthDate"
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="mt-2 px-5 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-500 text-slate-900 w-full text-lg"
              required
            />
          </div>

          {/* Pilih Event */}
          <div className="flex flex-col">
            <label htmlFor="event" className="font-semibold text-slate-700 text-base">
              Pilih Event
            </label>
            <select
              id="event"
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(Number(e.target.value))}
              className="mt-2 px-5 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-500 text-slate-900 w-full text-lg"
              required
            >
              <option value="">-- Pilih Event --</option>
              {events.map((ev) => (
                <option key={ev.id} value={ev.id}>
                  {ev.name}
                </option>
              ))}
            </select>
          </div>

          {/* Tombol Submit */}
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-lg font-semibold rounded-xl shadow-lg shadow-green-300/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
          >
            <FormInput className="w-6 h-6" />
            {loading ? "Mendaftar..." : "Daftar Sekarang"}
          </button>
        </form>

        {error && <p className="text-red-600 font-semibold text-center text-lg">{error}</p>}

        {success && qrData && <DownloadTicket qrData={qrData} fullName={fullName} email={email} eventName={selectedEventName} ticketCode={JSON.parse(qrData).ticketCode} />}
      </div>
    </main>
  );
}
