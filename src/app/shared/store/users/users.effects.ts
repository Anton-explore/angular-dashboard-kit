import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthService } from '../../services/auth.service';
import {
  authError,
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
import { catchError, map, mergeMap, of, switchMap, tap } from 'rxjs';
import { Router } from '@angular/router';

export const loginEffect = createEffect(
  (actions$ = inject(Actions), authService = inject(AuthService)) => {
    return actions$.pipe(
      ofType(login),
      mergeMap(loginData =>
        authService.loginWithFirebase(loginData).pipe(
          map(user => {
            return setUserInfo({ user });
          }),
          catchError((error: string) => of(authError({ error })))
        )
      )
    );
  },
  { functional: true }
);

export const signUpEffect = createEffect(
  (
    actions$ = inject(Actions),
    authService = inject(AuthService),
    router = inject(Router)
  ) => {
    return actions$.pipe(
      ofType(signUp),
      mergeMap(({ user }) =>
        authService.signUpWithFirebase(user).pipe(
          map(() => signUpSuccess()),
          tap(() => router.navigate(['/auth/login'])),
          catchError(error => of(authError({ error })))
        )
      )
    );
  },
  { functional: true }
);

export const sendResetEmailEffect = createEffect(
  (actions$ = inject(Actions), authService = inject(AuthService)) => {
    return actions$.pipe(
      ofType(sendResetEmail),
      switchMap(({ email }) =>
        authService.sendResetPasswordEmail(email).pipe(
          map(() => sendResetEmailSuccess()),
          catchError(error => of(authError({ error })))
        )
      )
    );
  },
  { functional: true }
);

export const resetPasswordEffect = createEffect(
  (actions$ = inject(Actions), authService = inject(AuthService)) => {
    return actions$.pipe(
      ofType(resetPassword),
      switchMap(({ oobCode, newPassword }) =>
        authService.resetPassword(oobCode, newPassword).pipe(
          map(() => resetPasswordSuccess()),
          catchError(error => of(authError({ error })))
        )
      )
    );
  },
  { functional: true }
);

export const logoutEffect = createEffect(
  (actions$ = inject(Actions), authService = inject(AuthService)) => {
    return actions$.pipe(
      ofType(logout),
      tap(() => authService.logout()),
      catchError(error => of(authError({ error })))
    );
  },
  { functional: true, dispatch: false }
);

// export const getUserEffect = createEffect(
//   (actions$ = inject(Actions), authService = inject(AuthService)) => {
//     return actions$.pipe(
//       ofType(getUserInfo),
//       switchMap(({ userId }) =>
//         authService.getUserFromBaseByEmail(userId).pipe(
//           map(user => {

//             return setUserInfo({ user })
//           }
//           ),
//           tap(() => this.router.navigate(['/dashboard/overview'])),
//           catchError(error => of(authError({ error })))
//         )
//       )
//     );
//   },
//   { functional: true }
// );
