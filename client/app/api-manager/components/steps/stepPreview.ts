import {Component, OnInit, Output, Input, EventEmitter, OnDestroy, Host, Optional} from '@angular/core';
import {Router, ActivatedRoute} from "@angular/router";
//import {FORM_DIRECTIVES, ControlGroup, Validators, FormBuilder, Control} from '@angular/common';
import {ShowError} from '../../directives/showError';
import { FormGroup, REACTIVE_FORM_DIRECTIVES, FormBuilder, Validators } from '@angular/forms';
import {RegExpWrapper, print, isPresent, isFunction} from '@angular/compiler/src/facade/lang';

import { Config } from '../../../shared/models';
import {BackEnd, AppController} from '../../../shared/services';

import {MasterController} from '../../services/masterController';
import {Observable} from 'rxjs';

@Component({
    selector: 'step-preview',
    template: require("./templates/stepPreview.html"),
    directives: [REACTIVE_FORM_DIRECTIVES, ShowError],
    styles: [require('./styles/stepPreview.scss'),
     `
     :host {
        flex:1;
        display: flex;
        flex-direction: column;
    }
    `]
})
export class StepPreview implements OnInit {
    @Output()
    next: EventEmitter<any> = new EventEmitter();
    loading: boolean = false;
    submitted: boolean = false;
    constructor(
        private master: MasterController,
        fb: FormBuilder,
        private backEnd: BackEnd,
        private appController: AppController) {
    }

    ngOnInit() {
    }

    onSubmit() {
        this.next.next("Done")
    }
}