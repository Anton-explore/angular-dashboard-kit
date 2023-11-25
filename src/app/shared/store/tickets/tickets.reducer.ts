import { createReducer, on } from '@ngrx/store';
import { TicketsState } from 'src/app/models/tickets.model';
import {
  createTicket,
  deleteTicket,
  getTicketsError,
  getTicketsPending,
  getTicketsSuccess,
  updateTicket,
} from './tickets.actions';

const initialState: TicketsState = {
  tickets: [],
  loading: false,
  error: null,
};

export const ticketsReducer = createReducer(
  initialState,
  on(
    getTicketsPending,
    (state): TicketsState => ({
      ...state,
      tickets: [],
      loading: true,
      error: null,
    })
  ),
  on(
    getTicketsSuccess,
    (state, { tickets }): TicketsState => ({
      ...state,
      tickets,
      loading: false,
      error: null,
    })
  ),
  on(
    getTicketsError,
    (state, { error }): TicketsState => ({
      ...state,
      loading: false,
      error,
    })
  ),

  on(
    createTicket,
    (state): TicketsState => ({
      ...state,
      tickets: [],
      loading: true,
      error: null,
    })
  ),
  on(
    updateTicket,
    (state): TicketsState => ({
      ...state,
      tickets: [],
      loading: true,
      error: null,
    })
  ),
  on(
    deleteTicket,
    (state): TicketsState => ({
      ...state,
      tickets: [],
      loading: true,
      error: null,
    })
  )
);
