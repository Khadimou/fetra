// types/freshdesk.d.ts

export interface FreshdeskTicket {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface FreshdeskTicketResponse {
  success: boolean;
  ticketId?: number;
  error?: string;
}

export interface FreshdeskAPITicket {
  id: number;
  subject: string;
  description: string;
  status: number;
  priority: number;
  source: number;
  created_at: string;
  updated_at: string;
  requester_id: number;
  responder_id?: number;
  email: string;
  name?: string;
}

export interface FreshdeskError {
  description: string;
  errors: Array<{
    field: string;
    message: string;
    code: string;
  }>;
}
