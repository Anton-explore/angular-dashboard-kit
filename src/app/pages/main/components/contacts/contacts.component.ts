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

import { AddContactComponent } from 'src/app/shared/components/add-contact/add-contact.component';
import { DeletionModalComponent } from 'src/app/shared/components/deletion-modal/deletion-modal.component';

import {
  ContactFormDataType,
  ContactsType,
} from 'src/app/models/contacts.model';
import { AppState, TableColumnsType } from 'src/app/models/types';

import {
  clearContactsError,
  createImage,
  deleteContact,
  getContactsError,
  getContactsPending,
} from 'src/app/shared/store/contacts/contacts.actions';
import {
  selectContacts,
  selectContactsError,
  selectContactsLoading,
} from 'src/app/shared/store/selectors';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactsComponent implements OnInit, OnDestroy {
  @ViewChild('menuTrigger') menuTrigger?: MatMenuTrigger;
  columns: TableColumnsType<ContactsType>[] = [
    {
      columnDef: 'name',
      header: 'Name',
      cell: el => `${el.name}`,
    },
    {
      columnDef: 'email',
      header: 'Email',
      cell: el => `${el.email}`,
    },
    {
      columnDef: 'address',
      header: 'Address',
      cell: el => `${el.address}`,
    },
    {
      columnDef: 'created',
      header: 'Created at',
      cell: el => `${el.created}`,
    },
    {
      columnDef: 'menu',
      header: '',
      cell: () => '',
    },
  ];
  errorMessage$: Observable<string | null> =
    this.store.select(selectContactsError);
  errorMessage: string | null = null;
  contacts!: ContactsType[];
  contacts$: Observable<ContactsType[]> = this.store.select(selectContacts);
  showLoader$: Observable<boolean> = this.store.select(selectContactsLoading);
  private destroy$ = new Subject<void>();

  constructor(
    private store: Store<AppState>,
    private cdr: ChangeDetectorRef,
    private snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getContactsData();
    this.handleErrors();
  }

  private getContactsData() {
    this.store.dispatch(getContactsPending());
    this.contacts$.pipe(takeUntil(this.destroy$)).subscribe({
      next: response => {
        if (response) {
          this.contacts = response;
        }
      },
      error: (error: string) => {
        this.store.dispatch(getContactsError({ error }));
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
        this.store.dispatch(clearContactsError());
      });
  }

  addContact() {
    const dialogRef = this.dialog.open(AddContactComponent, {
      maxWidth: '380px',
    });
    dialogRef
      .afterClosed()
      .pipe(
        map(({ contact, avatar }: ContactFormDataType) => {
          if (contact) {
            this.store.dispatch(
              createImage({
                contact,
                image: avatar,
                dataPath: 'Contacts',
                actionType: 'create',
              })
            );
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
          this.store.dispatch(getContactsError({ error }));
        },
      });
  }

  onContactEdited(contactId: number): void {
    const editedContact = this.contacts.find(
      contact => contact.id === contactId
    );
    if (!editedContact) {
      this.errorMessage = 'There is no such contact';
      return;
    }
    const dialogRef = this.dialog.open(AddContactComponent, {
      maxWidth: '380px',
      restoreFocus: false,
    });
    if (editedContact) {
      dialogRef.componentInstance.content = {
        contact: editedContact,
      };
    }
    dialogRef
      .afterClosed()
      .pipe(
        map(({ contact, avatar }: ContactFormDataType) => {
          if (contact) {
            this.store.dispatch(
              createImage({
                contact,
                image: avatar,
                dataPath: 'Contacts',
                actionType: 'update',
              })
            );
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
          this.store.dispatch(getContactsError({ error }));
        },
      });
  }

  onContactDeleted(contactId: number): void {
    const deletedContact = this.contacts.find(
      contact => contact.id === contactId
    );
    if (!deletedContact) {
      this.errorMessage = 'There is no such contact';
      return;
    }
    const contactName = deletedContact?.name;
    const dialogRef = this.dialog.open(DeletionModalComponent, {
      width: '380px',
      restoreFocus: false,
    });
    dialogRef.componentInstance.content = {
      title: 'Delete contact?',
      text: `Are you sure you want to delete ${contactName} contact?`,
      id: contactId,
    };
    dialogRef
      .afterClosed()
      .pipe(
        map(id => {
          if (id) {
            this.store.dispatch(deleteContact({ id }));
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
          this.store.dispatch(getContactsError({ error }));
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
