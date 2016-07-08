import {Component, Input, QueryList, Query, AfterContentInit, HostBinding,
    ViewContainerRef, TemplateRef, ContentChildren, ViewRef} from '@angular/core';
import { RestSize } from './restSize';
@Component({
    selector: 'ui-pane',
    template: `
        <div class='pane-content' >           
            <ng-content></ng-content>                    
        </div>
    `,
    styles: [
        `       
        .pane-content{  
            flex: 1;        
            display: flex;
            flex-direction: column;
            margin-bottom: 15px;
        }
        :host {
            display: flex;
            flex: 1;
            flex-direction: column;
        }
    `
    ],
})
export class UiPane {
    @HostBinding('class.hidden') get current() { return !this.active; }
    @Input()
    id: string;
    @Input()
    valid: boolean = true;
    visited: boolean = false;
    @Input() title: string;
    private _active: boolean = false;
    constructor() { }
    @Input() set active(active: boolean) {
        if (active == this._active) return;
        this._active = active;
    }
    get active(): boolean {
        return this._active;
    }
}
@Component({
    selector: 'ui-tabs',
    template: ` 
       <div class="row">
          <div class="col-sm-12 col-md-2 padding-shrink-right">           
             <ul class="my-steps">
                 <li *ngFor="let pane of panes" class='{{ pane.id }}' 
                     (click)="goTo(pane.id)"
                     role="presentation" 
                     [ngClass] = "{ invalid: !pane.valid, active: pane.active, visited: pane.visited }">
                     <i class='fa'></i>
                     <span>{{ pane.title }}</span> 
                 </li>
             </ul>            
          </div>
          <div class="col-sm-12 col-md-10 padding-shrink-left flexy" rest-height>                
               <ng-content></ng-content>                        
          </div>
     </div>
    `,
    styles: [
        require('./styles/tabs.scss'),
        `
        :host >>> .hidden {
            display: none;
        }
        `
    ],
    directives: [RestSize]

})
export class UiTabs {
    @ContentChildren(UiPane) panes: QueryList<UiPane>;
    currentPane: UiPane;
    @Input()
    default: string;
    ngAfterContentInit() {
        if (this.panes) {
            this.default
                ? this.currentPane = this.panes.toArray().find((p: UiPane) => p.id == this.default)
                : this.currentPane = this.panes.first;
            this.currentPane.active = true;
        }
    }
    goTo(id) {
        if (this.panes) {
            if (this.currentPane) {
                this.currentPane.visited = true;
            }
            this.panes.toArray().forEach((p: UiPane) => p.active = false);
            this.currentPane = this.panes.toArray().find((p: UiPane) => p.id == id);
            this.currentPane.active = true;
        }
    }
}