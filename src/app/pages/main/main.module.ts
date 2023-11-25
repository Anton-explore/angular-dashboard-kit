import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { MainRoutingModule } from './main-routing.module';

import { MainComponent } from './main.component';
import { HeaderComponent } from './components/header/header.component';
import { NavPanelComponent } from './components/nav-panel/nav-panel.component';
import { OverviewComponent } from './components/overview/overview.component';
import { ContactsComponent } from './components/contacts/contacts.component';
import { TicketsComponent } from './components/tickets/tickets.component';

@NgModule({
  declarations: [
    MainComponent,
    HeaderComponent,
    NavPanelComponent,
    OverviewComponent,
    ContactsComponent,
    TicketsComponent,
  ],
  imports: [SharedModule, MainRoutingModule],
})
export class MainModule {}
