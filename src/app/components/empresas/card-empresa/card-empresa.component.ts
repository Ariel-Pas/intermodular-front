import { Component, input } from '@angular/core';
import { IEmpresaDisplay } from '../../../types';

import { RouterLink } from '@angular/router';
import { ButtonMainComponent } from '../../button-main/button-main.component';

@Component({
  selector: 'app-empresa-card',
  imports: [ButtonMainComponent, RouterLink],
  templateUrl: './card-empresa.component.html',
  styleUrl: './empresa-card.component.scss'
})
export class EmpresaCardComponent {
 public empresa = input.required<IEmpresaDisplay>({alias: 'info-empresa'});


}
