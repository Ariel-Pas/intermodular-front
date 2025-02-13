import { Component, computed, effect, inject, signal, viewChild } from '@angular/core';
import { IAuthenticationService } from '../../services/auth/IAuthenticationService';
import { ICredenciales } from '../../types';
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

  // private loginService = inject(IAuthenticationService);
  // private router = inject(Router);
  // public email = signal<string>('');
  // public password = signal<string>('');
  // public aviso= viewChild.required(SwalComponent)


  // //on init comprobar si hay que redireccionar
  // ngOnInit(){
  //   if(this.loginService.token()) this.router.navigate(['/profile']);

  // }

  // //obtener datos del servicio

  // public authenticate (event : Event, email: string, password: string) {
  //   event.preventDefault();
  //   let credenciales$ = this.loginService.login(email, password);
  //   let credencialesSub = credenciales$.subscribe(
  //     {
  //       next: (value) => {
  //         if(value.token != null) this.router.navigate(['/profile']);
  //       },
  //       error: ()=> {
  //         this.aviso().fire();
  //       }

  //     }
  //   )

  // }

  errorMessage = "";

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
        this.errorMessage = err.error?.error || 'Error de autenticacion';
      }
    });
  }

  


}
