import { Inject, inject, Injectable } from '@angular/core';
import { IAuthenticationService } from './IAuthenticationService';
import { Observable, of, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ICredenciales } from '../../types';
import { API_BASE } from '../../tokens/tokens';


@Injectable({
  providedIn: 'root'
})
export class AuthApiService extends IAuthenticationService{
  constructor(@Inject(API_BASE) private baseUrl : string){
    super();
  }

  private httpClient = inject(HttpClient);

  public login(user : string, password : string) : Observable<ICredenciales>{
    //petición post con los datos
    return this.httpClient.post<ICredenciales>(`${this.baseUrl}/auth/login`, {user: user , password: password}).pipe(
      tap(response => {
        this.user.set(response.usuario);
        this.rol.set(response.rol);
        this.token.set(response.token);
      })
    );
  }

  public logout() : Observable<boolean>{
    this.user.set(null);
    this.rol.set(null);
    this.token.set(null);

    return of(true);
  }

}
