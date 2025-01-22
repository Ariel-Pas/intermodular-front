import { HttpClient } from '@angular/common/http';
import { Directive, Input } from '@angular/core';
import { AbstractControl, AsyncValidator, NG_ASYNC_VALIDATORS, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';
import { catchError, map, Observable, of } from 'rxjs';
import IEmpresasService from '../services/IEmpresasService';

@Directive({
  selector: '[nombre-disponible]',
  providers: [
        {
          provide: NG_ASYNC_VALIDATORS,
          useExisting: NombreDisponibleDirective,
          multi: true,
        }
    ]
})

export class NombreDisponibleDirective implements AsyncValidator{
  @Input({ required: true, alias: 'nombre-disponible' }) campo: string = '';
  constructor(private empresas: IEmpresasService){}

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    if(control.value === '') return of(null);

    return this.empresas.getByName(control.value).pipe(
      map(x =>({'nombre-disponible' : true})),
      catchError(()=> of(null))
    )
  }

}
