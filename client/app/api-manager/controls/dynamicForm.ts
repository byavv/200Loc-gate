/**
 * Create form from object.
 *  eg.: 
 *  {
 *      field1: {
 *          value: "defaultValue1"
 *      },
 *      field2: {
 *          value: "defaultValue2"
 *      }
 *  }
 */

import { Component, Input, Output, OnInit, EventEmitter }  from '@angular/core';
import { FormGroup, Validators, FormBuilder, REACTIVE_FORM_DIRECTIVES } from '@angular/forms';
import { DynamicFormOption } from "./optionInput";
import { Plugin } from '../../shared/models';
@Component({
    selector: 'dynamic-fform',
    template: require('./templates/dynamicForm.html'),
    directives: [REACTIVE_FORM_DIRECTIVES, DynamicFormOption],
    providers: []
})
export class DynamicForm {
    fields: Array<any> = []
    private _plugin;
    @Input()
    set plugin(plugin) {

        let group = {};
        let _op = []
        if (plugin) {
            this.fields.splice(0, this.fields.length)
            Object.keys(plugin.options).forEach((key: any) => {
                group[key] = plugin.options[key].required
                    ? [plugin.options[key].default || '', Validators.required]
                    : [plugin.options[key].default || ''];
                this.fields.push({ key: key, value: plugin.config[key] || plugin.options[key].default })
            });

            this.form = this._builder.group(group);
            this.form.valueChanges.subscribe(value => {
                plugin.config = value;
            })
        }
        this._plugin = plugin;
    }
    get plugin(): Plugin {
        return this._plugin;
    }


    form: FormGroup = this._builder.group({});

    constructor(private _builder: FormBuilder) { }


}
