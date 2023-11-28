import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Observable, Subject, map, switchMap, takeUntil, timer } from 'rxjs';
import { Store } from '@ngrx/store';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AddTicketComponent } from 'src/app/shared/components/add-ticket/add-ticket.component';
import { DeletionModalComponent } from 'src/app/shared/components/deletion-modal/deletion-modal.component';

import { TicketsType } from 'src/app/models/tickets.model';
import { AppState, TableColumnsType } from 'src/app/models/types';

import {
  clearTicketsError,
  createTicket,
  deleteTicket,
  getTicketsError,
  getTicketsPending,
  updateTicket,
} from 'src/app/shared/store/tickets/tickets.actions';
import {
  selectTickets,
  selectTicketsError,
  selectTicketsLoading,
} from 'src/app/shared/store/selectors';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  errorMessage$: Observable<string | null> =
    this.store.select(selectTicketsError);
  errorMessage: string | null = null;
  tickets!: TicketsType[];
  tickets$: Observable<TicketsType[]> = this.store.select(selectTickets);
  showLoader$: Observable<boolean> = this.store.select(selectTicketsLoading);
  private destroy$ = new Subject<void>();

  constructor(
    private store: Store<AppState>,
    private cdr: ChangeDetectorRef,
    private snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getTicketsData();
    this.handleErrors();
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
        this.store.dispatch(getTicketsError({ error }));
      },
    });
  }

  private handleErrors() {
    this.errorMessage$
      .pipe(
        map(error => {
          if (error) {
            this.snackBar.open(error, 'X', {
              duration: 4000,
            });
          } else if (this.errorMessage) {
            this.snackBar.open(this.errorMessage, 'X', {
              duration: 4000,
            });
          }
        }),
        switchMap(() => timer(5000)),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.store.dispatch(clearTicketsError());
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
          if (newTicket) {
            this.store.dispatch(createTicket({ ticket: newTicket }));
            this.cdr.detectChanges();
          }
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: () => {
          this.menuTrigger?.focus();
        },
        error: (error: string) => {
          this.store.dispatch(getTicketsError({ error }));
        },
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
          if (updatedTicket) {
            this.store.dispatch(updateTicket({ ticket: updatedTicket }));
            this.cdr.detectChanges();
          }
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: () => {
          this.menuTrigger?.focus();
        },
        error: (error: string) => {
          this.store.dispatch(getTicketsError({ error }));
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
      id: ticketId,
    };
    dialogRef
      .afterClosed()
      .pipe(
        map(id => {
          if (id) {
            this.store.dispatch(deleteTicket({ id }));
            this.cdr.detectChanges();
          }
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: () => {
          this.menuTrigger?.focus();
        },
        error: (error: string) => {
          this.store.dispatch(getTicketsError({ error }));
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
