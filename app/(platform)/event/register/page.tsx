"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, FormInput } from "lucide-react";
import Link from "next/link";
import Footer from "@/components/Footer";

interface EventOption {
  id: number;
  name: string;
}

export default function Register() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [selectedEventId, setSelectedEventId] = useState<number | "">("");
  const [events, setEvents] = useState<EventOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

      const eventName = events.find((ev) => ev.id === selectedEventId)?.name || "";

      sessionStorage.setItem(
        "participant",
        JSON.stringify({
          fullName,
          email,
          eventName,
          ticketCode: data.participant.ticketCode,
        })
      );

      setTimeout(() => {
        router.push("/event/register/success");
      }, 3000);
    } catch (err) {
      console.error(err);
      setError("Terjadi kesalahan saat mendaftar");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-white via-green-50 to-green-100 p-6 sm:p-10 text-slate-900">
        <div className="w-full max-w-md flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <Link href="/" className="flex items-center gap-1 text-green-600 hover:text-green-800 text-sm font-semibold w-fit">
              <ArrowLeft className="w-4 h-4" /> Kembali
            </Link>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800">Formulir Pendaftaran</h1>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6 bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-green-200">
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
                className="mt-2 px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-500 text-slate-900 w-full text-base sm:text-lg"
                required
              />
            </div>

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
                className="mt-2 px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-500 text-slate-900 w-full text-base sm:text-lg"
                required
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="birthDate" className="font-semibold text-slate-700 text-base">
                Tanggal Lahir
              </label>
              <input
                id="birthDate"
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="mt-2 px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-500 text-slate-900 w-full text-base sm:text-lg"
                required
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="event" className="font-semibold text-slate-700 text-base">
                Pilih Event
              </label>
              <select
                id="event"
                value={selectedEventId}
                onChange={(e) => setSelectedEventId(Number(e.target.value))}
                className="mt-2 px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-500 text-slate-900 w-full text-base sm:text-lg"
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
              disabled={loading || events.length === 0}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-base sm:text-lg font-semibold rounded-xl shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
            >
              <FormInput className="w-5 h-5" />
              {loading ? "Mendaftar..." : "Daftar Sekarang"}
            </button>

            {error && <p className="text-red-600 font-semibold text-center text-sm sm:text-base">{error}</p>}
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
