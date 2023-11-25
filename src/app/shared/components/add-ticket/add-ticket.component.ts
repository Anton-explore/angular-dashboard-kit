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

import {
  PriorityType,
  TicketsFormType,
  TicketsType,
} from 'src/app/models/tickets.model';
import { MatDialogRef } from '@angular/material/dialog';
import { nanoid } from 'src/app/utils/formattedHelpers';
import { AppState } from 'src/app/models/types';
import { selectContactsLoading } from '../../store/selectors';

@Component({
  selector: 'app-add-ticket',
  templateUrl: './add-ticket.component.html',
  styleUrls: ['./add-ticket.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddTicketComponent implements OnInit, AfterViewInit {
  @Input() content?: { ticket: TicketsType };
  defaultAvatar = 'assets/images/user_avatar.jpg';
  addTicketHeading = 'Add ticket';
  ticketForm!: FormGroup;
  ticket?: TicketsType;
  errorMessage!: string;
  showLoader$: Observable<boolean> = this.store.select(selectContactsLoading);

  constructor(
    public dialogRef: MatDialogRef<AddTicketComponent>,
    private formBuilder: FormBuilder,
    private store: Store<AppState>,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.initForm();
  }

  ngAfterViewInit() {
    this.addTicketHeading = this.content?.ticket
      ? 'Update ticket'
      : this.addTicketHeading;
    this.updateForm(this.content?.ticket);
    this.cdr.detectChanges();
  }

  private initForm() {
    this.ticketForm = this.formBuilder.group({
      detail: ['', [Validators.required, Validators.minLength(5)]],
      name: ['', [Validators.required, Validators.minLength(2)]],
      date: [new Date(), [Validators.required]],
      priority: ['', [Validators.required]],
    });
  }

  private updateForm(editedTicket: TicketsType | undefined) {
    if (!editedTicket) {
      return;
    }

    this.ticket = editedTicket;
    this.ticketForm.patchValue({
      detail: editedTicket.detail,
      name: editedTicket.customerName,
      date: new Date(editedTicket.date),
      priority: editedTicket.priority,
    });
  }

  get detail() {
    return this.ticketForm.get('detail');
  }
  get name() {
    return this.ticketForm.get('name');
  }
  get date() {
    return this.ticketForm.get('date');
  }
  get priority() {
    return this.ticketForm.get('priority');
  }

  getErrorMessage(controlName: string): string {
    const control = this.ticketForm.get(controlName);
    if (!control) {
      return '';
    }
    switch (controlName) {
      case 'detail':
        return control.hasError('required')
          ? 'You must enter an description'
          : control.hasError('minlength')
          ? 'Too short'
          : '';
      case 'name':
        return control.hasError('required')
          ? 'You must enter a name'
          : control.hasError('minlength')
          ? 'Too short for name'
          : '';
      case 'date':
        return control.hasError('required') ? 'You must choose date' : '';
      case 'priority':
        return control.hasError('required') ? 'You must define priority' : '';
      default:
        return '';
    }
  }

  onSubmit() {
    if (this.ticketForm.valid) {
      if (this.ticket) {
        this.updateTicketData(this.ticketForm.value, this.ticket);
      } else {
        this.createTicketData(this.ticketForm.value);
      }
    }
  }

  private createTicketData(formValues: TicketsFormType) {
    const { detail, name, priority, date } = formValues;
    const ticketId = +nanoid();
    const newTicket = {
      detail: detail?.trim() || '',
      customerName: name?.trim() || '',
      priority: priority ? (priority as PriorityType) : 'low',
      customerAvatar: this.defaultAvatar,
      id: ticketId,
      date: date ? date.toISOString() : new Date().toISOString(),
    };

    this.dialogRef.close({ newTicket });
  }

  private updateTicketData(
    formValues: TicketsFormType,
    ticketData: TicketsType
  ) {
    const { detail, name, priority, date } = formValues;
    const ticketId = ticketData.id;
    const updatedTicket = {
      detail: detail?.trim() || '',
      customerName: name?.trim() || '',
      priority: priority ? (priority as PriorityType) : ticketData.priority,
      customerAvatar: ticketData
        ? ticketData.customerAvatar
        : this.defaultAvatar,
      id: ticketId,
      date: date ? date.toISOString() : ticketData.date,
    };
    this.dialogRef.close({ updatedTicket });
  }
}
