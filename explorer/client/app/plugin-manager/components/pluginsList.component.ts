import { Component, OnInit } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
@Component({
  selector: 'plugins-list',
  directives: [ROUTER_DIRECTIVES],
  template: `
    <div>
      // todo
      <router-outlet></router-outlet>
    </div> 
  `,
  providers: []
})

export class PluginsListComponent {
  constructor() { }
}