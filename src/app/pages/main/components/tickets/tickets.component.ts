import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable, Subject, map, takeUntil } from 'rxjs';
import { Store } from '@ngrx/store';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';

import { AddTicketComponent } from 'src/app/shared/components/add-ticket/add-ticket.component';
import { DeletionModalComponent } from 'src/app/shared/components/deletion-modal/deletion-modal.component';

import { TicketsType } from 'src/app/models/tickets.model';
import { AppState, TableColumnsType } from 'src/app/models/types';

import {
  createTicket,
  deleteTicket,
  getTicketsPending,
  updateTicket,
} from 'src/app/shared/store/tickets/tickets.actions';
import {
  selectTickets,
  selectTicketsLoading,
} from 'src/app/shared/store/selectors';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.scss'],
})
export class TicketsComponent implements OnInit, OnDestroy {
  @ViewChild('menuTrigger') menuTrigger?: MatMenuTrigger;
  columns: TableColumnsType<TicketsType>[] = [
    {
      columnDef: 'detail',
      header: 'Ticket details',
      cell: el => `${el.detail}`,
    },
    {
      columnDef: 'customerName',
      header: 'Customer Name',
      cell: el => `${el.customerName}`,
    },
    {
      columnDef: 'date',
      header: 'Date',
      cell: el => `${el.date}`,
    },
    {
      columnDef: 'priority',
      header: 'Priority',
      cell: el => `${el.priority}`,
    },
    {
      columnDef: 'menu',
      header: '',
      cell: () => '',
    },
  ];
  errorMessage!: string;
  tickets!: TicketsType[];
  tickets$: Observable<TicketsType[]> = this.store.select(selectTickets);
  showLoader$: Observable<boolean> = this.store.select(selectTicketsLoading);
  private destroy$ = new Subject<void>();

  constructor(
    private store: Store<AppState>,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getTicketsData();
  }

  private getTicketsData() {
    this.store.dispatch(getTicketsPending());
    this.tickets$.pipe(takeUntil(this.destroy$)).subscribe({
      next: response => {
        if (response) {
          this.tickets = response;
        }
      },
      error: (error: string) => {
        this.errorMessage = error;
      },
    });
  }

  addTicket() {
    const dialogRef = this.dialog.open(AddTicketComponent, {
      maxWidth: '380px',
    });
    dialogRef
      .afterClosed()
      .pipe(
        map(({ newTicket }: { newTicket: TicketsType }) => {
          this.store.dispatch(createTicket({ ticket: newTicket }));
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.menuTrigger?.focus();
      });
  }

  onTicketEdited(ticketId: number): void {
    const editedTicket = this.tickets.find(ticket => ticket.id === ticketId);
    if (!editedTicket) {
      this.errorMessage = 'There is no such ticket';
      return;
    }
    const dialogRef = this.dialog.open(AddTicketComponent, {
      maxWidth: '380px',
      restoreFocus: false,
    });
    if (editedTicket) {
      dialogRef.componentInstance.content = {
        ticket: editedTicket,
      };
    }
    dialogRef
      .afterClosed()
      .pipe(
        map(({ updatedTicket }: { updatedTicket: TicketsType }) => {
          this.store.dispatch(updateTicket({ ticket: updatedTicket }));
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: () => {
          this.menuTrigger?.focus();
        },
        error: (error: string) => {
          this.errorMessage = error;
        },
      });
  }

  onTicketDeleted(ticketId: number): void {
    const deletedTicket = this.tickets.find(ticket => ticket.id === ticketId);
    if (!deletedTicket) {
      this.errorMessage = 'There is no such ticket';
      return;
    }
    const ticketDetails = deletedTicket?.detail;
    const dialogRef = this.dialog.open(DeletionModalComponent, {
      width: '380px',
      restoreFocus: false,
    });
    dialogRef.componentInstance.content = {
      title: 'Delete ticket?',
      text: `Are you sure you want to delete this ticket: "${ticketDetails}"?`,
    };
    dialogRef
      .afterClosed()
      .pipe(
        map(() => this.store.dispatch(deleteTicket({ id: ticketId }))),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: () => {
          this.menuTrigger?.focus();
        },
        error: (error: string) => {
          this.errorMessage = error;
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
