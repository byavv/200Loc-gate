import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ROUTER_DIRECTIVES } from '@angular/router';
import { BackEnd } from '../../shared/services';
import { Observable } from 'rxjs';
import { Config } from '../../shared/models'

@Component({
  selector: 'api-details',
  directives: [ROUTER_DIRECTIVES],
  template: require('./templates/apiDetails.template.html'),
  providers: []
})

export class ApiDetailsComponent implements OnInit {
  config: Config;

  constructor(private route: ActivatedRoute, private router: Router, private backEnd: BackEnd) { }

  ngOnInit() {
    this.route.params
      .flatMap(params => this.backEnd.getConfig(params['id']))
      .subscribe((config) => {
        this.config = config;
      })
  }
  onSelectConfig(id) {
    this.router.navigate(['/master'], { queryParams: { id: id } })
  }
}