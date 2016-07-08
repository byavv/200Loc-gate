import { Component, Input } from '@angular/core';
import { FormGroup, Validators, FormBuilder, REACTIVE_FORM_DIRECTIVES } from '@angular/forms';
import { FirstUpPipe } from '../pipes';
import { ShowError } from '../directives';
@Component({
  selector: 'option-input',
  template: require('./templates/optionInput.html'),
  directives: [REACTIVE_FORM_DIRECTIVES, ShowError],
  pipes: [FirstUpPipe]
})
export class DynamicFormOption {
  @Input() field: any;
  @Input() form: FormGroup;

  get isValid() {
    return this.form.controls[this.field.key].valid;
  }
}