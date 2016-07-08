import { provideRouter, RouterConfig } from '@angular/router';
import {ApiManagerRoutes} from './api-manager';
import {AuthenticationRoutes} from './authentication';
import {PluginsRoutes} from './plugin-manager';

const routes: RouterConfig = [
  ...PluginsRoutes,
  ...ApiManagerRoutes,
  ...AuthenticationRoutes  
];

export const APP_ROUTER_PROVIDERS = [
  provideRouter(routes)
];
