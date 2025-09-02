"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, Trash2, Edit, Save, X } from "lucide-react";
import DataTable, { TableColumn } from "react-data-table-component";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "@/components/Header";
import ModalConfirm from "@/components/ModalConfirm";
import { Button } from "@headlessui/react";

interface Category {
  id: number;
  name: string;
}

export default function EventCategoryListPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [filter, setFilter] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteName, setDeleteName] = useState<string>("");

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then(setCategories)
      .catch(() => toast.error("Gagal memuat kategori"));
  }, []);

  const filteredCategories = useMemo(() => categories.filter((c) => c.name.toLowerCase().includes(filter.toLowerCase())), [filter, categories]);

  const handleSave = async () => {
    if (!newCategory.trim()) {
      toast.warning("Nama kategori tidak boleh kosong");
      return;
    }

    try {
      let res: Response, data: Category | { error: string };

      if (editingId) {
        // update
        res = await fetch(`/api/categories/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: newCategory }),
        });
        data = await res.json();
        if (!res.ok) return toast.error("Gagal update kategori");
        setCategories(categories.map((c) => (c.id === editingId ? (data as Category) : c)));
        toast.success("Kategori berhasil diubah");
      } else {
        // create
        res = await fetch("/api/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: newCategory }),
        });
        data = await res.json();
        if (!res.ok) return toast.error("Gagal tambah kategori");
        setCategories([...categories, data as Category]);
        toast.success("Kategori berhasil ditambahkan");
      }

      setNewCategory("");
      setEditingId(null);
    } catch {
      toast.error("Terjadi kesalahan");
    }
  };

  const handleDeleteClick = (id: number, name: string) => {
    setDeleteId(id);
    setDeleteName(name);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/categories/${deleteId}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setCategories(categories.filter((c) => c.id !== deleteId));
      toast.success("Kategori berhasil dihapus");
    } catch {
      toast.error("Gagal menghapus kategori");
    } finally {
      setConfirmOpen(false);
      setDeleteId(null);
      setDeleteName("");
    }
  };

  const columns: TableColumn<Category>[] = [
    { name: "Nama Kategori", selector: (row) => row.name, sortable: true, grow: 2 },
    {
      name: "Aksi",
      cell: (row) => (
        <div className="flex gap-2">
          <button
            className="p-1 rounded hover:bg-blue-50 text-slate-600"
            onClick={() => {
              setNewCategory(row.name);
              setEditingId(row.id);
            }}
          >
            <Edit className="w-5 h-5" />
          </button>
          <button className="p-1 rounded hover:bg-red-50 text-red-600" onClick={() => handleDeleteClick(row.id, row.name)}>
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
      <Header />
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">Data Category</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 mt-4">
          {/* LEFT SIDE */}
          <div className="md:col-span-2">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-6">
              <div className="flex items-center bg-white border border-gray-300 rounded-md px-3 py-2 max-w-xs w-full sm:w-auto hover:border-green-500 transition">
                <Search className="w-5 h-5 text-gray-500 mr-2" />
                <input type="text" placeholder="Cari Kategori..." value={filter} onChange={(e) => setFilter(e.target.value)} className="w-full border-none outline-none text-gray-700 placeholder-gray-400 text-sm" />
              </div>
            </div>

            <DataTable
              columns={columns}
              data={filteredCategories}
              pagination
              highlightOnHover
              responsive
              striped
              noHeader
              customStyles={{
                headCells: { style: { fontWeight: "bold", fontSize: 16 } },
                rows: { style: { fontSize: 15 } },
              }}
            />
          </div>

          {/* RIGHT SIDE */}
          <div className="border-l p-5">
            <h2 className="text-lg font-bold mb-4 text-slate-800">{editingId ? "Edit Kategori" : "Tambah Kategori"}</h2>
            <div className="flex flex-col gap-3">
              <div className="flex items-center bg-white border border-gray-300 rounded-md p-3 max-w-xs w-full sm:w-auto hover:border-green-500 transition">
                <input type="text" placeholder="Nama kategori" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} className="w-full border-none outline-none text-gray-700 placeholder-gray-400 text-sm" />
              </div>

              <div className="flex gap-2">
                <Button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700" onClick={handleSave}>
                  <Save className="w-4 h-4" />
                  <span>Save</span>
                </Button>

                {editingId && (
                  <button
                    className="flex items-center gap-1 px-4 py-2 rounded-lg bg-gray-200 text-slate-700 hover:bg-gray-300"
                    onClick={() => {
                      setEditingId(null);
                      setNewCategory("");
                    }}
                  >
                    <X className="w-4 h-4" /> Batal
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <ModalConfirm isOpen={confirmOpen} title="Konfirmasi Hapus" message={`Apakah Anda yakin ingin menghapus kategori "${deleteName}"?`} onClose={() => setConfirmOpen(false)} onConfirm={handleConfirmDelete} />
      </main>
    </div>
  );
}
