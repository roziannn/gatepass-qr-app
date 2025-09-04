"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Search, X } from "lucide-react";
import Link from "next/link";
import QRCode from "react-qr-code";
import Footer from "@/components/Footer";

interface EventOption {
  id: number;
  name: string;
}

interface Participant {
  id: string;
  fullName: string;
  email: string;
  ticketCode: string;
  event: string;
  date: string;
  location: string;
  seat: string;
}

export default function Lookup() {
  const [email, setEmail] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [selectedEventId, setSelectedEventId] = useState<number | "">("");
  const [events, setEvents] = useState<EventOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Participant | null>(null);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

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
    setResult(null);

    if (!email.trim() || !birthDate.trim() || !selectedEventId) {
      setError("Email, tanggal lahir, dan event wajib diisi.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Format email tidak valid.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/participants/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          birthDate,
          eventId: selectedEventId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Data tidak ditemukan. Silakan coba lagi.");
      } else {
        setResult(data.participant);
        setShowModal(true); // buka modal
      }
    } catch (err) {
      console.error(err);
      setError("Terjadi kesalahan server. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-white via-green-50 to-green-100 p-6 sm:p-10 text-slate-900">
        <div className="w-full max-w-lg flex flex-col gap-8">
          {/* Header */}
          <div className="flex flex-col gap-2">
            <Link href="/" className="flex items-center gap-1 text-green-600 hover:text-green-800 text-sm font-semibold w-fit">
              <ArrowLeft className="w-4 h-4" /> Kembali
            </Link>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800">Cari Tiket Anda</h1>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6 bg-white p-8 rounded-2xl shadow-lg shadow-green-200 border border-green-200">
            <div>
              <label className="font-semibold text-slate-700 text-base">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="contoh@domain.com"
                className="mt-2 px-5 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-500 w-full text-lg text-slate-900"
                disabled={loading}
                required
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 text-base">Tanggal Lahir</label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="mt-2 px-5 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-500 w-full text-lg text-slate-900"
                disabled={loading}
                required
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 text-base">Pilih Event</label>
              <select
                value={selectedEventId}
                onChange={(e) => setSelectedEventId(Number(e.target.value))}
                className="mt-2 px-5 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-500 w-full text-lg text-slate-900"
                disabled={loading || events.length === 0}
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

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-lg font-semibold rounded-xl shadow-lg shadow-green-300/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
            >
              <Search className="w-6 h-6" />
              {loading ? "Mencari..." : "Cari Tiket"}
            </button>
          </form>

          {error && <p className="text-red-600 font-semibold text-center text-lg">{error}</p>}
        </div>

        {/* Modal */}
        {showModal && result && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 relative">
              <button onClick={() => setShowModal(false)} className="absolute top-3 right-3 text-slate-500 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col items-center gap-6">
                <h1 className="text-xl font-bold text-green-600">Ticket Found!</h1>
                <div className="flex justify-center my-2">
                  <QRCode value={JSON.stringify(result)} size={180} />
                </div>

                <div className="w-full flex flex-col gap-2 bg-green-50 p-4 rounded-lg border border-green-200 text-center">
                  <p className="text-sm font-semibold text-slate-600 mt-2">Ticket ID</p>
                  <p className="text-base font-mono bg-slate-100 px-3 py-1 rounded-lg shadow-inner">{result.ticketCode}</p>

                  <p className="font-bold text-slate-800">{result.fullName}</p>
                  <p className="text-base text-slate-800">{result.email}</p>

                  <p className="text-sm font-semibold text-slate-600 mt-4">Event</p>
                  <p className="text-base text-slate-800">{result.event}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
