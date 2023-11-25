import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { MainModule } from './pages/main/main.module';
import { AuthModule } from './pages/auth/auth.module';

import { LoaderInterceptor } from './shared/services/loader-interceptor.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './shared/services/auth-interceptor.service';

import { AppComponent } from './app.component';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { contactsReducer } from './shared/store/contacts/contacts.reducer';
import * as contactsEffects from './shared/store/contacts/contacts.effects';
import { ticketsReducer } from './shared/store/tickets/tickets.reducer';
import * as ticketsEffects from './shared/store/tickets/tickets.effects';
import { userReducer } from './shared/store/users/users.reducer';
import * as userEffects from './shared/store/users/users.effects';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MainModule,
    AuthModule,
    StoreModule.forRoot({
      contacts: contactsReducer,
      tickets: ticketsReducer,
      user: userReducer,
    }),
    EffectsModule.forRoot([contactsEffects, ticketsEffects, userEffects]),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      autoPause: true,
      trace: false,
      traceLimit: 75,
    }),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
