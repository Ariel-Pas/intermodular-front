import { Directive, Input } from '@angular/core';
import {
  AbstractControl,
  NG_VALIDATORS,
  ValidationErrors,
  Validator,
} from '@angular/forms';

@Directive({
  selector: '[validarHorarioEmpresa]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: ValidarHorarioEmpresaDirective,
      multi: true,
    },
  ],
})
export class ValidarHorarioEmpresaDirective implements Validator {
  @Input({ required: true, alias: 'validarHorarioEmpresa' }) campos: string[] = [];

  validate(control: AbstractControl): ValidationErrors | null {
    const inputHorarioApertura = control.get(this.campos[0]);
    const inputHorarioCierre = control.get(this.campos[1]);

    if(inputHorarioApertura){
      console.log('hola');

    }
    if (inputHorarioApertura && inputHorarioCierre) {
      const [horaApertura, minutosApertura] = inputHorarioApertura.value.split(':');
      const [horaCierre, minutosCierre] = inputHorarioCierre.value.split(':');


      if((!isNaN(Number(horaCierre)) && !isNaN(Number(horaApertura))) && Number(horaCierre) <= Number(horaApertura) ) return {'validarHorarioEmpresa' : true};
      return null;


    }else
      return {'validarHorarioEmpresa' : true}
  }
}
