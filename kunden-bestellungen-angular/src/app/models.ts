export interface Customer {
  id: number;
  name: string;
  email: string;
}

export interface Order {
  id: number;
  customerId: number;
  customerName: string;
  artikel: string;
  count: number;
}

export type Status = 'loading' | 'ready' | 'error';
