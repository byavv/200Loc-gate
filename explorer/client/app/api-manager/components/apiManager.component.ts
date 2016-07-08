import { Component, OnInit } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';


@Component({
    selector: 'api-manager',
    directives: [ROUTER_DIRECTIVES],
    template: require('./templates/apiManager.template.html'),
    providers: []
})

export class ApiManagementComponent {
    constructor() {
    }
}