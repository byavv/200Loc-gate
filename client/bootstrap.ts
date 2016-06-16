import { enableProdMode } from '@angular/core';
import { bootstrap } from '@angular/platform-browser-dynamic';
import { ROUTER_DIRECTIVES } from '@angular/router';

import { AppComponent } from './app/app.component';

declare var ENV: string;

if ('production' === ENV) {
    enableProdMode();
}

bootstrap(AppComponent, [
    
]);