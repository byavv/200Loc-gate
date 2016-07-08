import { Component, OnInit } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';

@Component({
    selector: 'plugins-base',
    template: `
        <h3>PLUGINS MANAGER</h3>
        <router-outlet></router-outlet>
  `,
    directives: [ROUTER_DIRECTIVES]
})

export class PluginsBaseComponent {
    constructor() {
    }
}