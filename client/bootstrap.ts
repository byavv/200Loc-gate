import { enableProdMode, provide, PLATFORM_DIRECTIVES } from '@angular/core';
import { bootstrap } from '@angular/platform-browser-dynamic';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { APP_ROUTER_PROVIDERS } from './app/app.routes';
import { App } from './app/app.component';
import { HTTP_PROVIDERS } from '@angular/http';
import { disableDeprecatedForms, provideForms } from '@angular/forms';
import { InertLink } from "./app/shared/directives";

declare var ENV: string;
//if ('production' === ENV) {
    enableProdMode();
//}

bootstrap(App, [
    APP_ROUTER_PROVIDERS,
    HTTP_PROVIDERS,
    disableDeprecatedForms(),
    provideForms(),
    provide(PLATFORM_DIRECTIVES, { useValue: InertLink, multi: true })
])
    .catch(console.error)