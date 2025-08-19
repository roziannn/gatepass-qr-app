"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, LogOut, Home, Users, Calendar, Settings, QrCode, ListIcon, ListTodo } from "lucide-react";

export default function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", icon: Home, href: "/admin/dashboard" },
    { name: "Data Event", icon: Calendar, href: "/admin/data/event" },
    { name: "Data Category", icon: ListTodo, href: "/admin/data/category" },
    { name: "Data Participants", icon: Users, href: "/admin/data/participants" },
    { name: "Scan QR", icon: QrCode, href: "/event/checkin" },
    { name: "Settings", icon: Settings, href: "/admin/settings" },
  ];

  return (
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
          const isActive = (() => {
            if (item.href === "/admin") return pathname === "/admin";
            return pathname.startsWith(item.href);
          })();

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
  );
}
