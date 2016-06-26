import { Component, Input, OnInit }  from '@angular/core';
import { FormGroup, Validators, FormBuilder, REACTIVE_FORM_DIRECTIVES } from '@angular/forms';
import { DynamicFormOption } from "./optionInput"
@Component({
    selector: 'dynamic-fform',
    template: require('./templates/dynamicForm.html'),
    directives: [REACTIVE_FORM_DIRECTIVES, DynamicFormOption],
    providers: []
})
export class DynamicForm implements OnInit {
    private _options = [];
    @Input()
    set options(value) {
        let group = {};
        value.forEach((option: any) => {
            group[option.key] = option.required
                ? [option.value || '', Validators.required]
                : [option.value || ''];
        })
        console.log("!!!!!!!!!!!!!!!!", group);
        this.form = this._builder.group(group);
        this.form.valueChanges.subscribe(value=>{
           
        })
        this._options = value;
    };
    get options(){
        return this._options;
    }
    form: FormGroup;
    payLoad = '';
    constructor(private _builder: FormBuilder) { }
    ngOnInit() {

    }
    onSubmit() {
        this.payLoad = JSON.stringify(this.form.value);
    }
}
/*
    {
        key:"",
        required: "true",
        default: ""
    }
*/