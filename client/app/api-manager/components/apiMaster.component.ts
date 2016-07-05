import {Component, OnInit, ViewChild, QueryList} from "@angular/core";
import {ActivatedRoute, Router, ROUTER_DIRECTIVES} from "@angular/router";
import {MASTER_STEPS_COMPONENTS} from "./steps";
import {MasterController} from "../services/masterController";
import {BackEnd} from "../../shared/services";
import {Config} from "../../shared/models"
import {UiTabs, UiPane, RestSize} from '../directives';
import {isString} from "@angular/compiler/src/facade/lang";
import {Observable} from "rxjs";

@Component({
  selector: "api-master",
  template: `
    <div class="row">
        <div class="col-md-12 col-sm-12" style="position: relative;"> 
            <ui-tabs #tab rest-height default='general'>
                <ui-pane id='general' title='config' [valid]="(master.isValid('general') | async)">
                    <step-general (next)="tab.goTo($event)"></step-general>
                </ui-pane>
                <ui-pane id='plugins' title='pipe' [valid]="(master.isValid('plugins') | async)">
                    <step-plugins (next)="tab.goTo($event)"></step-plugins>
                </ui-pane>
                <ui-pane id='preview' title='test' [valid]='true'>
                    <step-preview (next)="onDone()"></step-preview>
                </ui-pane>     
            </ui-tabs>
        </div>
    </div>
    `,
  directives: [
    ROUTER_DIRECTIVES,
    ...MASTER_STEPS_COMPONENTS,
    UiTabs,
    UiPane
  ],
  viewProviders: [MasterController]
})

export class ApiMasterComponent {
  @ViewChild(UiTabs) tab: UiTabs;
  id: string;
  loading: boolean = true;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private master: MasterController,
    private userBackEnd: BackEnd
  ) {
    this.router
      .routerState
      .queryParams
      .subscribe(params => {
        this.id = params["id"];
        if (this.id) {
          this.userBackEnd.getConfig(this.id).subscribe((config: Config) => {
            this.master.init(config);
          });
        } else {
          this.master.init(new Config());
        }
      })
  }

  onDone() {
    this.master
      .validate()
      .do(() => { this.loading = true; })
      .flatMap(() => this.userBackEnd.createOrUpdate(this.master.config, this.id))
      .subscribe((result) => {
        console.log(result);
        this.router.navigate(['/']);
      }, (err) => {
        if (isString(err))
          this.tab.goTo(err);
      });
  }
}