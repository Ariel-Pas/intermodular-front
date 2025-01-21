import { Component, inject } from '@angular/core';
import { IAuthenticationService } from '../../../services/auth/IAuthenticationService';

@Component({
  selector: 'app-admin-profile',
  imports: [],
  templateUrl: './admin-profile.component.html',
  styleUrl: './admin-profile.component.scss'
})
export class AdminProfileComponent {
  private loginService = inject(IAuthenticationService);
    public nombreUsuario = this.loginService.user();
}
