import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MainComponent } from './main.component';
import { NotFoundComponent } from 'src/app/shared/components/not-found/not-found.component';
import { AuthGuard } from 'src/app/shared/guards/auth.guard';
import { OverviewComponent } from './components/overview/overview.component';
import { ContactsComponent } from './components/contacts/contacts.component';
import { TicketsComponent } from './components/tickets/tickets.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    canActivateChild: [AuthGuard],
    children: [
      {
        path: 'overview',
        component: OverviewComponent,
      },
      {
        path: 'contacts',
        component: ContactsComponent,
      },
      {
        path: 'tickets',
        component: TicketsComponent,
      },
      {
        path: 'not-found',
        component: NotFoundComponent,
      },
      { path: '', redirectTo: 'overview', pathMatch: 'prefix' },
      { path: '**', redirectTo: 'not-found' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainRoutingModule {}
