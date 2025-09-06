"use client";

import { useState, useEffect } from "react";
import { Users, Calendar, CheckCircle, Ticket } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, LineChart, Line } from "recharts";
import Header from "@/components/Header";

interface Event {
  id: number;
  name: string;
  date: string;
  quota: number;
  status: string;
  _count: { participants: number };
}

interface Stats {
  totalEvents: number;
  totalParticipants: number;
  checkInToday: number;
  ticketsSold: number;
}

interface ChartData {
  month: string;
  events?: number;
  participants?: number;
}

export default function AdminDashboard() {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [barChartData, setBarChartData] = useState<ChartData[]>([]);
  const [participantsChartData, setParticipantsChartData] = useState<ChartData[]>([]);

  // badge colors
  const badgeColors: { [key: string]: string } = {
    ACTIVE: "bg-blue-100 text-blue-700",
    PENDING: "bg-yellow-100 text-yellow-600",
  };

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch("/api/dashboard");
        const data = await res.json();

        setUpcomingEvents(data.upcomingEvents);
        setStats(data.stats);
        setBarChartData(data.chartData.barChartData);
        setParticipantsChartData(data.chartData.participantsChartData);
      } catch (err) {
        console.error("Gagal fetch dashboard", err);
      }
    };

    fetchDashboard();
    const interval = setInterval(fetchDashboard, 10000); // refresh tiap 10 detik
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
        {/* Upcoming Events */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-green-900 mb-4">Upcoming Events</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map((event) => {
              const progress = Math.min((event._count.participants / event.quota) * 100, 100);

              return (
                <div key={event.id} className="bg-white rounded-xl border border-green-100 shadow-md p-5 hover:shadow-lg transition relative">
                  <div className="absolute top-4 right-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${badgeColors[event.status] || "bg-gray-100 text-gray-700"}`}>{event.status}</span>
                  </div>

                  <div className="pr-12">
                    <h4 className="text-md font-semibold text-green-800 break-words mb-1">{event.name}</h4>
                    <p className="text-sm text-gray-500">{new Date(event.date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Peserta: {event._count.participants}/{event.quota}
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="my-8 border-t border-slate-200"></div>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-white p-6 rounded-xl border border-green-100 text-center shadow-sm">
              <Calendar className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h2 className="text-3xl font-bold text-green-800">{stats.totalEvents}</h2>
              <p className="text-sm text-slate-500 mt-1">Total Event</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-green-100 text-center shadow-sm">
              <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h2 className="text-3xl font-bold text-green-800">{stats.totalParticipants}</h2>
              <p className="text-sm text-slate-500 mt-1">Total Participant</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-green-100 text-center shadow-sm">
              <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h2 className="text-3xl font-bold text-green-800">{stats.checkInToday}</h2>
              <p className="text-sm text-slate-500 mt-1">Check-in Hari Ini</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-green-100 text-center shadow-sm">
              <Ticket className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h2 className="text-3xl font-bold text-green-800">{stats.ticketsSold}</h2>
              <p className="text-sm text-slate-500 mt-1">Tiket Terjual</p>
            </div>
          </div>
        )}

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl border border-green-100 shadow-sm">
            <h3 className="text-lg font-semibold text-green-900 mb-4">Statistik Event per Bulan</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={barChartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis allowDecimals={false} />
                <Tooltip contentStyle={{ fontSize: 14, color: "#374151" }} itemStyle={{ fontSize: 14 }} />
                <Bar dataKey="events" fill="#16a34a" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded-xl border border-green-100 shadow-sm">
            <h3 className="text-lg font-semibold text-green-900 mb-4">Statistik Peserta per Bulan</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={participantsChartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip contentStyle={{ fontSize: 14, color: "#374151" }} itemStyle={{ fontSize: 14 }} />
                <Line type="monotone" dataKey="participants" stroke="#4ade80" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 7 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </div>
  );
}
