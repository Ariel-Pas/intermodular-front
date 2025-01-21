import { Component, inject } from '@angular/core';
import { IAuthenticationService } from '../../../services/auth/IAuthenticationService';

@Component({
  selector: 'app-empresa-profile',
  imports: [],
  templateUrl: './empresa-profile.component.html',
  styleUrl: './empresa-profile.component.scss'
})
export class EmpresaProfileComponent {
  private loginService = inject(IAuthenticationService);
    public nombreUsuario = this.loginService.user();
}
