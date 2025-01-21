import { Component, inject } from '@angular/core';
import { IAuthenticationService } from '../../../services/auth/IAuthenticationService';

@Component({
  selector: 'app-profesor-profile',
  imports: [],
  templateUrl: './profesor-profile.component.html',
  styleUrl: './profesor-profile.component.scss'
})
export class ProfesorProfileComponent {
  private loginService = inject(IAuthenticationService);
    public nombreUsuario = this.loginService.user();
}
