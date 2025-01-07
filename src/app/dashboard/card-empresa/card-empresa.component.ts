import { Component, input } from '@angular/core';
import { IEmpresaDisplay } from '../../types';
import { ButtonMainComponent } from '../../components/button-main/button-main.component';

@Component({
  selector: 'app-empresa-card',
  imports: [ButtonMainComponent],
  templateUrl: './card-empresa.component.html',
  styleUrl: './empresa-card.component.scss'
})
export class EmpresaCardComponent {
 public empresa = input.required<IEmpresaDisplay>({alias: 'info-empresa'});

 //calcular vacantes totales
 /* protected numeroVacantes = this.empresa().vacantes.reduce((acc, cur) => acc + cur.cantidad, 0); */

 public f = (e: any) :void => {
  console.log('hola');
  alert('hola');

 }
}
