import { Component, input } from '@angular/core';
import { IEmpresaDisplay } from '../../types';

@Component({
  selector: 'app-empresa-card',
  imports: [],
  templateUrl: './card-empresa.component.html',
  styleUrl: './empresa-card.component.scss'
})
export class EmpresaCardComponent {
 public empresa = input.required<IEmpresaDisplay>({alias: 'info-empresa'});
}
