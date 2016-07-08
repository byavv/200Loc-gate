import { RouterConfig } from '@angular/router';
import { PluginsDetailComponent, PluginsBaseComponent, PluginsListComponent } from './';

export const PluginsRoutes: RouterConfig = [
  /* {
     path: 'plugins',
     component: PluginsBaseComponent,
     children: [
       {
         path: ':name',
         component: PluginsDetailComponent
       },
       {
         path: '',
         component: PluginsListComponent
       }
     ]
     //see https://github.com/angular/vladivostok/issues/48
   },*/
  {
    path: 'plugins',
    component: PluginsListComponent,
  },
  /*{
    path: 'plugin',
    component: PluginsBaseComponent,
  }*/
];
