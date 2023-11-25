import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TicketsService } from '../../services/tickets.service';
import {
  createTicket,
  deleteTicket,
  getTicketsError,
  getTicketsPending,
  getTicketsSuccess,
  updateTicket,
} from './tickets.actions';
import { catchError, map, mergeMap, of, switchMap } from 'rxjs';

export const getTicketsEffect = createEffect(
  (actions$ = inject(Actions), ticketsService = inject(TicketsService)) => {
    return actions$.pipe(
      ofType(getTicketsPending),
      mergeMap(() =>
        ticketsService.getTickets().pipe(
          map(tickets => getTicketsSuccess({ tickets })),
          catchError((error: string) => of(getTicketsError({ error })))
        )
      )
    );
  },
  { functional: true }
);

export const createTicketEffect = createEffect(
  (actions$ = inject(Actions), ticketsService = inject(TicketsService)) => {
    return actions$.pipe(
      ofType(createTicket),
      switchMap(({ ticket }) => {
        return ticketsService.addTicket(ticket).pipe(
          map(tickets => {
            return getTicketsSuccess({ tickets });
          }),
          catchError((error: string) => of(getTicketsError({ error })))
        );
      })
    );
  },
  { functional: true }
);

export const updateTicketEffect = createEffect(
  (actions$ = inject(Actions), ticketsService = inject(TicketsService)) => {
    return actions$.pipe(
      ofType(updateTicket),
      switchMap(({ ticket }) =>
        ticketsService.editTicket(ticket).pipe(
          map(tickets => {
            return getTicketsSuccess({ tickets });
          }),
          catchError((error: string) => of(getTicketsError({ error })))
        )
      )
    );
  },
  { functional: true }
);

export const deleteTicketEffect = createEffect(
  (actions$ = inject(Actions), ticketsService = inject(TicketsService)) => {
    return actions$.pipe(
      ofType(deleteTicket),
      switchMap(({ id }) =>
        ticketsService.deleteTicket(id).pipe(
          map(tickets => {
            return getTicketsSuccess({ tickets });
          }),
          catchError((error: string) => of(getTicketsError({ error })))
        )
      )
    );
  },
  { functional: true }
);
