"use client";

import { useState, useMemo } from "react";
import { usePathname } from "next/navigation";
import { Users, Calendar, User, Search, SlidersHorizontal, CheckCircle, Ticket } from "lucide-react";
import DataTable, { TableColumn } from "react-data-table-component";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, LineChart, Line } from "recharts";
import Header from "@/components/Header";

interface Event {
  id: number;
  name: string;
  date: string;
  participants: number;
  kuota: number;
  status: string;
  statusColor: string;
}

export default function AdminDashboard() {
  const [filterText, setFilterText] = useState("");
  // const pathname = usePathname();

  const barChartData = [
    { month: "Jan", events: 3 },
    { month: "Feb", events: 5 },
    { month: "Mar", events: 4 },
    { month: "Apr", events: 7 },
    { month: "Mei", events: 6 },
    { month: "Jun", events: 8 },
    { month: "Jul", events: 5 },
    { month: "Agu", events: 9 },
  ];

  const participantsChartData = [
    { month: "Jan", participants: 120 },
    { month: "Feb", participants: 180 },
    { month: "Mar", participants: 90 },
    { month: "Apr", participants: 160 },
    { month: "Mei", participants: 130 },
    { month: "Jun", participants: 200 },
    { month: "Jul", participants: 170 },
    { month: "Agu", participants: 210 },
  ];

  const events: Event[] = [
    {
      id: 1,
      name: "Seminar Teknologi",
      date: "12 Agustus 2025",
      participants: 150,
      kuota: 150,
      status: "Aktif",
      statusColor: "text-green-700",
    },
    {
      id: 2,
      name: "Workshop AI",
      date: "5 September 2025",
      participants: 80,
      kuota: 100,
      status: "Aktif",
      statusColor: "text-green-700",
    },
    {
      id: 3,
      name: "Konser Amal",
      date: "20 Oktober 2025",
      participants: 90,
      kuota: 100,
      status: "Menunggu",
      statusColor: "text-yellow-600",
    },
  ];

  const stats = [
    {
      title: "Total Event",
      value: "12",
      icon: <Calendar className="w-8 h-8 text-green-600 mx-auto mb-2" />,
    },
    {
      title: "Total Peserta",
      value: "320",
      icon: <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />,
    },
    {
      title: "Check-in Hari Ini",
      value: "58",
      icon: <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />,
    },
    {
      title: "Tiket Terjual",
      value: "280",
      icon: <Ticket className="w-8 h-8 text-green-600 mx-auto mb-2" />,
    },
  ];

  const badgeColors: { [key: string]: string } = {
    "text-green-700": "bg-green-100 text-green-700",
    "text-yellow-600": "bg-yellow-100 text-yellow-600",
  };

  const columns: TableColumn<Event>[] = [
    {
      name: "Nama Event",
      selector: (row) => row.name,
      sortable: true,
      wrap: true,
    },
    {
      name: "Tanggal",
      selector: (row) => row.date,
      sortable: true,
      wrap: true,
    },
    {
      name: "Kuota",
      selector: (row) => row.kuota,
      sortable: true,
      right: true,
    },
    {
      name: "Peserta",
      selector: (row) => row.participants,
      sortable: true,
      right: true,
    },
    {
      name: "Status",
      selector: (row) => row.status,
      cell: (row) => <span className={`px-3 py-1 rounded-lg text-sm font-semibold ${badgeColors[row.statusColor] || "bg-gray-100 text-gray-700"}`}>{row.status}</span>,
      sortable: true,
      center: true,
    },
  ];

  const filteredEvents = useMemo(() => {
    if (!filterText) return events;
    return events.filter((event) => event.name.toLowerCase().includes(filterText.toLowerCase()));
  }, [filterText, events]);

  const customStyles = {
    headCells: {
      style: {
        fontWeight: "bold",
        fontSize: "16px",
      },
    },
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {stats.map((card, i) => (
            <div key={i} className="bg-white p-6 rounded-xl border border-green-100 text-center">
              {card.icon}
              <h2 className="text-3xl font-bold text-green-800">{card.value}</h2>
              <p className="text-sm text-slate-500 mt-1">{card.title}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="bg-white p-6 rounded-xl border border-green-100">
            <h3 className="text-lg font-semibold text-green-900 mb-4">Statistik Event per Bulan</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={barChartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="events" fill="#16a34a" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded-xl border border-green-100">
            <h3 className="text-lg font-semibold text-green-900 mb-4">Statistik Peserta per Bulan</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={participantsChartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="participants" stroke="#4ade80" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 7 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-1 mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-slate-800">Event Terbaru</h2>

            <div className="flex items-center gap-3">
              <div className="flex items-center bg-white rounded border border-gray-300 px-3 py-2 max-w-xs">
                <Search className="w-5 h-5 text-gray-500 mr-2" />
                <input type="text" placeholder="Cari No. Sampel" className="w-full border-none outline-none text-gray-700 placeholder-gray-400" value={filterText} onChange={(e) => setFilterText(e.target.value)} />
              </div>

              <button type="button" className="flex items-center gap-2 bg-white border border-gray-300 rounded px-3 py-2 font-semibold text-gray-700 hover:bg-gray-50 transition">
                Advance Filter
                <SlidersHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>

          <DataTable columns={columns} data={filteredEvents} pagination highlightOnHover responsive striped noHeader customStyles={customStyles} />
        </div>
      </main>
    </div>
  );
}
