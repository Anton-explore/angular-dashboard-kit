import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from 'src/app/models/types';
import { ResetPartial } from 'src/app/models/users.model';
import {
  selectSendingEmailToUser,
  selectUserError,
  selectUserLoading,
} from 'src/app/shared/store/selectors';
import { sendResetEmail } from 'src/app/shared/store/users/users.actions';

@Component({
  selector: 'app-reset-pass',
  templateUrl: './reset-pass.component.html',
  styleUrls: ['./reset-pass.component.scss'],
})
export class ResetPassComponent implements OnInit {
  emailForm!: FormGroup<ResetPartial>;
  emailSent$ = this.store.select(selectSendingEmailToUser);
  errorMessage$: Observable<string | null> = this.store.select(selectUserError);
  showLoader$ = this.store.select(selectUserLoading);

  constructor(
    private formBuilder: FormBuilder,
    private store: Store<AppState>,
    private router: Router
  ) {}

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.emailForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  get email() {
    return this.emailForm.get('email');
  }

  getEmailErrorMessage() {
    if (this.email?.hasError('required')) {
      return 'You must enter a value';
    }
    return this.email?.hasError('email') ? 'Not a valid email' : '';
  }

  onSubmit() {
    if (this.emailForm.valid) {
      this.sendResetMail();
    }
  }

  private sendResetMail() {
    const email = this.emailForm.value.email?.trim();
    if (email) {
      this.store.dispatch(sendResetEmail({ email }));
      this.emailForm.reset();
    }
  }
}
