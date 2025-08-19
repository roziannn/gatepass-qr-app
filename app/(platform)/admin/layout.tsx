import Sidebar from "@/components/Sidebar";
// import Header from "@/components/Header";
import { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* <Header /> */}
      <Sidebar />
      <main className="flex-1 flex flex-col">{children}</main>
    </div>
  );
}
