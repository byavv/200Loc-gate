import { RouterConfig } from '@angular/router';
import { ApiManagementComponent, ApiListComponent, ApiMasterComponent } from './';

export const ApiManagerRoutes: RouterConfig = [
  {
    path: '',
    component: ApiManagementComponent,
    children: [
      {
        path: 'master',
        component: ApiMasterComponent
      },
      {
        path: '',
        component: ApiListComponent,
        terminal: true
      }      
    ]
  }
];
