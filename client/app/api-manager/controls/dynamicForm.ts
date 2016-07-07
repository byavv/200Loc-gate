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
    selector: 'dynamic-form',
    template: require('./templates/dynamicForm.html'),
    directives: [REACTIVE_FORM_DIRECTIVES, DynamicFormOption]
})
export class DynamicForm {
    fields: Array<any> = []
    private _plugin;

    @Output()
    changed: EventEmitter<any> = new EventEmitter();
    @Input()
    set plugin(plugin: Plugin) {        
        let group = {};
        if (plugin) {
            this.fields.splice(0, this.fields.length);
            let settings = plugin.settings || {};
            Object.keys(settings).forEach((key: any) => {
                group[key] = settings[key].required
                    ? [settings[key].default || '', Validators.required]
                    : [settings[key].default || ''];
                this.fields.push({
                    key: key,
                    value: /*settings[key].value*/ plugin.value[key] || settings[key].default,
                    label: settings[key].label,
                    helpString: settings[key].help,
                    type: settings[key].type ? settings[key].type : 'string',
                    options: settings[key].options ? settings[key].options : [], // if property is array
                });
            });

            this.form = plugin.form = this._builder.group(group);
            this.form.valueChanges
                .subscribe(value => {
                    plugin.settings = value;
                    this.changed.emit(null);
                });
        }
        this._plugin = plugin;
    }
    get plugin(): Plugin {
        return this._plugin;
    }
    form: FormGroup = this._builder.group({});
    constructor(private _builder: FormBuilder) { }
}
