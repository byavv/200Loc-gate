import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ROUTER_DIRECTIVES, Router } from '@angular/router';
import { APP_SERVICES_PROVIDERS, Identity, AppController, Storage } from './shared/services'
import { SHARED_COMPONENTS } from './shared/components';

@Component({
    selector: 'app',
    directives: [ROUTER_DIRECTIVES, ...SHARED_COMPONENTS],
    template: `
    <div class="page-wrap">
       <loader [active]='loading' [async]='appController.init$'></loader>      
       <app-header></app-header>
       <div [hidden]='loading' class='container-fluid'>
            <div class='content-area'> 
                <router-outlet>
                </router-outlet>
            </div>
        </div>        
   </div> 
   <app-footer></app-footer>
  `,
    providers: [APP_SERVICES_PROVIDERS]
})

export class App {
    loading = true;
    constructor(
        private identity: Identity,
        private storage: Storage,
        private appController: AppController,
        public viewContainerRef: ViewContainerRef
    ) {
        this.appController.init$.subscribe(() => {
            this.loading = false;
        })
        this.appController.start();
        identity.update(JSON.parse(storage.getItem("authorizationData")));
    }
}