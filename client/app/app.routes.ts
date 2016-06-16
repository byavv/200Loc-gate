import { provideRouter, RouterConfig } from '@angular/router';

import { ApiManagementComponent, ApiListComponent, ApiMasterComponent } from './api-manager';


export const AppRoutes = [
  {
    path: '/',
    component: ApiManagementComponent,
    index: true,
    children: [
      { path: '/list', component: ApiListComponent, index: true },
      { path: '/master/:id', component: ApiMasterComponent }
    ]
  },
 // { path: '/login', component: LoginComponent },
 // { path: '/master', component: ApiMasterComponent }
];

const routes: RouterConfig = [
  // ...HeroesRoutes,
  // ...CrisisCenterRoutes
  ...AppRoutes
];

export const APP_ROUTER_PROVIDERS = [
  provideRouter(routes),
  // CrisisDetailGuard
];
