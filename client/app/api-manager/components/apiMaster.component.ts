import {Component, OnInit, ViewChild, QueryList} from "@angular/core";
import {ActivatedRoute, Router, ROUTER_DIRECTIVES} from "@angular/router";
import {MASTER_STEPS_COMPONENTS} from "./steps";
import {MasterController} from "../services/masterController";
import {BackEnd} from "../../shared/services";
import {Config} from "../../shared/models"
import {UiTabs, UiPane, RestSize} from '../directives';
//import {LoaderComponent} from "../../../shared/components/loader/loader";
import {isString} from "@angular/compiler/src/facade/lang";
import {Observable} from "rxjs";

@Component({
  selector: "api-master",
  template: `
    <div class="row">
        <div class="col-md-12 col-sm-12" style="position: relative;">           
           <!--
            <loader [async]='master.init$' [active]='loading' [delay]='100' (completed)='loading=false'></loader>      
            <loader [async]='master.validate$' [active]='loading' [delay]='100' (completed)='loading=false'></loader>      
           -->
            <ui-tabs #tab rest-height>
                <ui-pane id='general' title='Genetral info' [active]='true' [valid]="(master.isValid('general') | async)">
                    <step-general step (next)="tab.goTo($event)"></step-general>
                </ui-pane>
                <ui-pane id='plugins' title='Api flow' [valid]="(master.isValid('plugins') | async)">
                    <step-plugins step (next)="tab.goTo($event)"></step-plugins>
                </ui-pane>
                <ui-pane id='preview' title='Preview' [valid]='true'>
                    <step-preview step (next)="onDone()"></step-preview>
                </ui-pane>     
            </ui-tabs>
        </div>
    </div>
    `,
  directives: [
    ROUTER_DIRECTIVES,
    ...MASTER_STEPS_COMPONENTS,
    UiTabs,
    UiPane,
    RestSize
    // LoaderComponent
  ],
  styles: [/*require('./steps/styles/master.css'),*/
    `
   
    `],
  viewProviders: [MasterController]
})
/*
 :host >>> .loader-container {
        position: absolute;      
        left: 15px;
        right: 15px;
        top: 0;
        width: auto;
        height:auto;
        bottom: 15px;      
        background: rgba(255, 255, 255, .5);
        z-index: 999;
    }
    :host >>> .my-card {
        flex:1;
    }
    
    [step] {
      flex: 1 0 100%;
	    display:flex;
      flex-direction: column;
	  }
 */
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
      .do(() => { this.loading = true; console.log('dffffdddddddddddd') })
      .flatMap(() => this.userBackEnd.createOrUpdate(this.master.config, this.id))
      .subscribe((result) => {
        console.log(result);
        this.router.navigate(['../']);
      }, (err) => {
        if (isString(err))
          this.tab.goTo(err);
      });
    /*   this.userBackEnd.createOrUpdate(this.master.config, this.id).subscribe((result) => {
         console.log(result);
         this.router.navigate(['../']);
       })*/
  }
}