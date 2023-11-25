export interface TicketsType {
  id: number;
  detail: string;
  customerName: string;
  customerAvatar?: string;
  // customerOn: string;
  date: string;
  priority: PriorityType;
}

export type PriorityType = 'high' | 'normal' | 'low';

export interface TicketsFormType {
  detail: string | null;
  name: string | null;
  date: Date | null;
  priority: string | null;
}

export interface TicketsState {
  tickets: TicketsType[];
  loading: boolean;
  error: string | null;
}
