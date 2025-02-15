import { inject, Inject, Injectable } from '@angular/core';
import IUsuarioService from './iusuario-service';
import { Observable } from 'rxjs';
import { IUsuario, IUsuarioDisplay } from '../../types';
import { API_URL } from '../../tokens/token-formulario';
import { HttpClient } from '@angular/common/http';
import { API_BASE } from '../../tokens/tokens';

@Injectable({
  providedIn: 'root'
})
export class UsuarioApiService extends IUsuarioService {

  constructor(@Inject(API_BASE) private apiUrl: string) {
    super();
  }

  private httpClient = inject(HttpClient);

  override getUsuarios(): Observable<IUsuarioDisplay[]> {
    return this.httpClient.get<IUsuarioDisplay[]>(`${this.apiUrl}/usuarios`);
  }
  override getUsuario(id: string): Observable<IUsuario> {
    return this.httpClient.get<IUsuario>(`${this.apiUrl}/usuarios/${id}`);
  }
  override crearUsuario(usuario: IUsuario): Observable<IUsuario> {
    return this.httpClient.post<IUsuario>(`${this.apiUrl}/usuarios`, usuario);
  }
  override actualizarUsuario(id: string, usuario: IUsuario): Observable<IUsuario> {
    return this.httpClient.put<IUsuario>(`${this.apiUrl}/usuarios/${id}`,usuario);
  }
  override eliminarUsuario(id: string): Observable<boolean> {
    return this.httpClient.delete<boolean>(`${this.apiUrl}/usuarios/${id}`);
  }

}
