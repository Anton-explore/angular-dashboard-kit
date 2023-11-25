import { NgModule } from '@angular/core';
import { AuthRoutingModule } from './auth-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

import { AuthComponent } from './auth.component';
import { LoginComponent } from './components/login/login.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { ResetPassComponent } from './components/reset-password/reset-pass.component';
import { NewPassComponent } from './components/new-password/new-pass.component';

@NgModule({
  declarations: [
    AuthComponent,
    LoginComponent,
    SignUpComponent,
    ResetPassComponent,
    NewPassComponent,
  ],
  imports: [AuthRoutingModule, SharedModule],
})
export class AuthModule {}
