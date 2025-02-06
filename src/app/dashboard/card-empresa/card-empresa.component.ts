import { Component, input } from '@angular/core';
import { IEmpresaDisplay } from '../../types';
import { ButtonMainComponent } from '../../components/button-main/button-main.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-empresa-card',
  imports: [ButtonMainComponent],
  templateUrl: './card-empresa.component.html',
  styleUrl: './empresa-card.component.scss'
})
export class EmpresaCardComponent {
 public empresa = input.required<IEmpresaDisplay>({alias: 'info-empresa'});


}
