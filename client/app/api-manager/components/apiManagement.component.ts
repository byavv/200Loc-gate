import { Component, OnInit } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';


@Component({
    selector: 'api-manager',
    directives: [ROUTER_DIRECTIVES],
    template: `
    <h2>API MANAGER</h2>
    <router-outlet></router-outlet>
  `,
    providers: []
})

export class ApiManagementComponent {

    constructor() {

    }
}