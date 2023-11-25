import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, switchMap, throwError } from 'rxjs';
import { TicketsType } from 'src/app/models/tickets.model';
import { environment as env } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TicketsService {
  private ticketsEndpoint = env.firebase.databaseURL + '/tickets.json';

  constructor(private httpClient: HttpClient) {}

  getTickets(): Observable<TicketsType[]> {
    return this.httpClient.get<TicketsType[]>(this.ticketsEndpoint).pipe(
      catchError((error: { message: string }) => {
        return throwError(() => 'An error occurred: ' + error.message);
      })
    );
  }

  getTicket(id: number): Observable<TicketsType | undefined> {
    return this.httpClient.get<TicketsType[]>(this.ticketsEndpoint).pipe(
      map(tickets => tickets.find(ticket => ticket.id === id)),
      catchError(error => {
        return throwError(() => 'An error occurred: ' + error.message);
      })
    );
  }

  addTicket(newTicket: TicketsType): Observable<TicketsType[]> {
    return this.getTickets().pipe(
      map((tickets: TicketsType[]) => {
        tickets.push(newTicket);
        return tickets;
      }),
      switchMap((updatedTickets: TicketsType[]) => {
        return this.httpClient.put<TicketsType[]>(
          this.ticketsEndpoint,
          updatedTickets
        );
      }),
      // map(resp => resp),
      catchError((error: { message: string }) => {
        return throwError(() => 'An error occurred: ' + error.message);
      })
    );
  }

  editTicket(editedTicket: TicketsType): Observable<TicketsType[]> {
    return this.getTickets().pipe(
      map((tickets: TicketsType[]) => {
        const index = tickets.findIndex(
          ticket => ticket.id === editedTicket.id
        );
        if (index !== -1) {
          tickets[index] = editedTicket;
          return tickets;
        } else {
          throw new Error('Contact not found.');
        }
      }),
      switchMap((updatedTickets: TicketsType[]) => {
        return this.httpClient.put<TicketsType[]>(
          this.ticketsEndpoint,
          updatedTickets
        );
      }),
      // map(resp => resp),
      catchError((error: { message: string }) => {
        return throwError(() => 'An error occurred: ' + error.message);
      })
    );
  }

  deleteTicket(ticketId: number): Observable<TicketsType[]> {
    return this.getTickets().pipe(
      map((tickets: TicketsType[]) => {
        const index = tickets.findIndex(ticket => ticket.id === ticketId);
        if (index !== -1) {
          tickets.splice(index, 1);
          return tickets;
        } else {
          throw new Error('Ticket not found.');
        }
      }),
      switchMap((updatedTickets: TicketsType[]) => {
        return this.httpClient.put<TicketsType[]>(
          this.ticketsEndpoint,
          updatedTickets
        );
      }),
      // map(resp => resp),
      catchError((error: { message: string }) => {
        return throwError(() => 'An error occurred: ' + error.message);
      })
    );
  }
}
