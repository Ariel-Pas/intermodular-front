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
}
