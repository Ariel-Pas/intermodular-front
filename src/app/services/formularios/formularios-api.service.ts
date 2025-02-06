import { inject, Inject, Injectable } from '@angular/core';
import { API_URL } from '../../tokens/token-formulario';
import { IFormulariosService } from './IFormulariosService';
import { Observable } from 'rxjs';
import { IFormulario, IPregunta } from '../../types';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FormulariosApiService extends IFormulariosService {

  constructor( @Inject(API_URL) private api_url:string) {
    super();
   }

  private http = inject(HttpClient);

  getPreguntas(idFormulario: string): Observable<IPregunta[]> {
   return this.http.get<IPregunta[]>(`${this.api_url}api/mostrarFormulario/${idFormulario}`);
  }

}
