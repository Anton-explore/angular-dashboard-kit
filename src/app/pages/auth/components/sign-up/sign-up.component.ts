import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { AppState } from 'src/app/models/types';
import { SignUpFormType, User } from 'src/app/models/users.model';
import { nanoid } from 'src/app/utils/formattedHelpers';
import {
  selectUserError,
  selectUserLoading,
} from 'src/app/shared/store/selectors';
import { signUp } from 'src/app/shared/store/users/users.actions';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {
  signUpForm!: FormGroup<SignUpFormType>;
  hidePass = true;
  hideConfirm = true;
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
    this.signUpForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      password: ['', [Validators.required, this.passStrengthValidator()]],
      confirmPassword: ['', [Validators.required, this.confirmPassValidator()]],
    });
  }

  get email() {
    return this.signUpForm.get('email');
  }
  get firstName() {
    return this.signUpForm.get('firstName');
  }
  get lastName() {
    return this.signUpForm.get('lastName');
  }
  get password() {
    return this.signUpForm.get('password');
  }
  get confirmPassword() {
    return this.signUpForm.get('confirmPassword');
  }

  confirmPassValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      const passwordControl = control.root.get('password');
      if (!passwordControl || !value) {
        return null;
      }
      return value !== passwordControl.value ? { passMismatch: true } : null;
    };
  }

  passStrengthValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) {
        return null;
      }
      const hasUpperCase = /[A-Z]+/.test(value);
      const hasLowerCase = /[a-z]+/.test(value);
      const hasNumeric = /[0-9]+/.test(value);
      const passwordValid = hasUpperCase && hasLowerCase && hasNumeric;

      return !passwordValid ? { passStrength: true } : null;
    };
  }

  getErrorMessage(controlName: string): string {
    const control = this.signUpForm.get(controlName);
    if (!control) {
      return '';
    }
    switch (controlName) {
      case 'email':
        return control.hasError('required')
          ? 'You must enter an email'
          : control.hasError('email')
          ? 'Not a valid email'
          : '';
      case 'firstName':
        return control.hasError('required')
          ? 'You must enter a name'
          : control.hasError('minlength')
          ? 'Too short for name'
          : '';
      case 'lastName':
        return control.hasError('required')
          ? 'You must enter a last name'
          : control.hasError('minlength')
          ? 'Too short for name'
          : '';
      case 'password':
        return control.hasError('required')
          ? 'You must enter a password'
          : control.hasError('passStrength')
          ? 'Password is too weak'
          : '';
      case 'confirmPassword':
        return control.hasError('required')
          ? 'You must confirm a password'
          : control.hasError('passMismatch')
          ? 'Passwords not equal, please check password'
          : '';
      default:
        return '';
    }
  }

  onSubmit() {
    if (this.signUpForm.valid) {
      const { email, password, firstName, lastName } = this.signUpForm.value;
      const user: User = {
        email: email?.trim() || '',
        password: password?.trim() || '',
        firstName: firstName?.trim() || '',
        lastName: lastName?.trim() || '',
        creationDate: new Date().toISOString(),
        id: +nanoid(),
        avatar: 'assets/images/user_avatar.jpg',
      };
      this.store.dispatch(signUp({ user }));
    }
  }
}
