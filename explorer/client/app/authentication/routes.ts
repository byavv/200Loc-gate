import { RouterConfig } from '@angular/router';
import { LoginComponent } from './';

export const AuthenticationRoutes: RouterConfig = [
  {
    path: 'login',
    component: LoginComponent
  }
];