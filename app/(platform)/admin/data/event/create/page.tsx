"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface Category {
  id: number;
  name: string;
}

export default function CreateEventPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({
    name: "",
    date: "",
    location: "",
    participants: "",
    categoryId: "",
    description: "",
    photo: null as File | null,
  });

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data: Category[]) => setCategories(data))
      .catch(console.error);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.categoryId) {
      toast.warning("Kategori wajib dipilih");
      return;
    }

    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          date: form.date,
          location: form.location,
          quota: Number(form.participants),
          categoryId: Number(form.categoryId),
          description: form.description,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Gagal menyimpan event");
        return;
      }

      toast.success(`Event berhasil dibuat: ${data.name}`);

      setTimeout(() => {
        router.push("/admin/data/event");
      }, 1000);
    } catch (err) {
      console.error(err);
      toast.error("Terjadi kesalahan saat menyimpan event");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

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

          {/* Kategori Event */}
          <div>
            <label htmlFor="categoryId" className="block font-semibold mb-1 text-slate-800">
              Kategori Event
            </label>
            <select id="categoryId" name="categoryId" value={form.categoryId} onChange={handleChange} required className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-green-400 text-slate-900">
              <option value="">Pilih Kategori</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
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
