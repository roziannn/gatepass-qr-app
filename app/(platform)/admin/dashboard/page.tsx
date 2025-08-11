"use client";

import { useState, useMemo } from "react";
import { usePathname } from "next/navigation";
import { Menu, LogOut, Home, Users, Calendar, Settings, User, Search, SlidersHorizontal, CheckCircle, Ticket, QrCodeIcon, QrCode } from "lucide-react";
import Link from "next/link";
import DataTable, { TableColumn } from "react-data-table-component";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, LineChart, Line } from "recharts";

interface Event {
  id: number;
  name: string;
  date: string;
  participants: number;
  status: string;
  statusColor: string;
}

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [filterText, setFilterText] = useState("");
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", icon: Home, href: "/admin" },
    { name: "Event", icon: Calendar, href: "/admin/events" },
    { name: "Participants", icon: Users, href: "/admin/users" },
    { name: "Scan QR", icon: QrCode, href: "/event/checkin" },
    { name: "Settings", icon: Settings, href: "/admin/settings" },
  ];

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
      status: "Aktif",
      statusColor: "text-green-700",
    },
    {
      id: 2,
      name: "Workshop AI",
      date: "5 September 2025",
      participants: 80,
      status: "Aktif",
      statusColor: "text-green-700",
    },
    {
      id: 3,
      name: "Konser Amal",
      date: "20 Oktober 2025",
      participants: 90,
      status: "Menunggu",
      statusColor: "text-yellow-600",
    },
  ];

  const stats = [
    { title: "Total Event", value: "12", icon: <Calendar className="w-8 h-8 text-green-600 mx-auto mb-2" /> },
    { title: "Total Peserta", value: "320", icon: <Users className="w-8 h-8 text-green-600 mx-auto mb-2" /> },
    { title: "Check-in Hari Ini", value: "58", icon: <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" /> },
    { title: "Tiket Terjual", value: "280", icon: <Ticket className="w-8 h-8 text-green-600 mx-auto mb-2" /> },
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
    <div className="min-h-screen flex bg-slate-50">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? "w-64" : "w-20"} bg-white border-r border-green-100 shadow-lg transition-all duration-300 flex flex-col`}>
        <div className="flex items-center gap-3 h-[72px] px-5 border-b border-green-100">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-lg hover:bg-green-50 text-green-700 transition-colors">
            <Menu className="w-6 h-6" />
          </button>
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-green-800 tracking-wide">GATEPASS</span>
            </div>
          )}
        </div>

        {/* Menu */}
        <nav className="flex-1 p-4 flex flex-col gap-1">
          {menuItems.map((item, idx) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={idx}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                  ${isActive ? "bg-green-700 text-white font-medium" : "text-slate-700 hover:bg-green-50 hover:text-green-800"}`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? "text-white" : "text-slate-700"}`} />

                {sidebarOpen && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-green-100">
          <button className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-red-600 hover:bg-red-50 transition-colors">
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header Bar */}
        <header className="flex items-center justify-end h-[72px] px-6 sm:px-10 border-b border-green-100 bg-white">
          <div className="flex items-center gap-3 cursor-pointer hover:bg-green-50 px-3 py-2 rounded-full transition-colors">
            <div className="w-10 h-10 flex items-center justify-center bg-green-100 rounded-full">
              <User className="w-6 h-6 text-green-700" />
            </div>
            <span className="hidden sm:inline text-green-900 font-medium">Administrator</span>
          </div>
        </header>

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

          <div className="bg-white p-6 rounded-xl border border-green-100 mt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-green-900">Event Terbaru</h2>

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
    </div>
  );
}
