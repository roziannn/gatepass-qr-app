"use client";

import { useState, useMemo, useEffect } from "react";
import { PlusCircle, Search, Trash2, Edit, User } from "lucide-react";
import DataTable, { TableColumn } from "react-data-table-component";
import { Description, Dialog, DialogPanel, DialogTitle, Field, Input, Label } from "@headlessui/react";

interface Category {
  id: number;
  name: string;
}

export default function EventCategoryListPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [filter, setFilter] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then(setCategories)
      .catch(console.error);
  }, []);

  const filteredCategories = useMemo(() => categories.filter((c) => c.name.toLowerCase().includes(filter.toLowerCase())), [filter, categories]);

  const openEditModal = (category: Category) => {
    setNewCategory(category.name);
    setEditingId(category.id);
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!newCategory.trim()) return;

    try {
      let res: Response, data: Category | { error: string };
      if (editingId) {
        res = await fetch(`/api/categories/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: newCategory }),
        });
        data = (await res.json()) as Category | { error: string };
        if (!res.ok) return alert("error" in data ? data.error : "Gagal mengedit kategori");
        setCategories(categories.map((c) => (c.id === editingId ? (data as Category) : c)));
      } else {
        res = await fetch("/api/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: newCategory }),
        });
        data = (await res.json()) as Category | { error: string };
        if (!res.ok) return alert("error" in data ? data.error : "Gagal membuat kategori");
        setCategories([...categories, data as Category]);
      }

      setModalOpen(false);
      setNewCategory("");
      setEditingId(null);
    } catch {
      alert("Terjadi kesalahan");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus kategori ini?")) return;
    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) return alert(data.error || "Gagal menghapus kategori");
      setCategories(categories.filter((c) => c.id !== id));
    } catch {
      alert("Terjadi kesalahan saat menghapus kategori");
    }
  };

  const columns: TableColumn<Category>[] = [
    { name: "Nama Kategori", selector: (row) => row.name, sortable: true, grow: 2 },
    {
      name: "Aksi",
      cell: (row) => (
        <div className="flex gap-2">
          <button className="p-1 rounded hover:bg-blue-50 text-blue-600" onClick={() => openEditModal(row)}>
            <Edit className="w-5 h-5" />
          </button>
          <button className="p-1 rounded hover:bg-red-50 text-red-600" onClick={() => handleDelete(row.id)}>
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="flex justify-end h-[72px] px-6 sm:px-10 border-b border-green-100 bg-white items-center gap-3">
        <div className="flex items-center gap-3 cursor-pointer hover:bg-green-50 px-3 py-2 rounded-full transition-colors">
          <div className="w-10 h-10 flex items-center justify-center bg-green-100 rounded-full">
            <User className="w-6 h-6 text-green-700" />
          </div>
          <span className="hidden sm:inline text-green-900 font-medium">Administrator</span>
        </div>
      </header>

      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold text-slate-800 mb-6">Daftar Kategori Event</h1>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-6">
          <div className="flex items-center bg-white border border-gray-300 rounded-md px-3 py-2 max-w-xs w-full sm:w-auto hover:border-green-500 transition">
            <Search className="w-5 h-5 text-gray-500 mr-2" />
            <input type="text" placeholder="Cari Kategori..." value={filter} onChange={(e) => setFilter(e.target.value)} className="w-full border-none outline-none text-gray-700 placeholder-gray-400 text-sm" />
          </div>

          <button
            onClick={() => {
              setModalOpen(true);
              setEditingId(null);
              setNewCategory("");
            }}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
          >
            <PlusCircle className="w-5 h-5" /> Tambah Kategori
          </button>
        </div>

        <DataTable columns={columns} data={filteredCategories} pagination highlightOnHover responsive striped noHeader customStyles={{ headCells: { style: { fontWeight: "bold", fontSize: 16 } }, rows: { style: { fontSize: 15 } } }} />

        <Dialog
          open={modalOpen}
          as="div"
          className="relative z-50"
          onClose={() => {
            setModalOpen(false);
            setEditingId(null);
          }}
        >
          <div className="fixed inset-0 bg-black/30" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <DialogPanel className="w-full max-w-md rounded-xl bg-white p-6">
              <DialogTitle className="text-lg font-bold mb-2 text-slate-800">{editingId ? "Edit Kategori" : "Tambah Kategori"}</DialogTitle>
              <Field className="space-y-3">
                <Label className="text-sm font-semibold text-slate-700">Nama Kategori</Label>
                <Input
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="mt-1 block w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring focus:ring-green-200"
                />
                <Description className="text-sm text-gray-500">Masukkan nama kategori event.</Description>
              </Field>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-slate-700"
                  onClick={() => {
                    setModalOpen(false);
                    setEditingId(null);
                  }}
                >
                  Batal
                </button>
                <button className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700" onClick={handleSave}>
                  Simpan
                </button>
              </div>
            </DialogPanel>
          </div>
        </Dialog>
      </main>
    </div>
  );
}
