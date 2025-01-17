import { Injectable } from '@angular/core';
import { IAuthenticationService } from './IAuthenticationService';
import { Observable, of } from 'rxjs';
import { ICredenciales } from '../../types';

@Injectable({
  providedIn: 'root',
})
export class AuthFakeService extends IAuthenticationService {


  public login(user: string, password: string): Observable<ICredenciales>{
    const rnd = Math.random();
    let credenciales : ICredenciales;


    if(rnd <= 0.3){
      //login correcto
      credenciales = {
        usuario : user,
        rol : 'estudiante',
        token : 'fakeSuccesfultoken'
      }
    }
    else{
      credenciales = {
        usuario : null,
        rol : null,
        token : null
      }
    }

    this.user.set(user);
    this.rol.set('estudiante');
    this.token.set('fakeSuccesfultoken');

    return of(credenciales);
  }

  public logout(): Observable<boolean> {
    this.user.set(null);
    this.rol.set(null);
    this.token.set(null);
    return of(true);
  }
}
