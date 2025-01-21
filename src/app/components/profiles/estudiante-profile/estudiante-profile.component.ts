import { Component, inject } from '@angular/core';
import { IAuthenticationService } from '../../../services/auth/IAuthenticationService';

@Component({
  selector: 'app-estudiante-profile',
  imports: [],
  templateUrl: './estudiante-profile.component.html',
  styleUrl: './estudiante-profile.component.scss'
})
export class EstudianteProfileComponent {

  private loginService = inject(IAuthenticationService);
  public nombreUsuario = this.loginService.user();
}
