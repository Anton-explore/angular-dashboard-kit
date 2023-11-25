import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable, delay } from 'rxjs';
import { ModalContentType } from 'src/app/models/types';
import { LoaderService } from '../../services/loader.service';

@Component({
  selector: 'app-deletion-modal',
  templateUrl: './deletion-modal.component.html',
  styleUrls: ['./deletion-modal.component.scss'],
})
export class DeletionModalComponent implements OnInit {
  @Input() content!: ModalContentType;
  @Output() closeTrigger = new EventEmitter<void>();
  errorMessage: string | null = null;
  showLoader$!: Observable<boolean>;

  constructor(
    private loaderService: LoaderService,
    public dialogRef: MatDialogRef<DeletionModalComponent>
  ) {}

  ngOnInit() {
    this.showLoader$ = this.loaderService.isLoading$.pipe(delay(0));
  }

  onSubmit() {
    this.dialogRef.close();
  }
}
