import { HttpClient } from '@angular/common/http';
import { Inject, inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ICategoriaService } from './ICategoriasService';
import { API_BASE } from '../../tokens/tokens';
import { ICategoria, IServicio } from '../../types';


interface ICategoriaApi {
  id: string,
  nombre:string
}

interface IServicioApi{
  id: string,
  nombre: string,
  categorias: string[]
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
    return this.httpClient.get<IServicioApi[]>(`${this.baseUrl}/categoria/servicios/${idCategoria}`).pipe(
      map(x => x.map(elem => {
        return {
          id: elem.id,
          name: elem.nombre,
          categories: elem.categorias,
          category: ''
        }
      }))
    );
  }


  getAllServicios() : Observable<IServicio[]>
  {
    return this.httpClient.get<IServicioApi[]>(`${this.baseUrl}/servicios-simple`).pipe(
      map(x => x.map(elem => {
        return {
          id: elem.id,
          name: elem.nombre,
          categories: elem.categorias,
          category: ''
        }
      }))
    );
  }

  override getCategoria(id: string): Observable<ICategoria> {
    return this.httpClient.get<ICategoria>(`${this.baseUrl}/categorias/${id}`);
  }
  override crearCategoria(categoria: ICategoria): Observable<ICategoria> {
    return this.httpClient.post<ICategoria>(`${this.baseUrl}/categorias`, categoria);
  }
  override actualizarCategoria(id: string, categoria: ICategoria): Observable<ICategoria> {
    return this.httpClient.put<ICategoria>(`${this.baseUrl}/categorias/${id}`, categoria);
  }
  override eliminarCategoria(id:string): Observable<boolean> {
    return this.httpClient.delete<boolean>(`${this.baseUrl}/categoria/${id}`);
  }
}
