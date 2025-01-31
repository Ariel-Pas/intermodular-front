import { Injectable } from '@angular/core';
import { IAuthenticationService } from './IAuthenticationService';
import { Observable, of, throwError } from 'rxjs';
import { ICredenciales } from '../../types';

@Injectable({
  providedIn: 'root',
})
export class AuthFakeService extends IAuthenticationService {


  public login(user: string, password: string): Observable<ICredenciales>{
    const rnd = Math.random();
    let credenciales : ICredenciales;


    if(rnd <= 0.8){
      //login correcto
      credenciales = {
        usuario : user,
        rol : 'admin',
        token : 'fakeSuccesfultoken'
      }

      this.token.set(credenciales.token)
      this.user.set(credenciales.usuario)
      this.rol.set(credenciales.rol);
    }
    else{
      return throwError(()=>({error : 'Login no válido'}));
    }

    return of(credenciales);
  }

  public logout(): Observable<boolean> {
    this.user.set(null);
    this.rol.set(null);
    this.token.set(null);

    return of(true);
  }
}
