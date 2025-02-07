import { inject, Inject, Injectable } from '@angular/core';
import { API_URL } from '../../tokens/token-formulario';
import { Observable } from 'rxjs';
import { IFormulario, IPregunta, IToken } from '../../types';
import { HttpClient } from '@angular/common/http';
import { ITokenService } from './ITokenService';

@Injectable({
  providedIn: 'root'
})
export class TokenApiService extends ITokenService {

  constructor( @Inject(API_URL) private api_url:string) {
    super();
  }

  private http = inject(HttpClient);

  generarToken(empresaId: number, formularioId: number, centroId: number): Observable<IToken> {
    return this.http.post<IToken>(`${this.api_url}api/generar-token`, {
      empresa_id: empresaId,
      formulario_id: formularioId,
      centro_id: centroId
    });
  }

  buscarFormularioPorToken(token: string): Observable<IToken> {
    return this.http.get<IToken>(`${this.api_url}api/get-Token/${token}`);
  }

}
