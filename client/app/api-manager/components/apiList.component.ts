import { Component, OnInit, OnDestroy, trigger, state, transition, style, animate } from '@angular/core';
import { AppController, BackEnd } from '../../shared/services';
import { ROUTER_DIRECTIVES, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'api-list',
  directives: [ROUTER_DIRECTIVES],
  template: require('./templates/apiList.template.html'),
  styles: [require('./styles/apiList.scss')],
  providers: [],
  animations: [
    trigger('flyInOut', [
      state('in', style({ transform: 'translateX(0)' })),
      transition('void => *', [
        style({ transform: 'translateX(-100%)' }),
        animate(100)
      ]),
      transition('* => void', [
        animate(100, style({ transform: 'translateX(100%)' }))
      ])
    ])
  ]
})

export class ApiListComponent implements OnInit, OnDestroy {
  configs: Array<any> = [];
  sub: Subscription;
  constructor(private appController: AppController, private backEnd: BackEnd, private router: Router) { }
  ngOnInit() {
    this.sub = this.backEnd.getApiConfigs().subscribe(configs => {
      this.configs = configs;
    })
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  deleteApi(config) {
    this.backEnd.deleteApiConfig(config.id).subscribe(res => {
      console.log(res);
      let ind = this.configs.indexOf(config);
      this.configs.splice(ind, 1);
    });
  }
  editApi(config) {
    this.router.navigate(['/master'], { queryParams: { id: config.id } })
  }
}