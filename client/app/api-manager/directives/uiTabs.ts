import {Component, Input, QueryList, Query, AfterContentInit, HostBinding,
    ViewContainerRef, TemplateRef, ContentChildren, ViewRef} from '@angular/core';

@Component({
    selector: 'ui-pane',
    template: `
        <div class='pane-content'>           
            <ng-content></ng-content>                    
        </div>
    `,
    styles: [
        `       
        .pane-content{
            flex: 1 0 100%;
            display: flex;
            flex-direction: column;
        }
    `
    ]
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
        this.visited = true;
    }
    get active(): boolean {
        return this._active;
    }
}
@Component({
    selector: 'ui-tabs',
    template: `
     <div class="row">
         <div class="col-md-12 col-sm-12 col-lg-12" class='flex-header'>
              <ol class="my-card my-steps custom-icons">
                  <li *ngFor="let pane of panes" class='{{pane.id}}' 
                      (click)="goTo(pane.id)"
                      role="presentation" 
                      [ngClass] = '{invalid: !pane.valid && pane.visited, current: pane.active, visited: pane.visited}'>
                      <span>{{pane.title}}</span>
                  </li>
             </ol>
         </div>
         <div class="col-md-12 col-sm-12 col-lg-12" class='flex-content'> 
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
    ]
})
export class UiTabs {
    @ContentChildren(UiPane) panes: QueryList<UiPane>;
    goTo(id) {
        if (this.panes) {
            this.panes.toArray().forEach((p: UiPane) => p.active = (p.id == id));
        }
    }
    ngAfterContentInit() {
        console.log("TABS CONTENT INIT")
    }
    ngAfterViewInit() {
        console.log("TABS VIEW INIT")
    }
}