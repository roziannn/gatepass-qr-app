"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, PlusCircle, User } from "lucide-react";

export default function CreateEventPage() {
  const [form, setForm] = useState({
    name: "",
    date: "",
    location: "",
    participants: "",
    status: "Aktif",
    description: "",
    photo: null as File | null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setForm((prev) => ({ ...prev, photo: e.target.files![0] }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    alert(`Menyimpan event:
Nama: ${form.name}
Tanggal: ${form.date}
Lokasi: ${form.location}
Peserta: ${form.participants}
Status: ${form.status}
Deskripsi: ${form.description}
Foto: ${form.photo ? form.photo.name : "Tidak ada foto"}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="flex items-center justify-end h-[72px] px-6 sm:px-10 border-b border-green-100 bg-white">
        <div className="flex items-center gap-3 cursor-pointer hover:bg-green-50 px-3 py-2 rounded-full transition-colors">
          <div className="w-10 h-10 flex items-center justify-center bg-green-100 rounded-full">
            <User className="w-6 h-6 text-green-700" />
          </div>
          <span className="hidden sm:inline text-green-900 font-medium">Administrator</span>
        </div>
      </header>
      <div className="my-6 px-6 sm:px-10">
        <div className="flex items-center gap-6">
          <Link href="/admin/data/event" className="flex items-center gap-2 text-green-700 hover:underline">
            <ArrowLeft className="w-5 h-5" />
            Back
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Tambah Event Baru</h1>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="max-w-4xl bg-white p-6 mx-6 rounded-xl shadow border border-green-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-4">
          {/* Nama Event */}
          <div>
            <label htmlFor="name" className="block font-semibold mb-1 text-slate-800">
              Nama Event
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Masukkan nama event"
              className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-green-400 text-slate-900"
            />
          </div>

          {/* Tanggal */}
          <div>
            <label htmlFor="date" className="block font-semibold mb-1 text-slate-800">
              Tanggal
            </label>
            <input id="date" name="date" type="date" value={form.date} onChange={handleChange} required className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-green-400 text-slate-900" />
          </div>

          {/* Lokasi */}
          <div>
            <label htmlFor="location" className="block font-semibold mb-1 text-slate-800">
              Lokasi
            </label>
            <input
              id="location"
              name="location"
              type="text"
              value={form.location}
              onChange={handleChange}
              required
              placeholder="Masukkan lokasi event"
              className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-green-400 text-slate-900"
            />
          </div>

          {/* Jumlah Peserta */}
          <div>
            <label htmlFor="participants" className="block font-semibold mb-1 text-slate-800">
              Jumlah Peserta
            </label>
            <input
              id="participants"
              name="participants"
              type="number"
              min={0}
              value={form.participants}
              onChange={handleChange}
              required
              placeholder="Masukkan jumlah peserta"
              className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-green-400 text-slate-900"
            />
          </div>

          {/* Status */}
          <div>
            <label htmlFor="status" className="block font-semibold mb-1 text-slate-800">
              Status
            </label>
            <select id="status" name="status" value={form.status} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-green-400 text-slate-900">
              <option value="Aktif">Aktif</option>
              <option value="Menunggu">Menunggu</option>
              <option value="Batal">Batal</option>
            </select>
          </div>
        </div>

        {/* Deskripsi full width */}
        <div className="mb-6">
          <label htmlFor="description" className="block font-semibold mb-1 text-slate-800">
            Deskripsi
          </label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Masukkan deskripsi event"
            rows={5}
            className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-green-400 text-slate-900 resize-none"
          />
        </div>

        <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition">
          Simpan Event
        </button>
      </form>
    </div>
  );
}
