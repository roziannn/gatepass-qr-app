"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-toastify";

interface Category {
  id: number;
  name: string;
}

interface Event {
  id: number;
  name: string;
  date: string;
  location: string;
  quota: number;
  categoryId: number;
  description: string;
  status: "PENDING" | "ACTIVE" | "CANCELLED" | "FINISHED";
}

export default function EventDetailPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({
    name: "",
    date: "",
    location: "",
    participants: "",
    categoryId: "",
    description: "",
    status: "ACTIVE", // default value
  });

  const router = useRouter();
  const params = useParams();
  const { id } = params;

  // Ambil kategori
  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data: Category[]) => setCategories(data))
      .catch(console.error);
  }, []);

  // Ambil detail event
  useEffect(() => {
    if (!id) return;
    fetch(`/api/events/${id}`)
      .then((res) => res.json())
      .then((data: Event) => {
        setForm({
          name: data.name,
          date: data.date.split("T")[0],
          location: data.location,
          participants: String(data.quota),
          categoryId: String(data.categoryId),
          description: data.description || "",
          status: data.status || "ACTIVE",
        });
      })
      .catch(() => toast.error("Gagal memuat detail event"));
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(`/api/events/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          date: form.date,
          location: form.location,
          quota: Number(form.participants),
          categoryId: Number(form.categoryId),
          description: form.description,
          status: form.status,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Gagal memperbarui event");
        return;
      }

      toast.success("Event berhasil diperbarui");
      setTimeout(() => router.push("/admin/data/event"), 1000);
    } catch {
      toast.error("Terjadi kesalahan saat update event");
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
          <h1 className="text-2xl font-bold text-slate-900">Detail & Edit Event</h1>
        </div>
      </div>

      <form onSubmit={handleUpdate} className="max-w-4xl bg-white p-6 mx-6 rounded-xl shadow border border-green-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-4">
          {/* Nama Event */}
          <div>
            <label className="block font-semibold mb-1 text-slate-800">Nama Event</label>
            <input name="name" type="text" value={form.name} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-green-400 text-slate-900" />
          </div>

          {/* Tanggal */}
          <div>
            <label className="block font-semibold mb-1 text-slate-800">Tanggal</label>
            <input name="date" type="date" value={form.date} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-green-400 text-slate-900" />
          </div>

          {/* Lokasi */}
          <div>
            <label className="block font-semibold mb-1 text-slate-800">Lokasi</label>
            <input name="location" type="text" value={form.location} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-green-400 text-slate-900" />
          </div>

          {/* Jumlah Peserta */}
          <div>
            <label className="block font-semibold mb-1 text-slate-800">Jumlah Peserta</label>
            <input name="participants" type="number" value={form.participants} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-green-400 text-slate-900" />
          </div>

          {/* Kategori */}
          <div>
            <label className="block font-semibold mb-1 text-slate-800">Kategori</label>
            <select name="categoryId" value={form.categoryId} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-green-400 text-slate-900">
              <option value="">Pilih Kategori</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block font-semibold mb-1 text-slate-800">Status</label>
            <select name="status" value={form.status} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-green-400 text-slate-900">
              <option value="PENDING">Pending</option>
              <option value="ACTIVE">Active</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="FINISHED">Finished</option>
            </select>
          </div>
        </div>

        {/* Deskripsi */}
        <div className="mb-6">
          <label className="block font-semibold mb-1 text-slate-800">Deskripsi</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={5} className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-green-400 text-slate-900 resize-none" />
        </div>

        <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition">
          Update Event
        </button>
      </form>
    </div>
  );
}
