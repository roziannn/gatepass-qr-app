"use client";

interface BadgeProps {
  children: string;
  statusColor: "text-green-700" | "text-yellow-600" | "text-red-600" | "text-blue-700";
}

const badgeColors: Record<BadgeProps["statusColor"], string> = {
  "text-green-700": "bg-green-100 text-green-700",
  "text-yellow-600": "bg-yellow-100 text-yellow-600",
  "text-red-600": "bg-red-100 text-red-600",
  "text-blue-700": "bg-blue-100 text-blue-700",
};

export default function Badge({ children, statusColor }: BadgeProps) {
  return <span className={`px-3 py-1 rounded-lg text-sm font-semibold ${badgeColors[statusColor]}`}>{children}</span>;
}
