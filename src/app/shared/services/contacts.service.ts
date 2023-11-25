import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, switchMap, throwError } from 'rxjs';

import { ContactsType } from 'src/app/models/contacts.model';
import { environment as env } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ContactsService {
  private contactsEndpoint = env.firebase.databaseURL + '/contacts.json';

  constructor(private httpClient: HttpClient) {}

  getContacts(): Observable<ContactsType[]> {
    return this.httpClient.get<ContactsType[]>(this.contactsEndpoint).pipe(
      catchError((error: { message: string }) => {
        return throwError(() => 'An error occurred: ' + error.message);
      })
    );
  }

  getContact(id: number): Observable<ContactsType | undefined> {
    return this.httpClient.get<ContactsType[]>(this.contactsEndpoint).pipe(
      map(contacts => contacts.find(contact => contact.id === id)),
      catchError((error: { message: string }) => {
        return throwError(() => 'An error occurred: ' + error.message);
      })
    );
  }

  addContact(newContact: ContactsType): Observable<ContactsType[]> {
    return this.getContacts().pipe(
      map((contacts: ContactsType[]) => {
        contacts.push(newContact);
        return contacts;
      }),
      switchMap((updatedContacts: ContactsType[]) => {
        return this.httpClient.put<ContactsType[]>(
          this.contactsEndpoint,
          updatedContacts
        );
      }),
      // map(resp => resp),
      catchError((error: { message: string }) => {
        return throwError(() => 'An error occurred: ' + error.message);
      })
    );
  }

  editContact(editedContact: ContactsType): Observable<ContactsType[]> {
    return this.getContacts().pipe(
      map((contacts: ContactsType[]) => {
        const index = contacts.findIndex(
          contact => contact.id === editedContact.id
        );
        if (index !== -1) {
          contacts[index] = editedContact;
          return contacts;
        } else {
          throw new Error('Contact not found.');
        }
      }),
      switchMap((updatedContacts: ContactsType[]) => {
        return this.httpClient.put<ContactsType[]>(
          this.contactsEndpoint,
          updatedContacts
        );
      }),
      // map(resp => resp),
      catchError((error: { message: string }) => {
        return throwError(() => 'An error occurred: ' + error.message);
      })
    );
  }

  deleteContact(contactId: number): Observable<ContactsType[]> {
    return this.getContacts().pipe(
      map((contacts: ContactsType[]) => {
        const index = contacts.findIndex(contact => contact.id === contactId);
        if (index !== -1) {
          contacts.splice(index, 1);
          return contacts;
        } else {
          throw new Error('Ticket not found.');
        }
      }),
      switchMap((updatedContacts: ContactsType[]) => {
        return this.httpClient.put<ContactsType[]>(
          this.contactsEndpoint,
          updatedContacts
        );
      }),
      // map(resp => resp),
      catchError((error: { message: string }) => {
        return throwError(() => 'An error occurred: ' + error.message);
      })
    );
  }
}
