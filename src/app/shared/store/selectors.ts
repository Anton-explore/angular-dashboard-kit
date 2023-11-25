import { createFeatureSelector, createSelector } from '@ngrx/store';

import { ContactsState } from 'src/app/models/contacts.model';
import { TicketsState } from 'src/app/models/tickets.model';
import { UserState } from 'src/app/models/users.model';

const selectContactsState = createFeatureSelector<ContactsState>('contacts');

export const selectContacts = createSelector(
  selectContactsState,
  state => state.contacts
);

export const selectContactsLoading = createSelector(
  selectContactsState,
  state => state.loading
);

export const selectContactsError = createSelector(
  selectContactsState,
  state => state.error
);

const selectTicketsState = createFeatureSelector<TicketsState>('tickets');

export const selectTickets = createSelector(
  selectTicketsState,
  state => state.tickets
);

export const selectTicketsLoading = createSelector(
  selectTicketsState,
  state => state.loading
);

export const selectTicketsError = createSelector(
  selectTicketsState,
  state => state.error
);

const selectUserState = createFeatureSelector<UserState>('user');

export const selectUser = createSelector(selectUserState, state => state.user);

export const selectUserLoading = createSelector(
  selectUserState,
  state => state.loading
);

export const selectUserError = createSelector(
  selectUserState,
  state => state.error
);

export const selectSendingEmailToUser = createSelector(
  selectUserState,
  state => state.sendEmail
);

export const selectResetPassword = createSelector(
  selectUserState,
  state => state.resetPass
);
