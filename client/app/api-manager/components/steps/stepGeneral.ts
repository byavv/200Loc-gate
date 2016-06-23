import {Component, OnInit, Output, Input, EventEmitter, OnDestroy, Host, Optional} from '@angular/core';
import {Router, ActivatedRoute} from "@angular/router";
import {FORM_DIRECTIVES, ControlGroup, Validators, FormBuilder} from '@angular/common';
import {ShowError} from '../../directives/showError';

import {RegExpWrapper, print, isPresent, isFunction} from '@angular/compiler/src/facade/lang';

import { Config } from '../../../shared/models';
import {BackEnd, AppController} from '../../../shared/services';

import {MasterController} from '../../services/masterController';
import {Observable} from 'rxjs';

@Component({
    selector: 'config-general',
    template: require("./templates/stepGeneral.html"),
    directives: [FORM_DIRECTIVES, ShowError],
    styles: [/*require('./styles/stepInfo.css')*/]
})
export class StepGeneral implements OnInit {
    @Output()
    next: EventEmitter<any> = new EventEmitter();
    form: ControlGroup;

    config: any = {
        name: "",
        description: '',
        entry: ''
    };

    loading: boolean = false;
    submitted: boolean = false;
    constructor(
        private master: MasterController,
        fb: FormBuilder,
        private backEnd: BackEnd,
        private appController: AppController) {
        this.form = fb.group({
            "name": ["", Validators.required],
            "description": ["", Validators.required],
            "entry": ["", Validators.required]
        });
    }

    ngOnInit() {
        this.master.validation['info'] = true;
        this.master.error$.subscribe(value => {
            console.log("ERROR", value)
            this.submitted = true;
           // this.form.markAsTouched();
        });

      /*  this.form
            .find("name")
            .valueChanges
            .filter(value => value)
            .do(() => { this.loading = true })
            .subscribe((models: Array<any>) => {
                this.loading = false;
            });*/

      /*  this.appController
            .init$
            .do(() => { this.loading = true })
            .subscribe((defaults) => {
                this.master.init$.subscribe((config) => {
                    console.log(config)
                    this.loading = false;
                  //  this.config = config;
                })
            });

        this.form
            .valueChanges
            .distinctUntilChanged()
            .subscribe(value => {
                this.master.info = value;
                this.master.validation['info'] = this.form.valid;
            });*/
    }

    onSubmit(form: ControlGroup) {
        this.submitted = true;
        if (form.valid) {
            this.next.next('img');
        }
    }
}