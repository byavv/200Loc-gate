import { Component, OnInit } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { APP_SERVICES_PROVIDERS, Identity, AppController, Storage } from './shared/services'
import { LoaderComponent, HeaderComponent } from './shared/components';

@Component({
  selector: 'app',
  directives: [ROUTER_DIRECTIVES, LoaderComponent, HeaderComponent],
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
  `,
  providers: [APP_SERVICES_PROVIDERS]
})

export class App {
  loading = true;
  constructor(private identity: Identity, private storage: Storage, private appController: AppController) {
    this.appController.init$.subscribe(() => {
      this.loading = false;
    })
    this.appController.start();
    identity.update(JSON.parse(storage.getItem("authorizationData")));
  }
}