import { User } from "lucide-react";

export default function Header() {
  return (
    <header className="flex items-center justify-end h-[72px] px-6 sm:px-10 border-b border-green-100 bg-white">
      <div className="flex items-center gap-3 cursor-pointer hover:bg-green-50 px-3 py-2 rounded-full transition-colors">
        <div className="w-10 h-10 flex items-center justify-center bg-green-100 rounded-full">
          <User className="w-6 h-6 text-green-700" />
        </div>
        <span className="hidden sm:inline text-green-900 font-medium">Administrator</span>
      </div>
    </header>
  );
}
