export interface Participant {
  id: number;
  fullName: string;
  email: string;
  status: string;
  ticketCode: string;
  scanDate: string;
  registeredAt: string;
}

export interface EventParticipant {
  id: number;
  name: string;
  participants?: Participant[];
}
