import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import {
  BehaviorSubject,
  Subject,
  catchError,
  map,
  tap,
  throwError,
  switchMap,
  Subscription,
  timer,
} from 'rxjs';
import { ApiEndpointLinks } from 'src/app/models/types';
import {
  FirebaseUserResponse,
  LoginUserType,
  StorageUserType,
  User,
  UserClass,
} from 'src/app/models/users.model';

import { environment as env } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  private apiKey = env.firebase.apiKey;
  private mainLink = 'https://identitytoolkit.googleapis.com/v1/accounts:';
  private api: ApiEndpointLinks = {
    loginLink: this.mainLink + 'signInWithPassword?key=' + this.apiKey,
    registrationLink: this.mainLink + 'signUp?key=' + this.apiKey,
    sendResetEmailLink: this.mainLink + 'sendOobCode?key=' + this.apiKey,
    resetPasswordLink: this.mainLink + 'resetPassword?key=' + this.apiKey,
    usersEndpoint: env.firebase.databaseURL + '/users.json',
  };
  private tokenTimer!: Subscription;
  private destroy$ = new Subject<void>();

  private parsedUser = JSON.parse(localStorage.getItem('user') || '{}');
  user$: BehaviorSubject<null | UserClass> =
    new BehaviorSubject<null | UserClass>(null);

  constructor(
    private router: Router,
    private httpClient: HttpClient
  ) {}

  loginWithFirebase(loginData: LoginUserType) {
    return this.httpClient
      .post<FirebaseUserResponse>(this.api.loginLink, {
        ...loginData,
        returnSecureToken: true,
      })
      .pipe(
        switchMap(loginData => {
          return this.getUsers(loginData).pipe(
            map(users => {
              return this.setUserToStorage(users, loginData);
            })
          );
        }),
        tap(() => this.router.navigate(['/dashboard/overview'])),
        catchError(error => {
          return throwError(() => this.convertError(error));
        })
      );
  }

  signUpWithFirebase(user: User) {
    const { email, password } = user;
    return this.httpClient
      .post<FirebaseUserResponse>(this.api.registrationLink, {
        email,
        password,
        returnSecureToken: true,
      })
      .pipe(
        switchMap(loginData => {
          return this.httpClient
            .get<User[]>(this.api.usersEndpoint, {
              params: new HttpParams().set('auth', loginData.idToken || ''),
            })
            .pipe(
              switchMap(usersArray => {
                return this.addNewUser(usersArray, user, loginData.idToken);
              })
            );
        }),
        // tap(() => this.router.navigate(['/auth/login'])),
        catchError(error => {
          return throwError(() => this.convertError(error));
        })
      );
  }

  sendResetPasswordEmail(email: string) {
    return this.httpClient
      .post<{ email: string; kind: string }>(this.api.sendResetEmailLink, {
        email,
        requestType: 'PASSWORD_RESET',
      })
      .pipe(
        map(data => {
          return data;
        }),
        catchError(error => {
          return throwError(() => this.convertError(error));
        })
      );
  }

  resetPassword(oobCode: string, newPassword: string) {
    return this.httpClient
      .post<{ email: string; requestType: string }>(
        this.api.resetPasswordLink,
        { oobCode, newPassword }
      )
      .pipe(
        catchError(error => {
          return throwError(() => this.convertError(error));
        })
      );
  }

  private convertError(errorResp: HttpErrorResponse) {
    if (!errorResp.error || !errorResp.error.error) {
      return 'An unknown error occurred! HTTP state code: ' + errorResp.status;
    }
    // if (!errorResp.status && errorResp.message) {
    //   return errorResp.message;
    // }
    switch (errorResp.error.error.message) {
      case 'INVALID_LOGIN_CREDENTIALS':
        return 'Incorrect email or password. Please try again';
      case 'EMAIL_EXISTS':
        return 'This email is already in use';
      case 'TOO_MANY_ATTEMPTS_TRY_LATER':
        return 'Too many attempts, try later';
      case 'USER_DISABLED':
        return 'This user is disabled';
      case 'EMAIL_NOT_FOUND':
        return 'There is no user with this email in database';
      case 'EXPIRED_OOB_CODE' || 'INVALID_OOB_CODE':
        return 'Your link is expired. Try again.';
      case 'INVALID_PASSWORD':
        return 'Wrong password';
      case 'INVALID_EMAIL':
        return 'Email is not registered!';
      default:
        return errorResp.error.error.message;
    }
  }

  private setUserToStorage(
    dbUsers: User[],
    firebaseUser: FirebaseUserResponse
  ) {
    const user = dbUsers.find(user => user.email === firebaseUser.email);
    if (!user) {
      return null;
    }
    const expiresTimeInMs = +firebaseUser.expiresIn * 1000;
    const expirationDate = new Date(new Date().getTime() + expiresTimeInMs);

    const userData = new UserClass(
      user.email,
      user.firstName,
      user.lastName,
      user.avatar || 'assets/images/user_avatar.jpg',
      firebaseUser.idToken,
      expirationDate
    );
    this.autoLogout(expiresTimeInMs);
    localStorage.setItem('user', JSON.stringify(userData));
    this.user$.next(userData);
    return user;
  }

  getUsers(loginData: FirebaseUserResponse) {
    return this.httpClient.get<User[]>(this.api.usersEndpoint, {
      params: new HttpParams().set('auth', loginData.idToken || ''),
    });
  }

  getUserFromBaseByEmail(email: string) {
    return this.httpClient.get<User[]>(this.api.usersEndpoint).pipe(
      map(users => {
        const user = users.find(user => user.email === email);
        if (user) {
          return user;
        } else {
          throw new Error('User is not found!');
        }
      }),
      catchError(error => {
        return throwError(() => this.convertError(error));
      })
    );
  }

  addNewUser(users: User[], user: User, token: string) {
    return this.httpClient.put<User>(this.api.usersEndpoint, [...users, user], {
      params: new HttpParams().set('auth', token || ''),
    });
  }

  autoLogout(expirationDuration: number) {
    // if (this.tokenTimer) {
    //   this.tokenTimer.unsubscribe();
    // }

    this.tokenTimer = timer(expirationDuration).subscribe(() => {
      this.logout();
    });
  }

  logout(): void {
    localStorage.removeItem('user');
    this.parsedUser = null;
    this.user$.next(null);
    if (this.tokenTimer) {
      this.tokenTimer.unsubscribe();
    }
    this.router.navigate(['/auth/login']);
  }

  autoLogin() {
    const userData: StorageUserType = JSON.parse(
      localStorage.getItem('user') || '{}'
    );
    if (!userData) {
      return;
    }

    const loadedUser = new UserClass(
      userData.email,
      userData.firstName,
      userData.lastName,
      userData.avatar,
      userData._token,
      new Date(userData._tokenExpirationDate)
    );

    if (loadedUser.token) {
      this.user$.next(loadedUser);
      const expirationDuration =
        new Date(userData._tokenExpirationDate).getTime() -
        new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
