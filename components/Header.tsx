"use client";

import { useState, useRef, useEffect } from "react";
import { User, LogOut, ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" });
      window.location.href = "/login";
    } catch (err) {
      console.error("Logout failed:", err);
      window.location.href = "/login"; // fallback
    }
  };

  // create breadcrumb dari pathname, hapus "admin" kalau ada di awal
  const segments = pathname.split("/").filter(Boolean);
  if (segments[0]?.toLowerCase() === "admin") segments.shift();

  const breadcrumbs = segments.map((seg, idx) => {
    const href = "/" + segments.slice(0, idx + 1).join("/");
    const name = seg
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    return { name, href };
  });

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between h-[62px] px-6 sm:px-10 border-b border-green-100 bg-white">
      <nav className="flex items-center gap-1 text-lg text-slate-600 font-semibold">
        {breadcrumbs.map((bc, idx) => (
          <span key={idx} className="flex items-center gap-1">
            {idx > 0 && <ChevronRight className="w-4 h-4 text-slate-400" />}
            <span className={`hover:text-green-700 ${idx === breadcrumbs.length - 1 ? "text-green-900" : ""}`}>{bc.name}</span>
          </span>
        ))}
      </nav>

      {/* User */}
      <div className="relative" ref={dropdownRef}>
        <div onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center gap-3 cursor-pointer hover:bg-green-50 px-3 py-2 rounded-full transition-colors">
          <div className="w-8 h-8 flex items-center justify-center bg-green-100 rounded-full">
            <User className="w-5 h-5 text-green-700" />
          </div>
          <span className="hidden sm:inline text-green-900 font-semibold">Administrator</span>
        </div>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-50">
            <button onClick={handleLogout} className="flex items-center gap-2 w-full px-4 py-2 text-red-600 hover:bg-red-50 transition-colors">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
