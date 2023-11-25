import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';

import { NotFoundComponent } from './components/not-found/not-found.component';
import { UniversalTableComponent } from './components/universal-table/universal-table.component';
import { ChartComponent } from './components/chart/chart.component';
import { LoaderComponent } from './components/loader/loader.component';
import { AddTicketComponent } from './components/add-ticket/add-ticket.component';
import { AddContactComponent } from './components/add-contact/add-contact.component';
import { DeletionModalComponent } from './components/deletion-modal/deletion-modal.component';
import { LogoComponent } from './components/logo/logo.component';

import { DateDifferencePipe } from './pipes/date-difference.pipe';
import { IsValidDatePipe } from './pipes/date-validation.pipe';
import { FormatDurationPipe } from './pipes/format-duration.pipe';

@NgModule({
  declarations: [
    NotFoundComponent,
    UniversalTableComponent,
    ChartComponent,
    LoaderComponent,
    AddTicketComponent,
    AddContactComponent,
    DeletionModalComponent,
    LogoComponent,
    DateDifferencePipe,
    IsValidDatePipe,
    FormatDurationPipe,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  exports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    UniversalTableComponent,
    ChartComponent,
    LoaderComponent,
    AddTicketComponent,
    AddContactComponent,
    DeletionModalComponent,
    LogoComponent,
    FormatDurationPipe,
  ],
})
export class SharedModule {}
