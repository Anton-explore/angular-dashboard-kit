import { FormControl } from '@angular/forms';
export interface User {
  id: number;
  token?: string | null;
  avatar?: string;
  creationDate: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export class UserClass {
  constructor(
    public email: string,
    public firstName: string,
    public lastName: string,
    public avatar: string,
    private _token: string,
    private _tokenExpirationDate: Date
  ) {}

  get token() {
    if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
      return null;
    }
    return this._token;
  }
}

export interface StorageUserType {
  email: string;
  firstName: string;
  lastName: string;
  avatar: string;
  _token: string;
  _tokenExpirationDate: string;
}

// export type UserPartial = Pick<User, 'firstName' | 'lastName' | 'avatar'>;
export type UserNewPassword = Pick<User, 'password' | 'id'>;
export type LoginUserType = Pick<User, 'password' | 'email'>;
// export type SignUpUserType = Pick<User, 'email' | 'password' | 'firstName' | 'lastName'>

export interface SignUpFormType {
  email: FormControl<string | null>;
  firstName: FormControl<string | null>;
  lastName: FormControl<string | null>;
  password: FormControl<string | null>;
  confirmPassword: FormControl<string | null>;
}

export type LoginPartial = Pick<SignUpFormType, 'email' | 'password'>;

export type ResetPartial = Pick<SignUpFormType, 'email'>;

export type NewPasswordPartial = Pick<
  SignUpFormType,
  'password' | 'confirmPassword'
>;

export interface FirebaseUserResponse {
  displayName?: string | null;
  email: string;
  idToken: string;
  kind: string;
  LocalId: string;
  registered?: boolean;
  refreshToken: string;
  expiresIn: string;
}

// export interface LoginValuesType {
//   email: string | undefined;
//   password: string | undefined
// }

export interface UserValuesType {
  email: string | undefined;
  password: string | undefined;
  firstName: string | null | undefined;
  lastName: string | null | undefined;
  creationDate: string;
  id: number;
  avatar: string;
}

export interface UserState {
  user: User | null;
  sendEmail: boolean;
  resetPass: boolean;
  loading: boolean;
  error: string | null;
}
