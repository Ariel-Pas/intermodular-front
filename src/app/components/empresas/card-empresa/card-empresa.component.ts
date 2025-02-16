import { Component, inject, input } from '@angular/core';
import { IEmpresaDisplay } from '../../../types';

import { RouterLink } from '@angular/router';
import { ButtonMainComponent } from '../../button-main/button-main.component';
import { AuthApiBetaService } from '../../../services/auth/auth-api-beta.service';

@Component({
  selector: 'app-empresa-card',
  imports: [ButtonMainComponent],
  templateUrl: './card-empresa.component.html',
  styleUrl: './empresa-card.component.scss'
})
export class EmpresaCardComponent {
 public empresa = input.required<IEmpresaDisplay>({alias: 'info-empresa'});
protected authService = inject(AuthApiBetaService)

}
