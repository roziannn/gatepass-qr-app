export interface ApiEvent {
  id: number;
  name: string;
  description?: string;
  date: string;
  location: string;
  quota: number;
  participantCount: number;
  status: string;
  categoryId: number;
  category: { id: number; name: string };
  createdAt: string;
  updatedAt: string;
}

export type StatusColor = "text-green-700" | "text-yellow-600" | "text-red-600" | "text-blue-700";

export interface EventListItem {
  id: number;
  name: string;
  date: string;
  location: string;
  category: string;
  quota: number;
  registered: number;
  status: string;
  statusColor: StatusColor;
  createdAt: string;
}
