"use client";

import { useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { User, Eye, ArrowUpDown } from "lucide-react";
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from "@headlessui/react";
import { Check } from "lucide-react";

interface Participant {
  id: number;
  name: string;
  email: string;
  registeredAt: string;
}

interface Event {
  id: number;
  name: string;
  participants: Participant[];
}

export default function ParticipantsPage() {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const events: Event[] = [
    {
      id: 1,
      name: "Seminar Teknologi",
      participants: [
        { id: 1, name: "Rina Wijaya", email: "rina@example.com", registeredAt: "10 Agustus 2025" },
        { id: 2, name: "Budi Santoso", email: "budi@example.com", registeredAt: "11 Agustus 2025" },
      ],
    },
    {
      id: 2,
      name: "Workshop Desain UI",
      participants: [{ id: 3, name: "Dewi Lestari", email: "dewi@example.com", registeredAt: "09 Agustus 2025" }],
    },
  ];

  const columns: TableColumn<Participant>[] = [
    { name: "Nama", selector: (row) => row.name, sortable: true, grow: 2 },
    { name: "Email", selector: (row) => row.email, sortable: true, grow: 2 },
    { name: "Terdaftar Pada", selector: (row) => row.registeredAt, sortable: true, grow: 1.5 },
    {
      name: "Aksi",
      cell: (row) => (
        <button className="p-1 rounded hover:bg-green-50 text-green-600">
          <Eye className="w-5 h-5" />
        </button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

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
        <h1 className="text-2xl font-bold text-slate-800 mb-4">Daftar Peserta Event</h1>

        <div className="mb-6 max-w-xs">
          <Listbox value={selectedEvent} onChange={setSelectedEvent}>
            <div className="relative">
              <ListboxButton className="relative w-full cursor-pointer rounded border border-gray-300 bg-white py-2 pl-3 pr-10 text-left text-gray-700 shadow-sm">
                <span>{selectedEvent ? selectedEvent.name : "Pilih Event"}</span>
                <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                  <ArrowUpDown className="w-4 h-4 text-gray-400" />
                </span>
              </ListboxButton>

              <ListboxOptions className="absolute z-10 mt-2 max-h-60 w-full overflow-auto rounded border border-gray-200 bg-white py-1 shadow-lg focus:outline-none">
                {events.map((event) => (
                  <ListboxOption key={event.id} value={event}>
                    {({ selected, active }) => (
                      <div className={`flex justify-between items-center cursor-pointer px-4 py-2 ${active ? "bg-green-100 text-green-800" : "text-gray-700"}`}>
                        {event.name}
                        {selected && <Check className="w-4 h-4 text-green-600" />}
                      </div>
                    )}
                  </ListboxOption>
                ))}
              </ListboxOptions>
            </div>
          </Listbox>
        </div>

        {/* Tabel peserta */}
        {selectedEvent ? (
          <DataTable columns={columns} data={selectedEvent.participants} pagination highlightOnHover responsive striped noHeader customStyles={customStyles} />
        ) : (
          <p className="text-gray-600">Silakan pilih event untuk melihat daftar peserta.</p>
        )}
      </main>
    </div>
  );
}
