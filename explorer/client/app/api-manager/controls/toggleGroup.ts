import { Component, Self, EventEmitter, Output, ViewChild, Input, Optional } from '@angular/core';
import { NgControl, NgModel, ControlValueAccessor } from '@angular/forms';

@Component({
    selector: 'toggleGroup[ngModel]',
    template: require('./templates/toggleGroup.html'),
    styles: [require("./styles/toggleGroup.scss")]
})

export class ToggleGroup implements ControlValueAccessor {
    private _selectedOptions = [];   

    private _options: Array<any> = [];
    @Input()
    set options(op) {
        this._options = op;       
    }
    get options(): any {
        return this._options;
    }

    set selectedOptions(arrayOfSelected) {
        this._selectedOptions = arrayOfSelected;
        this.options = this.options.map((option) => {
            return arrayOfSelected.indexOf(option.name) > -1
                ? Object.assign(option, { active: true })
                : Object.assign(option, { active: false })
        })
    }
    get selectedOptions(): any {
        return this._selectedOptions;
    }

    constructor( @Optional() @Self() private ngControl: NgControl) {
        if (ngControl) ngControl.valueAccessor = this;
    }

    onCheck(index) {
        this.options[index].active = !this.options[index].active;
        let activeOptions = this.options.filter((option) => option.active);
        let newValue = activeOptions.map((option) => option.name);
        if (this.ngControl) this.ngControl.viewToModelUpdate(newValue);
        this.onChange(newValue)
    }

    /**
     * ControlValueAccessor
     */
    onChange = (_: any) => {
    };
    onTouched = () => {
    };
    writeValue(value) {
        this.selectedOptions = value;
    }
    registerOnChange(fn): void {
        this.onChange = fn;
    }
    registerOnTouched(fn): void {
        this.onTouched = fn;
    }
}