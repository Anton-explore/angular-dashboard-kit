import { Component, OnInit, Input } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from 'src/app/models/types';
import { NewPasswordPartial } from 'src/app/models/users.model';
import {
  selectResetPassword,
  selectUserError,
  selectUserLoading,
} from 'src/app/shared/store/selectors';
import { resetPassword } from 'src/app/shared/store/users/users.actions';

@Component({
  selector: 'app-new-pass',
  templateUrl: './new-pass.component.html',
  styleUrls: ['./new-pass.component.scss'],
})
export class NewPassComponent implements OnInit {
  @Input() private oobCode = '';
  newPassForm!: FormGroup<NewPasswordPartial>;
  hidePass = true;
  hideConfirm = true;
  showLoader$ = this.store.select(selectUserLoading);
  // private oobCode!: string;
  successReset$ = this.store.select(selectResetPassword);
  errorMessage$: Observable<string | null> = this.store.select(selectUserError);
  // private destroy$ = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private store: Store<AppState>,
    private router: Router
  ) {}

  ngOnInit() {
    // this.showLoader$ = this.loaderService.isLoading$;
    this.initForm();
    // this.receiveResetCode();
  }

  initForm() {
    this.newPassForm = this.formBuilder.group({
      password: ['', [Validators.required, this.passStrengthValidator()]],
      confirmPassword: ['', [Validators.required, this.confirmPassValidator()]],
    });
  }

  // receiveResetCode() {
  // this.route.queryParams.subscribe((params: Params) => {
  //   const oobCode = params['oobCode'];

  //   if (oobCode) {
  //     console.log('oobCode:', oobCode);
  //     this.oobCode = oobCode;
  //   }
  // });
  // }

  get password() {
    return this.newPassForm.get('password');
  }
  get confirmPassword() {
    return this.newPassForm.get('confirmPassword');
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
    const control = this.newPassForm.get(controlName);
    if (!control) {
      return '';
    }
    switch (controlName) {
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
    if (this.newPassForm.valid) {
      const newPassword = this.newPassForm.value.password?.trim();
      if (newPassword && this.oobCode) {
        this.store.dispatch(
          resetPassword({ oobCode: this.oobCode, newPassword })
        );
      }
    }
  }

  goToLogin() {
    this.router.navigate(['/auth/login']);
  }

  // ngOnDestroy(): void {
  //   this.destroy$.next();
  //   this.destroy$.complete();
  // }
}
