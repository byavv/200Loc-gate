import { enableProdMode } from '@angular/core';
import { bootstrap } from '@angular/platform-browser-dynamic';
import { ROUTER_DIRECTIVES  } from '@angular/router';
import { APP_ROUTER_PROVIDERS } from './app/app.routes';
import { App } from './app/app.component';
import { HTTP_PROVIDERS } from '@angular/http';

declare var ENV: string;
if ('production' === ENV) {
    enableProdMode();
}

bootstrap(App, [
    APP_ROUTER_PROVIDERS,
    HTTP_PROVIDERS
])
    .then(() => {
        console.log("APP STARTED")
    })
    .catch(console.error)