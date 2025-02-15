import { HttpClient } from '@angular/common/http';
import { Inject, inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ICategoriaService } from './ICategoriasService';
import { API_BASE } from '../../tokens/tokens';
import { ICategoria, ICategoriaBeta, IServicio } from '../../types';


interface ICategoriaApi {
  id: string,
  nombre:string
}

@Injectable({
  providedIn: 'root',
})
export class CategoriasApiService extends ICategoriaService {
  constructor(@Inject(API_BASE) private baseUrl: string) {
    super();
  }

  private httpClient = inject(HttpClient);


  getCategorias(): Observable<ICategoria[]> {
    return this.httpClient.get<ICategoriaApi[]>(`${this.baseUrl}/categorias-simple`).pipe(
      map(x => x.map(elem =>{ return {id: elem.id, name: elem.nombre}}))
    );
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


  //NUEVO
  override getCategoriasBeta() : Observable<ICategoriaBeta[]>{
    return this.httpClient.get<ICategoriaBeta[]>(`${this.baseUrl}/categorias`);
  }
  override getCategoria(id: string): Observable<ICategoriaBeta> {
    return this.httpClient.get<ICategoriaBeta>(`${this.baseUrl}/categorias/${id}`);
  }
  // override crearCategoria(categoria: ICategoriaBeta): Observable<ICategoriaBeta> {
  //   return this.httpClient.post<ICategoriaBeta>(`${this.baseUrl}/categorias`, categoria);
  // }
  // override actualizarCategoria(id: string, categoria: ICategoriaBeta): Observable<ICategoriaBeta> {
  //   return this.httpClient.put<ICategoriaBeta>(`${this.baseUrl}/categorias/${id}`, categoria);
  // }

  override crearCategoria(categoria: ICategoriaBeta): Observable<ICategoriaBeta> {
    const cat = {
      nombre: categoria.nombre,
      servicios: categoria.servicios.map(s => s.id)
    };
    return this.httpClient.post<ICategoriaBeta>(`${this.baseUrl}/categorias`, cat);
  }

  override actualizarCategoria(id: string, categoria: ICategoriaBeta): Observable<ICategoriaBeta> {
    const cat = {
      nombre: categoria.nombre,
      servicios: categoria.servicios.map(s => s.id)
    };
    return this.httpClient.put<ICategoriaBeta>(`${this.baseUrl}/categorias/${id}`, cat);
  }

  override eliminarCategoria(id:string): Observable<boolean> {
    return this.httpClient.delete<boolean>(`${this.baseUrl}/categorias/${id}`);
  }
}
