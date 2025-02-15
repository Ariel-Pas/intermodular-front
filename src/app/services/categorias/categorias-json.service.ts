import { Injectable } from '@angular/core';
import categorias from '../../data/categories.json';
import servicios from '../../data/services.json';
import { ICategoriaService } from './ICategoriasService';
import { Observable, of } from 'rxjs';
import { ICategoria, IServicio } from '../../types';

@Injectable({
  providedIn: 'root'
})


export class CategoriasJsonService extends ICategoriaService{

    getCategorias() : Observable<ICategoria[]>
    {
      return of(categorias);
    }
    getServicios(idCategoria :  string) : Observable<IServicio[]>
    {
      return of(servicios.filter(serv => serv.category == idCategoria))
    }

    getAllServicios() : Observable<IServicio[]>
    {
      return of(servicios);
    }

    //NOT USED - JSON
    override getCategoria(id: string): Observable<ICategoria> {
      throw new Error('Method not implemented.');
    }
    override crearCategoria(categoria: ICategoria): Observable<ICategoria> {
      throw new Error('Method not implemented.');
    }
    override actualizarCategoria(id: string, categoria: ICategoria): Observable<ICategoria> {
      throw new Error('Method not implemented.');
    }
    override eliminarCategoria(id: string): Observable<boolean> {
      throw new Error('Method not implemented.');
    }
}
