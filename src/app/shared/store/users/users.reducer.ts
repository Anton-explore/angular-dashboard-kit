import { createReducer, on } from '@ngrx/store';

import { UserState } from 'src/app/models/users.model';
import {
  authError,
  clearAuthError,
  login,
  logout,
  resetPassword,
  resetPasswordSuccess,
  sendResetEmail,
  sendResetEmailSuccess,
  setUserInfo,
  signUp,
  signUpSuccess,
} from './users.actions';

export const initialState: UserState = {
  user: JSON.parse(localStorage.getItem('user') as string) || null,
  sendEmail: false,
  resetPass: false,
  loading: false,
  error: null,
};

export const userReducer = createReducer(
  initialState,
  on(login, state => ({
    ...state,
    loading: true,
    error: null,
    sendEmail: false,
    resetPass: false,
  })),
  on(signUp, state => ({
    ...state,
    loading: true,
    error: null,
    sendEmail: false,
    resetPass: false,
  })),
  on(signUpSuccess, state => ({ ...state, loading: false, error: null })),
  on(setUserInfo, (state, { user }) => ({
    ...state,
    user,
    loading: false,
    error: null,
  })),
  on(sendResetEmail, state => ({
    ...state,
    loading: true,
    error: null,
    sendEmail: false,
    resetPass: false,
  })),
  on(sendResetEmailSuccess, state => ({
    ...state,
    loading: false,
    error: null,
    sendEmail: true,
    resetPass: false,
  })),
  on(resetPassword, state => ({
    ...state,
    loading: true,
    error: null,
    sendEmail: false,
    resetPass: false,
  })),
  on(resetPasswordSuccess, state => ({
    ...state,
    loading: false,
    error: null,
    sendEmail: false,
    resetPass: true,
  })),
  on(authError, (state, { error }) => ({
    ...state,
    loading: false,
    error,
    sendEmail: false,
    resetPass: false,
  })),
  on(clearAuthError, state => ({
    ...state,
    loading: false,
    error: null,
    sendEmail: false,
    resetPass: false,
  })),
  on(logout, () => ({ ...initialState }))
);
