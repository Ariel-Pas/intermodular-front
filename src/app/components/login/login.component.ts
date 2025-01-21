import { Component, computed, effect, inject, signal } from '@angular/core';
import { IAuthenticationService } from '../../services/auth/IAuthenticationService';
import { ICredenciales } from '../../types';
import { Observable } from 'rxjs';
import { rxResource } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  private loginService = inject(IAuthenticationService);
  private router = inject(Router);
  public email = signal<string>('');
  public password = signal<string>('');
  public error = signal<boolean>(false);


  //on init comprobar si hay que redireccionar
  ngOnInit(){
    if(this.loginService.token()) this.router.navigate(['/profile']);

  }

  //obtener datos del servicio

  public authenticate (event : Event, email: string, password: string) {
    event.preventDefault();
    let credenciales$ = this.loginService.login(email, password);
    let credencialesSub = credenciales$.subscribe(
      {
        next: (value) => {
          if(value.token != null) this.router.navigate(['/profile']);
          //else this.error.set(true);

        },
        error: ()=> {
          this.error.set(true)
        }

      }
    )

  }


}
