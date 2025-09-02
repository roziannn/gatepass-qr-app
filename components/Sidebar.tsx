"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu as MenuIcon, Home, Users, Calendar, Settings, QrCode, ListTodo } from "lucide-react";

export default function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", icon: Home, href: "/admin/dashboard" },
    { name: "Data Event", icon: Calendar, href: "/admin/data/event" },
    { name: "Data Category", icon: ListTodo, href: "/admin/data/category" },
    { name: "Data Participants", icon: Users, href: "/admin/data/participants" },
    { name: "Scanner", icon: QrCode, href: "/admin/scanner" },
    // { name: "Scan QR", icon: QrCode, href: "/event/checkin" },
    { name: "Settings", icon: Settings, href: "/admin/settings" },
  ];

  return (
    <aside className={`${sidebarOpen ? "w-64" : "w-20"} bg-white border-r border-green-100 shadow-lg flex flex-col sticky top-0 h-screen transition-all duration-300`}>
      {/* Top Branding + Hamburger */}
      <div className="flex items-center gap-3 h-[62px] px-5 border-b border-green-100">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-lg hover:bg-green-50 text-green-700 transition-colors">
          <MenuIcon className="w-5 h-5" />
        </button>
        {sidebarOpen && <span className="text-xl font-semibold text-green-800 tracking-wide">GATEPASS</span>}
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 flex flex-col gap-1">
        {menuItems.map((item, idx) => (
          <Link
            key={idx}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
              ${pathname.startsWith(item.href) ? "bg-green-700 text-white font-medium" : "text-slate-700 hover:bg-green-50 hover:text-green-800"}`}
          >
            <item.icon className={`w-5 h-5 ${pathname.startsWith(item.href) ? "text-white" : "text-slate-700"}`} />
            {sidebarOpen && <span>{item.name}</span>}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
