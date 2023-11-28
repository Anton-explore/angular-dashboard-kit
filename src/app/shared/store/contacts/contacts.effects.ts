import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ContactsService } from '../../services/contacts.service';
import {
  createContactPending,
  createContactSuccess,
  createImage,
  deleteContact,
  getContactsError,
  getContactsPending,
  getContactsSuccess,
  updateContact,
} from './contacts.actions';
import { catchError, map, of, switchMap } from 'rxjs';
import { ImageService } from '../../services/image.service';

export const getContactsEffect = createEffect(
  (actions$ = inject(Actions), contactsService = inject(ContactsService)) => {
    return actions$.pipe(
      ofType(getContactsPending),
      switchMap(() =>
        contactsService.getContacts().pipe(
          map(contacts => getContactsSuccess({ contacts })),
          catchError((error: string) => of(getContactsError({ error })))
        )
      )
    );
  },
  { functional: true }
);

export const createImgEffect = createEffect(
  (actions$ = inject(Actions), imgService = inject(ImageService)) => {
    return actions$.pipe(
      ofType(createImage),
      switchMap(({ image, dataPath, contact, actionType }) => {
        const contactId = contact.id;
        return imgService.updateDataImage(image, contactId, dataPath).pipe(
          map(imageUrl => {
            console.log(actionType);
            const changingContact = { ...contact };
            changingContact.avatar = imageUrl ? imageUrl : contact.avatar;
            if (actionType === 'create') {
              return createContactPending({ contact: changingContact });
            } else if (actionType === 'update') {
              return updateContact({ contact: changingContact });
            } else {
              throw new Error('Unknown action type');
            }
          }),
          catchError((error: { message: string } | string) => {
            if (typeof error === 'string') {
              return of(getContactsError({ error }));
            } else {
              return of(getContactsError({ error: error.message }));
            }
          })
        );
      })
    );
  },
  { functional: true }
);

export const createContactEffect = createEffect(
  (actions$ = inject(Actions), contactsService = inject(ContactsService)) => {
    return actions$.pipe(
      ofType(createContactPending),
      switchMap(({ contact }) => {
        return contactsService.addContact(contact).pipe(
          map(contacts => {
            return createContactSuccess({ contacts });
          }),
          catchError((error: string) => of(getContactsError({ error })))
        );
      })
    );
  },
  { functional: true }
);

export const updateContactEffect = createEffect(
  (actions$ = inject(Actions), contactsService = inject(ContactsService)) => {
    return actions$.pipe(
      ofType(updateContact),
      switchMap(({ contact }) =>
        contactsService.editContact(contact).pipe(
          map(contacts => {
            console.log(contacts);
            return getContactsSuccess({ contacts });
          }),
          catchError((error: string) => of(getContactsError({ error })))
        )
      )
    );
  },
  { functional: true }
);

export const deleteContactEffect = createEffect(
  (actions$ = inject(Actions), contactsService = inject(ContactsService)) => {
    return actions$.pipe(
      ofType(deleteContact),
      switchMap(({ id }) =>
        contactsService.deleteContact(id).pipe(
          map(contacts => {
            return getContactsSuccess({ contacts });
          }),
          catchError((error: string) => of(getContactsError({ error })))
        )
      )
    );
  },
  { functional: true }
);
