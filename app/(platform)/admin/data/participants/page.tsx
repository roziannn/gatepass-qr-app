"use client";

import { useState, useEffect } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { Eye, ArrowUpDown, Check } from "lucide-react";
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from "@headlessui/react";
import { Participant, EventParticipant } from "../../../../../types/participant";

import Header from "@/components/Header";

export default function ParticipantsPage() {
  const [events, setEvents] = useState<EventParticipant[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventParticipant | null>(null);
  const [loadingParticipants, setLoadingParticipants] = useState(false);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch("/api/events");
        const data: EventParticipant[] = await res.json();
        setEvents(data);
      } catch (err) {
        console.error("Gagal fetch events:", err);
      }
    }
    fetchEvents();
  }, []);

  // fetch participants saat event dipick
  const [participants, setParticipants] = useState<Participant[]>([]);

  const handleEventChange = async (event: EventParticipant) => {
    setSelectedEvent(event);
    setLoadingParticipants(true);
    try {
      const res = await fetch(`/api/events/${event.id}/participants`);
      const data: Participant[] = await res.json();
      setParticipants(data);
    } catch (err) {
      console.error("Gagal fetch participants:", err);
      setParticipants([]);
    } finally {
      setLoadingParticipants(false);
    }
  };

  const columns: TableColumn<Participant>[] = [
    { name: "No Tiket", selector: (row) => row.ticketCode, sortable: true, grow: 2 },
    { name: "Nama", selector: (row) => row.fullName, sortable: true, grow: 2 },
    { name: "Email", selector: (row) => row.email, sortable: true, grow: 2 },
    { name: "Register Date", selector: (row) => row.registeredAt, sortable: true, grow: 1.5 },
    { name: "Status", selector: (row) => row.status, sortable: true, grow: 2 },
    { name: "Scan Date", selector: (row) => row.scanDate, sortable: true, grow: 2 },
    {
      name: "Aksi",
      cell: () => (
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
      <Header />
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold text-slate-800 mb-4">Daftar Peserta Event</h1>

        <div className="mb-6 max-w-xs">
          <Listbox value={selectedEvent} onChange={handleEventChange}>
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

        {selectedEvent ? (
          loadingParticipants ? (
            <p>Loading peserta...</p>
          ) : (
            <DataTable columns={columns} data={participants} pagination highlightOnHover responsive striped noHeader customStyles={customStyles} />
          )
        ) : (
          <p className="text-gray-600">Silakan pilih event untuk melihat daftar peserta.</p>
        )}
      </main>
    </div>
  );
}
