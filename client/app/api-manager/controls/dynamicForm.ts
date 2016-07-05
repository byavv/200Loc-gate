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
            this.fields.splice(0, this.fields.length)
            Object.keys(plugin.options).forEach((key: any) => {
                group[key] = plugin.options[key].required
                    ? [plugin.options[key].default || '', Validators.required]
                    : [plugin.options[key].default || ''];
                this.fields.push({
                    key: key,
                    value: plugin.options[key].value || plugin.options[key].default,
                    label: plugin.options[key].label,
                    helpString: plugin.options[key].help,
                    type: plugin.options[key].type ? plugin.options[key].type : 'string',
                    options: plugin.options[key].options ? plugin.options[key].options : [],
                });
            });

            this.form = plugin.form = this._builder.group(group);
            this.form.valueChanges
                .subscribe(value => {
                    plugin.config = value;
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
