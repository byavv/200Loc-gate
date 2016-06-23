import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppController } from '../../shared/services';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { Subscription } from 'rxjs'

@Component({
  selector: 'api-list',
  directives: [ROUTER_DIRECTIVES],
  template: require('./templates/apiList.template.html'),
  styles: [require('./styles/apiList.scss')],
  providers: []
})

export class ApiListComponent implements OnInit, OnDestroy {
  configs: Array<any> = [];
  sub: Subscription;
  constructor(private appController: AppController) {

  }
  ngOnInit() {
    this.sub = this.appController.init$.subscribe((config) => {
      this.configs = config.configs;
    }, (err) => {
      console.error(err);
    })
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}