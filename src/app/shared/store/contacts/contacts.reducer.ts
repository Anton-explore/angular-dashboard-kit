import { createReducer, on } from '@ngrx/store';
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
import { ContactsState } from 'src/app/models/contacts.model';

const initialState: ContactsState = {
  contacts: [],
  loading: false,
  error: null,
};

export const contactsReducer = createReducer(
  initialState,
  on(
    getContactsSuccess,
    (state, { contacts }): ContactsState => ({
      ...state,
      contacts,
      loading: false,
      error: null,
    })
  ),
  on(
    getContactsPending,
    (state): ContactsState => ({
      ...state,
      loading: true,
      error: null,
    })
  ),
  on(
    getContactsError,
    (state, { error }): ContactsState => ({
      ...state,
      loading: false,
      error,
    })
  ),

  on(
    createImage,
    (state): ContactsState => ({
      ...state,
      loading: true,
      error: null,
    })
  ),
  on(
    createContactPending,
    (state): ContactsState => ({
      ...state,
      contacts: [],
      loading: true,
      error: null,
    })
  ),
  on(
    createContactSuccess,
    (state, { contacts }): ContactsState => ({
      ...state,
      contacts,
      loading: false,
      error: null,
    })
  ),
  on(
    updateContact,
    (state): ContactsState => ({
      ...state,
      contacts: [],
      loading: true,
      error: null,
    })
  ),
  on(
    deleteContact,
    (state): ContactsState => ({
      ...state,
      contacts: [],
      loading: true,
      error: null,
    })
  )
);
