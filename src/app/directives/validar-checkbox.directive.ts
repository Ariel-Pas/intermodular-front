import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

@Directive({
  selector: '[validar-checkbox]',
  providers: [
      {
        provide: NG_VALIDATORS,
        useExisting: ValidarCheckbox,
        multi: true,
      }
  ]
})

export class ValidarCheckbox implements Validator{

  @Input({ required: true, alias: 'validar-checkbox'}) config : { exact?: number, min?: number, max?: number, controls: string[] } = { controls: [] };

  validate(control: AbstractControl): ValidationErrors | null {
    const { exact, min, max, controls } = this.config;
    const checked = controls.map(name => control.get(name)).filter(x => x != null && x.value).length;
    return (exact == undefined || checked === exact) && (min == undefined || checked >= min) && (max == undefined || checked <= max) ? null : { 'validar-checkbox': { checked: checked, min, max, exact } }

  }
}
