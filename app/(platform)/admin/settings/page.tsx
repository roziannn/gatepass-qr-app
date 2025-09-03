"use client";

import { useState } from "react";
import Header from "@/components/Header";
import { Trash, Download, Upload } from "lucide-react";
import { toast } from "react-toastify";

export default function AdminSettingsPage() {
  const [siteName, setSiteName] = useState("GATEPASS");
  const [adminEmail, setAdminEmail] = useState("admin@example.com");
  const [showWipeModal, setShowWipeModal] = useState(false);
  const [restoreFile, setRestoreFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleWipeDatabase = async () => {
    setLoading(true);
    try {
      await fetch("/api/admin/wipe", { method: "POST" });
      toast.success("Database berhasil dihapus!");
      setShowWipeModal(false);
    } catch (err) {
      console.error(err);
      toast.error("Gagal menghapus database!");
    } finally {
      setLoading(false);
    }
  };

  const handleBackupDatabase = async () => {
    const res = await fetch("/api/backup");
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "gatepass_app_qr_backup.sql";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRestoreDatabase = async () => {
    if (!restoreFile) return toast.error("Silakan pilih file backup");
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", restoreFile);

      await fetch("/api/admin/restore", { method: "POST", body: formData });
      toast.success("Database berhasil direstore!");
    } catch (err) {
      console.error(err);
      toast.error("Gagal restore database!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <main className="flex-1 p-6 space-y-6">
        {/* General Settings */}
        <section className="p-6 rounded-xl shadow border border-gray-200 text-slate-800 space-y-4">
          <h2 className="text-xl font-semibold">General</h2>
          <div>
            <label className="block font-medium mb-1">Site Name</label>
            <input type="text" value={siteName} readOnly className="w-full border border-gray-300 rounded px-3 py-2 outline-none  bg-gray-100 text-slate-800" />
          </div>

          <div>
            <label className="block font-medium mb-1">Admin Email</label>
            <input type="email" value={adminEmail} readOnly className="w-full border border-gray-300 rounded px-3 py-2 outline-none  bg-gray-100 text-slate-800" />
          </div>
        </section>

        {/* View System Logs */}
        <section className="p-6 rounded-xl shadow border border-gray-200 text-slate-800 space-y-4">
          <h2 className="text-xl font-semibold">View System Logs</h2>
          <p>Lihat logs aktivitas sistem (next feature 🚀)</p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">View Logs</button>
        </section>

        {/* Database Settings */}
        <section className="bg-slate-100 p-6 rounded-xl shadow border border-red-300 text-slate-800 space-y-4">
          <h2 className="text-xl font-semibold text-red-600">Database Settings (Danger Zone)</h2>
          <p className="text-slate-700">Perhatian: Area ini hanya untuk admin super, perlu konfirmasi ekstra.</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button onClick={() => setShowWipeModal(true)} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg">
              <Trash className="w-4 h-4" /> Wipe Database
            </button>
            <button onClick={handleBackupDatabase} className="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg">
              <Download className="w-4 h-4" /> Backup Database
            </button>

            <div className="flex items-center gap-2">
              <input type="file" accept=".sql,.zip" onChange={(e) => setRestoreFile(e.target.files?.[0] || null)} className="border border-gray-300 rounded px-3 py-2 bg-white text-slate-800" />
              <button onClick={handleRestoreDatabase} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">
                <Upload className="w-4 h-4" /> Restore Database
              </button>
            </div>
          </div>
        </section>

        {/* Wipe Modal */}
        {showWipeModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-slate-100 p-6 rounded-xl shadow-lg w-96 space-y-4 text-slate-800">
              <h3 className="text-lg font-bold text-red-600">Konfirmasi Wipe Database</h3>
              <p>
                Kamu yakin ingin menghapus semua data? Tindakan ini <strong>tidak bisa dibatalkan</strong>.
              </p>
              <div className="flex justify-end gap-3 mt-4">
                <button onClick={() => setShowWipeModal(false)} className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100">
                  Batal
                </button>
                <button onClick={handleWipeDatabase} disabled={loading} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded">
                  {loading ? "Processing..." : "Wipe Database"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
