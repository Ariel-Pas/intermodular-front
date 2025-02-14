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
  rolesDisponibles: role[] = [];

  constructor(private authService: AuthApiBetaService){
    //Filtrar el rol Admin al mostrar los roles disponibles
    this.rolesDisponibles = this.authService.sesionSubject.value?.roles.filter(role => role !== 'Admin') || [];
  }

  elegirRol(role: role) : void {
    this.authService.elegirRol(role);
  }
}
