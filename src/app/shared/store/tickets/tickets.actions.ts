import { createAction, props } from '@ngrx/store';
import { TicketsType } from 'src/app/models/tickets.model';

export const getTicketsPending = createAction('[Tickets] Get tickets pending');

export const getTicketsSuccess = createAction(
  '[Tickets] Get tickets success',
  props<{ tickets: TicketsType[] }>()
);

export const getTicketsError = createAction(
  '[Tickets] Get tickets error',
  props<{ error: string }>()
);

export const createTicket = createAction(
  '[Tickets] Create Ticket',
  props<{ ticket: TicketsType }>()
);

export const updateTicket = createAction(
  '[Tickets] Update Ticket',
  props<{ ticket: TicketsType }>()
);

export const deleteTicket = createAction(
  '[Tickets] Delete Ticket',
  props<{ id: number }>()
);
