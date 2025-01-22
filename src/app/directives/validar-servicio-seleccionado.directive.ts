import { Directive } from '@angular/core';
import { NG_VALIDATORS } from '@angular/forms';

@Directive({
  selector: '[validarServicioSeleccionado]',
  providers: [
      {
        provide: NG_VALIDATORS,
        useExisting: ValidarServicioSeleccionadoDirective,
        multi: true,
      }
  ]
})

export class ValidarServicioSeleccionadoDirective {

  constructor() { }

}
