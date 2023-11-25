import { Component } from '@angular/core';

@Component({
  selector: 'app-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.scss'],
})
export class LogoComponent {
  logoImage = 'assets/images/logo.svg';
  logoText = 'Dashboard Kit';
}
