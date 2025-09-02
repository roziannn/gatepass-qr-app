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
        {sidebarOpen && <span className="text-lg font-bold text-green-800 tracking-wide">GATEPASS</span>}
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

      {/* User Info + Logout Dropdown */}
      {/* <div className="p-4 mt-auto">
        <Menu as="div" className="relative w-full">
          <Menu.Button className="flex items-center gap-3 w-full cursor-pointer hover:bg-green-50 px-3 py-2 rounded-lg transition-colors" title={!sidebarOpen ? "Administrator" : ""}>
            <div className="w-8 h-8 flex items-center justify-center bg-green-100 rounded-full">
              <User className="w-5 h-5 text-green-700" />
            </div>
            {sidebarOpen && (
              <div className="flex flex-col text-left">
                <span className="text-green-900 font-medium text-sm">Administrator</span>
                <span className="text-slate-500 text-xs">admin@example.com</span>
              </div>
            )}
          </Menu.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className={`absolute top-0 left-full ml-2 w-36`}>
              <Menu.Item>
                {({ active }) => (
                  <button className={`w-full text-left px-3 py-2 text-red-600 rounded hover:bg-red-50 flex items-center gap-2`} onClick={() => alert("Logout clicked!")}>
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                )}
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </Menu>
      </div> */}
    </aside>
  );
}
