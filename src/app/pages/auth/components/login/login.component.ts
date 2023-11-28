import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/models/types';
import { LoginPartial, LoginUserType } from 'src/app/models/users.model';

import { clearAuthError, login } from 'src/app/shared/store/users/users.actions';
import {
  selectUserError,
  selectUserLoading,
} from 'src/app/shared/store/selectors';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm!: FormGroup<LoginPartial>;
  hide = true;
  errorMessage$: Observable<string | null> = this.store.select(selectUserError);
  showLoader$: Observable<boolean> = this.store.select(selectUserLoading);

  constructor(
    private formBuilder: FormBuilder,
    private store: Store<AppState>
  ) {}

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  getEmailErrorMessage() {
    if (this.email?.hasError('required')) {
      return 'You must enter a value';
    }
    return this.email?.hasError('email') ? 'Not a valid email' : '';
  }
  getPassErrorMessage() {
    return this.password?.hasError('required') ? 'You must enter a value' : '';
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      const loginValues: LoginUserType = {
        email: email?.trim() || '',
        password: password?.trim() || '',
      };
      this.store.dispatch(login(loginValues));
    }
  }

  ngOnDestroy() {
    this.store.dispatch(clearAuthError());
  }
}
