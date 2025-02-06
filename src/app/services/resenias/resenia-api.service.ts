import { inject, Inject, Injectable } from '@angular/core';
import { API_URL } from '../../tokens/token-formulario';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IReseniaService } from './IReseniaService';
import { IResenia } from '../../types';

@Injectable({
  providedIn: 'root'
})
export class ReseniaApiService extends IReseniaService {

  constructor( @Inject(API_URL) private api_url:string) {
    super();
   }

  private http = inject(HttpClient);

  crearResenia(resenia: IResenia): Observable<IResenia> {
    return this.http.post<IResenia>(`${this.api_url}api/resenias`, resenia, {
      headers: { 'Content-Type': 'application/json' },
    });
  }

}
