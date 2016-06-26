import { Component, Input } from '@angular/core';
import { FormGroup, Validators, FormBuilder, REACTIVE_FORM_DIRECTIVES } from '@angular/forms';

@Component({
  selector: 'option-input',
  template: require('./templates/optionInput.html'),
  directives: [REACTIVE_FORM_DIRECTIVES]
})
export class DynamicFormOption {
  @Input() option: any;
  @Input() form: FormGroup; 
  get isValid() { return this.form.controls[this.option.key].valid; }
}