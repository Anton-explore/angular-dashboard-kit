import {
  Component,
  Input,
  OnInit,
  AfterViewInit,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { ContactsFormType, ContactsType } from 'src/app/models/contacts.model';
import { MatDialogRef } from '@angular/material/dialog';
import { nanoid } from 'src/app/utils/formattedHelpers';
import { AppState } from 'src/app/models/types';
import { selectContactsLoading } from '../../store/selectors';

@Component({
  selector: 'app-add-contact',
  templateUrl: './add-contact.component.html',
  styleUrls: ['./add-contact.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddContactComponent implements OnInit, AfterViewInit {
  @Input() content?: { contact: ContactsType };
  defaultAvatar = 'assets/images/user_avatar.jpg';
  addContactHeading = 'Add new contact';
  contactForm!: FormGroup;
  contact?: ContactsType;
  errorMessage!: string;
  avatarImage!: File | null;
  showLoader$: Observable<boolean> = this.store.select(selectContactsLoading);

  constructor(
    public dialogRef: MatDialogRef<AddContactComponent>,
    private formBuilder: FormBuilder,
    private store: Store<AppState>,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.initForm();
  }

  ngAfterViewInit() {
    this.addContactHeading = this.content?.contact
      ? 'Update contact'
      : this.addContactHeading;
    this.updateForm(this.content?.contact);
    this.cdr.detectChanges();
  }

  private initForm() {
    this.contactForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      address: ['', [Validators.required, Validators.minLength(2)]],
      avatar: [''],
    });
  }

  private updateForm(editedContact: ContactsType | undefined) {
    if (!editedContact) {
      return;
    }

    this.contact = editedContact;
    const fullName = editedContact.name;
    const [firstName, lastName] = fullName.split(' ');
    this.contactForm.patchValue({
      email: editedContact.email,
      firstName: firstName,
      lastName: lastName,
      address: editedContact.address,
      avatar: editedContact.avatar,
    });
  }

  onAvatarChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files ? input.files[0] : null;
    if (file) {
      this.avatarImage = file;
      this.contactForm.patchValue({ avatar: URL.createObjectURL(file) });
    }
  }

  get avatar() {
    return this.contactForm.get('avatar');
  }
  get email() {
    return this.contactForm.get('email');
  }
  get firstName() {
    return this.contactForm.get('firstName');
  }
  get lastName() {
    return this.contactForm.get('lastName');
  }
  get address() {
    return this.contactForm.get('address');
  }

  getErrorMessage(controlName: string): string {
    const control = this.contactForm.get(controlName);
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
      case 'address':
        return control.hasError('required')
          ? 'You must enter an address'
          : control.hasError('minlength')
          ? 'Too short for address'
          : '';
      default:
        return '';
    }
  }

  getAvatarUrl(): string {
    return this.contactForm.get('avatar')?.value || '';
  }

  onSubmit() {
    if (this.contactForm.valid) {
      if (this.contact) {
        this.updateContactData(this.contactForm.value, this.contact);
      } else {
        this.createContactData(this.contactForm.value);
      }
    }
  }

  private createContactData(formValues: ContactsFormType) {
    const { email, firstName, lastName, address, avatar } = formValues;
    const contactId = +nanoid();
    const newContact = {
      email: email?.trim() || '',
      name: `${firstName} ${lastName}`,
      address: address?.trim() || '',
      avatar: avatar ? avatar : '',
      id: contactId,
      created: new Date().toISOString(),
    };
    this.dialogRef.close({ contact: newContact, avatar: this.avatarImage });
  }

  private updateContactData(
    formValues: ContactsFormType,
    contactData: ContactsType
  ) {
    const { email, firstName, lastName, address, avatar } = formValues;
    const contactId = contactData.id;
    const updatedContact = {
      email: email?.trim() || '',
      name: `${firstName} ${lastName}`,
      address: address?.trim() || '',
      avatar: avatar ? avatar : '',
      id: contactId,
      created: contactData.created,
      updated: new Date().toISOString(),
    };
    this.dialogRef.close({ contact: updatedContact, avatar: this.avatarImage });
  }
}
