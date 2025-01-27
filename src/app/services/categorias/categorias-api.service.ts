import { HttpClient } from '@angular/common/http';
import { Inject, inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ICategoriaService } from './ICategoriasService';
import { API_BASE } from '../../tokens/tokens';
import { ICategoria, IServicio } from '../../types';

@Injectable({
  providedIn: 'root',
})
export class CategoriasApiService extends ICategoriaService {
  constructor(@Inject(API_BASE) private baseUrl: string) {
    super();
  }

  private httpClient = inject(HttpClient);

  getCategorias(): Observable<ICategoria[]> {
    return this.httpClient.get<ICategoria[]>(`${this.baseUrl}/categories`);
  }

  getServicios(idCategoria: string): Observable<IServicio[]> {
    return this.httpClient.get<IServicio[]>(`${this.baseUrl}/services`, {
      params: { category: idCategoria },
    });
  }

  getAllServicios() : Observable<IServicio[]>
  {
    return this.httpClient.get<IServicio[]>(`${this.baseUrl}/services`);
  }
}
