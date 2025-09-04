"use client";

export default function Footer() {
  return (
    <footer className="bg-green-100 text-green-900 py-4 text-center shadow-inner">
      <p className="text-sm">
        &copy; {new Date().getFullYear()} <b>Gatepass App</b>. All rights reserved.
      </p>
    </footer>
  );
}
