"use client";

import { useState, useMemo, Fragment } from "react";
import Link from "next/link";
import { Eye, PlusCircle, Search, User, ArrowUpDown, Check } from "lucide-react";
import DataTable, { TableColumn } from "react-data-table-component";
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";

interface Event {
  id: number;
  name: string;
  date: string;
  location: string;
  category: string;
  quota: number;
  registered: number;
  status: string;
  statusColor: string;
}

export default function EventListPage() {
  const [filterText, setFilterText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const badgeColors: { [key: string]: string } = {
    "text-green-700": "bg-green-100 text-green-700",
    "text-yellow-600": "bg-yellow-100 text-yellow-600",
    "text-red-600": "bg-red-100 text-red-600",
  };

  const events: Event[] = [
    {
      id: 1,
      name: "Seminar Teknologi",
      date: "12 Agustus 2025",
      location: "Jakarta Convention Center",
      category: "Seminar",
      quota: 200,
      registered: 150,
      status: "Aktif",
      statusColor: "text-green-700",
    },
  ];

  const categories = Array.from(new Set(events.map((e) => e.category)));
  const statuses = Array.from(new Set(events.map((e) => e.status)));

  const columns: TableColumn<Event>[] = [
    { name: "Nama Event", selector: (row) => row.name, sortable: true, wrap: true, grow: 2.5 },
    { name: "Tanggal", selector: (row) => row.date, sortable: true, grow: 1.5 },
    { name: "Lokasi", selector: (row) => row.location, sortable: true, wrap: true, grow: 2.5 },
    { name: "Kategori", selector: (row) => row.category, sortable: true, grow: 1 },
    { name: "Kuota", selector: (row) => row.quota, sortable: true, right: true },
    { name: "Registered", selector: (row) => row.registered, sortable: true, right: true },
    {
      name: "Status",
      cell: (row) => <span className={`px-3 py-1 rounded-lg text-sm font-semibold ${badgeColors[row.statusColor]}`}>{row.status}</span>,
      sortable: true,
      center: true,
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
      <header className="flex items-center justify-end h-[72px] px-6 sm:px-10 border-b border-green-100 bg-white">
        <div className="flex items-center gap-3 cursor-pointer hover:bg-green-50 px-3 py-2 rounded-full transition-colors">
          <div className="w-10 h-10 flex items-center justify-center bg-green-100 rounded-full">
            <User className="w-6 h-6 text-green-700" />
          </div>
          <span className="hidden sm:inline text-green-900 font-medium">Administrator</span>
        </div>
      </header>

      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">Daftar Event</h1>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-6 mt-4">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="flex items-center bg-white rounded-md border border-gray-300 px-3 py-2 max-w-xs w-full sm:w-auto hover:border-green-500 transition">
              <Search className="w-5 h-5 text-gray-500 mr-2" />
              <input type="text" placeholder="Cari Event..." className="w-full border-none outline-none text-gray-700 placeholder-gray-400 text-sm" value={filterText} onChange={(e) => setFilterText(e.target.value)} />
            </div>

            <Listbox value={selectedCategory} onChange={setSelectedCategory}>
              <div className="relative w-full sm:w-48">
                <ListboxButton className="relative w-full cursor-pointer rounded border border-gray-300 bg-white py-2 pl-3 pr-10 text-left text-gray-700 shadow-sm">
                  <span>{selectedCategory || "Semua Kategori"}</span>
                  <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                    <ArrowUpDown className="w-4 h-4 text-gray-400" />
                  </span>
                </ListboxButton>
                <ListboxOptions className="absolute z-10 mt-2 max-h-60 w-full overflow-auto rounded border border-gray-200 bg-white py-1 shadow-lg focus:outline-none">
                  <ListboxOption key="all" value={null}>
                    {({ selected, active }) => (
                      <div className={`px-4 py-2 cursor-pointer ${active ? "bg-green-100 text-green-800" : "text-gray-700"}`}>
                        Semua Kategori
                        {selected && <Check className="w-4 h-4 text-green-600 inline ml-2" />}
                      </div>
                    )}
                  </ListboxOption>
                  {categories.map((cat) => (
                    <ListboxOption key={cat} value={cat}>
                      {({ selected, active }) => (
                        <div className={`px-4 py-2 cursor-pointer ${active ? "bg-green-100 text-green-800" : "text-gray-700"}`}>
                          {cat}
                          {selected && <Check className="w-4 h-4 text-green-600 inline ml-2" />}
                        </div>
                      )}
                    </ListboxOption>
                  ))}
                </ListboxOptions>
              </div>
            </Listbox>

            <Listbox value={selectedStatus} onChange={setSelectedStatus}>
              <div className="relative w-full sm:w-48">
                <ListboxButton className="relative w-full cursor-pointer rounded border border-gray-300 bg-white py-2 pl-3 pr-10 text-left text-gray-700 shadow-sm">
                  <span>{selectedStatus || "Semua Status"}</span>
                  <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                    <ArrowUpDown className="w-4 h-4 text-gray-400" />
                  </span>
                </ListboxButton>
                <ListboxOptions className="absolute z-10 mt-2 max-h-60 w-full overflow-auto rounded border border-gray-200 bg-white py-1 shadow-lg focus:outline-none">
                  <ListboxOption key="all" value={null}>
                    {({ selected, active }) => (
                      <div className={`px-4 py-2 cursor-pointer ${active ? "bg-green-100 text-green-800" : "text-gray-700"}`}>
                        Semua Status
                        {selected && <Check className="w-4 h-4 text-green-600 inline ml-2" />}
                      </div>
                    )}
                  </ListboxOption>
                  {statuses.map((st) => (
                    <ListboxOption key={st} value={st}>
                      {({ selected, active }) => (
                        <div className={`px-4 py-2 cursor-pointer ${active ? "bg-green-100 text-green-800" : "text-gray-700"}`}>
                          {st}
                          {selected && <Check className="w-4 h-4 text-green-600 inline ml-2" />}
                        </div>
                      )}
                    </ListboxOption>
                  ))}
                </ListboxOptions>
              </div>
            </Listbox>
          </div>
          <Link href="/admin/data/event/create" className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition">
            <PlusCircle className="w-5 h-5" />
            Tambah Event
          </Link>
        </div>

        <DataTable columns={columns} data={filteredEvents} pagination highlightOnHover responsive striped noHeader customStyles={customStyles} />
      </main>
    </div>
  );
}
