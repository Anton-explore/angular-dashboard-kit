import { createAction, props } from '@ngrx/store';
import { User } from 'src/app/models/users.model';

export const login = createAction(
  '[User] Login',
  props<{ email: string; password: string }>()
);

export const signUp = createAction('[User] Sign up', props<{ user: User }>());

export const signUpSuccess = createAction('[User] Sign up success');

export const logout = createAction('[User] Logout');

export const resetPassword = createAction(
  '[User] Reset password',
  props<{ oobCode: string; newPassword: string }>()
);

export const resetPasswordSuccess = createAction(
  '[User] Reset password success'
);

export const sendResetEmail = createAction(
  '[User] Send reset email',
  props<{ email: string }>()
);

export const sendResetEmailSuccess = createAction(
  '[User] Send reset email success'
);

export const getUserInfo = createAction(
  '[User] Get User Info',
  props<{ userId: string }>()
);

export const setUserInfo = createAction(
  '[User] Set User Info',
  props<{ user: User | null }>()
);

export const authError = createAction(
  '[User] Get authentication error',
  props<{ error: string }>()
);

export const clearAuthError = createAction('[User] Clear authentication error');
