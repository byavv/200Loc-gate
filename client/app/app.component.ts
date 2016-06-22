import { Component, OnInit } from '@angular/core';
import { ROUTER_DIRECTIVES, Router } from '@angular/router';
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
       <div class='row'>
            <div id="sidebar-wrapper" class="col-md-1">           
                <ul class="nav list-group">
                    <li>
                        <a class="list-group-item" [routerLink]="['/']"><i class="icon-home icon-1x"></i>Sidebar Item 1</a>
                    </li>
                    <li>
                        <a class="list-group-item" [routerLink]="['/master']"><i class="icon-home icon-1x"></i>Sidebar Item 2</a>
                    </li>
                    <li>
                        <a class="list-group-item" [routerLink]="['/plugins']"><i class="icon-home icon-1x"></i>Sidebar Item 3</a>
                    </li>
                </ul>          
            </div>     
            <div id="main-wrapper" class="col-md-11">
                <div id="main">
                    <div class="page-header">
                      <h3>Admin</h3>
                    </div>
                    <router-outlet>
                    </router-outlet>
                </div>           
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