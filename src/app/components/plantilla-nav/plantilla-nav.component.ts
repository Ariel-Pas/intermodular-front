import { Component, computed, inject } from '@angular/core';
import { IAuthenticationService } from '../../services/auth/IAuthenticationService';
import { RouterLink, Router } from '@angular/router';
import { roleIs } from '../../guards/is-role.guard';
import { ButtonMainComponent } from "../button-main/button-main.component";

@Component({
  selector: 'plantilla-nav',
  imports: [RouterLink, ButtonMainComponent],
  templateUrl: './plantilla-nav.component.html',
  styleUrl: './plantilla-nav.component.scss',
})
export class PlantillaNavComponent {
  private loginService = inject(IAuthenticationService);
  public rol = computed(() => this.loginService.rol());
  public nombreUsuario = computed(() => this.loginService.user());
  private router = inject(Router);


  public logout() {
    this.loginService.logout();
    this.router.navigate(['/login']);
  }


}
