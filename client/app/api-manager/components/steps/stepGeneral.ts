import {Component, OnInit, Output, Input, EventEmitter, OnDestroy, Host, Optional} from '@angular/core';
import {Router, ActivatedRoute} from "@angular/router";
import {ShowError} from '../../directives/showError';
import { ToggleGroup } from '../../controls';
import { FormGroup, REACTIVE_FORM_DIRECTIVES, FORM_DIRECTIVES, FormBuilder, Validators } from '@angular/forms';
import {RegExpWrapper, print, isPresent, isFunction} from '@angular/compiler/src/facade/lang';

import { Config } from '../../../shared/models';
import {BackEnd, AppController} from '../../../shared/services';

import {MasterController} from '../../services/masterController';
import {Observable} from 'rxjs';

@Component({
    selector: 'step-general',
    template: require("./templates/stepGeneral.html"),
    directives: [REACTIVE_FORM_DIRECTIVES, ShowError, ToggleGroup],
    providers: [],
    styles: [require('./styles/stepGeneral.scss')]
})
export class StepGeneral implements OnInit {
    @Output()
    next: EventEmitter<any> = new EventEmitter();
    form: FormGroup;

    apiConfig: any = {
        methods: []
    };

    loading: boolean = false;
    submitted: boolean = false;
    options = [
        { name: 'GET', description: 'GET' },
        { name: 'POST', description: 'POST' },
        { name: 'PUT', description: 'PUT' },
        { name: 'DELETE', description: 'DELETE' }
    ]
    constructor(
        private master: MasterController,
        fb: FormBuilder,
        private backEnd: BackEnd,
        private appController: AppController) {
        this.form = fb.group({
            name: ["", Validators.required],
            entry: ["", Validators.required],
            description: [""],
            methods: [['GET']]
        });

    }
    ngAfterViewInit() {
     //   this.master.setValidity('general', this.form.valid);
        this.form
            .valueChanges
            .distinctUntilChanged()
            .subscribe(value => {                
                this.master.setValidity('general', this.form.valid);
            });

    }
    ngOnInit() {

        this.master.error$.subscribe(value => {
            console.log("ERROR", value)
            this.submitted = true;
            this.form.markAsTouched();
        });

        this.master.init$.subscribe((config) => {
            console.log(config)
            this.loading = false;
            console.log('INIT AT FIRST')
            this.apiConfig = config;
        });
    }

    onSubmit(form: FormGroup) {
        console.log(form)
        this.submitted = true;
        if (form.valid) {
            this.next.next('plugins');
        }
    }
}