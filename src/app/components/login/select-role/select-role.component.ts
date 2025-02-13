import { Component } from '@angular/core';
import { role } from '../../../types';
import { AuthApiBetaService } from '../../../services/auth/auth-api-beta.service';

@Component({
  selector: 'app-select-role',
  imports: [],
  templateUrl: './select-role.component.html',
  styleUrl: './select-role.component.scss'
})
export class SelectRoleComponent {
  availableRoles: role[] = [];

  constructor(private authService: AuthApiBetaService){
    this.availableRoles = this.authService.sessionSubject.value?.roles || [];
  }

  selectRole(role: role) : void {
    this.authService.selectRole(role);
  }
}
