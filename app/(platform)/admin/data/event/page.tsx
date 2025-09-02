"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Eye, PlusCircle, Search } from "lucide-react";
import DataTable, { TableColumn } from "react-data-table-component";
import { ApiEvent, EventListItem } from "../../../../../types/event";
import { toast } from "react-toastify";
import Header from "@/components/Header";
import Badge from "@/components/Badge";
import SelectList from "@/components/SelectList";

export default function EventListPage() {
  const [events, setEvents] = useState<EventListItem[]>([]);
  const [filterText, setFilterText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch("/api/events")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Gagal fetch data event");
        }
        return res.json();
      })
      .then((data: ApiEvent[]) => {
        const mapped: EventListItem[] = data.map((e) => ({
          id: e.id,
          name: e.name,
          date: new Date(e.date).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
          location: e.location,
          category: e.category.name,
          quota: e.quota,
          registered: e.participantCount,
          status: e.status,
          statusColor: e.status === "ACTIVE" ? "text-blue-700" : e.status === "PENDING" ? "text-yellow-600" : "text-red-600",
          createdAt: new Date(e.createdAt).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
        }));
        setEvents(mapped);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Gagal memuat data event!");
      })
      .finally(() => setLoading(false));
  }, []);

  const categories = Array.from(new Set(events.map((e) => e.category)));
  const statuses = Array.from(new Set(events.map((e) => e.status)));

  const columns: TableColumn<EventListItem>[] = [
    {
      name: "Nama Event",
      selector: (row) => row.name,
      sortable: true,
      wrap: true,
      grow: 3,
      minWidth: "200px",
    },
    {
      name: "Tanggal",
      selector: (row) => row.date,
      sortable: true,
      grow: 1.5,
      minWidth: "110px",
    },
    {
      name: "Lokasi",
      selector: (row) => row.location,
      sortable: true,
      wrap: true,
      grow: 3,
      minWidth: "180px",
    },
    {
      name: "Kategori",
      selector: (row) => row.category,
      sortable: true,
      grow: 1,
      minWidth: "120px",
    },
    {
      name: "Kuota",
      selector: (row) => row.quota,
      sortable: true,
      right: true,
      grow: 0.8,
      minWidth: "80px",
    },
    {
      name: "Reg",
      selector: (row) => row.registered,
      sortable: true,
      right: true,
      grow: 0.8,
      minWidth: "90px",
    },
    {
      name: "CreatedAt",
      selector: (row) => row.createdAt,
      sortable: true,
      grow: 1.2,
      minWidth: "120px",
    },
    {
      name: "Status",
      cell: (row) => {
        const titleCase = row.status.charAt(0).toUpperCase() + row.status.slice(1).toLowerCase();
        return <Badge statusColor={row.statusColor}>{titleCase}</Badge>;
      },
      sortable: true,
      center: true,
      grow: 1.5,
      minWidth: "100px",
    },
    {
      name: "Aksi",
      cell: (row) => (
        <Link href={`/admin/data/event/${row.id}`} className="p-1 rounded hover:bg-green-50 text-green-600">
          <Eye className="w-5 h-5" />
        </Link>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      grow: 0.5,
      minWidth: "70px",
    },
  ];

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesText = event.name.toLowerCase().includes(filterText.toLowerCase());
      const matchesCategory = selectedCategory ? event.category === selectedCategory : true;
      const matchesStatus = selectedStatus ? event.status === selectedStatus : true;
      return matchesText && matchesCategory && matchesStatus;
    });
  }, [filterText, selectedCategory, selectedStatus, events]);

  const customStyles = {
    headCells: { style: { fontWeight: "bold", fontSize: "16px" } },
    rows: { style: { fontSize: "15px" } },
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <main className="flex-1 p-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-6">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="flex items-center bg-white rounded-md border border-gray-300 px-3 py-2 max-w-xs w-full sm:w-auto hover:border-green-500 transition">
              <Search className="w-5 h-5 text-gray-500 mr-2" />
              <input type="text" placeholder="Cari Event..." className="w-full border-none outline-none text-gray-700 placeholder-gray-400 text-sm" value={filterText} onChange={(e) => setFilterText(e.target.value)} />
            </div>

            {/* Listbox Kategori dan Status */}
            <SelectList value={selectedCategory} onChange={setSelectedCategory} options={categories} placeholder="Semua Kategori" />
            <SelectList value={selectedStatus} onChange={setSelectedStatus} options={statuses} placeholder="Semua Status" />
          </div>

          <Link href="/admin/data/event/create" className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition">
            <PlusCircle className="w-5 h-5" />
            Add Event
          </Link>
        </div>

        <div className="relative">
          {loading && (
            <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10">
              <div className="w-12 h-12 border-4 border-t-green-600 border-green-300 rounded-full animate-spin"></div>
            </div>
          )}

          <DataTable
            columns={columns}
            data={filteredEvents}
            pagination
            highlightOnHover
            responsive
            striped
            noHeader
            progressPending={loading}
            customStyles={customStyles}
            noDataComponent={!loading ? <div className="p-4 text-center text-gray-500">There are no records to display</div> : null}
          />
        </div>
      </main>
    </div>
  );
}
