import { Component, computed, effect, inject, signal, viewChild } from '@angular/core';
import { IAuthenticationService } from '../../services/auth/IAuthenticationService';
// import { ICredenciales } from '../../types';
import { Observable } from 'rxjs';
import { rxResource } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { SwalComponent, SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { AuthApiBetaService } from '../../services/auth/auth-api-beta.service';

@Component({
  selector: 'app-login',
  imports: [SweetAlert2Module],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  mensajeError = "";

  constructor(private authService: AuthApiBetaService, private router: Router) {}

  authenticate(event: Event, email: string, password: string) : void{
    //SE PUEDE QUITAR EL PREVENT
    event.preventDefault();

    this.authService.login(email,password).subscribe({
      next: (session) => {
        if(!session.activatedRole && session.roles.length > 1) {
          this.router.navigate(['/select-role']);
        }
      },
      error: (err) => {
        this.mensajeError = err.error?.error || 'Error de autenticacion';
      }
    });
  }




}
