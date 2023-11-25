import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewPassComponent } from './components/new-password/new-pass.component';
import { ResetPassComponent } from './components/reset-password/reset-pass.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { loginGuard } from 'src/app/shared/guards/login.guard';
import { LoginComponent } from './components/login/login.component';
import { AuthComponent } from './auth.component';

const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
    canActivateChild: [loginGuard],
    children: [
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'sign-up',
        component: SignUpComponent,
      },
      {
        path: 'reset-password',
        component: ResetPassComponent,
      },
      {
        path: 'new-password',
        component: NewPassComponent,
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'prefix',
      },
      {
        path: '**',
        redirectTo: 'login',
        pathMatch: 'prefix',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
