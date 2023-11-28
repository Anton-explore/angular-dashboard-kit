import { createAction, props } from '@ngrx/store';
import { ContactsType } from 'src/app/models/contacts.model';

export const getContactsPending = createAction(
  '[Contacts] Get contacts pending'
);

export const getContactsSuccess = createAction(
  '[Contacts] Get contacts success',
  props<{ contacts: ContactsType[] }>()
);

export const getContactsError = createAction(
  '[Contacts] Get contacts error',
  props<{ error: string }>()
);

export const createImage = createAction(
  '[Contacts] Create image url',
  props<{
    image: File | null;
    dataPath: string;
    contact: ContactsType;
    actionType: string;
  }>()
);
export const createImageSuccess = createAction(
  '[Contacts] Create image url success',
  props<{ imageUrl: string }>()
);

export const createContactPending = createAction(
  '[Contacts] Create contact pending',
  props<{ contact: ContactsType }>()
);
export const createContactSuccess = createAction(
  '[Contacts] Create contact success',
  props<{ contacts: ContactsType[] }>()
);
export const createContactError = createAction(
  '[Contacts] Create contact error',
  props<{ error: string }>()
);

export const updateContact = createAction(
  '[Contacts] Update Contact',
  props<{ contact: ContactsType }>()
);

export const deleteContact = createAction(
  '[Contacts] Delete Contact',
  props<{ id: number }>()
);

export const clearContactsError = createAction(
  '[Contacts] Clear contacts error'
);
