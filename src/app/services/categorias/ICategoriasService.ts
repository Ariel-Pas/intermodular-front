import { Observable } from "rxjs";
import { ICategoria, IServicio } from "../../types";

export abstract class ICategoriaService
{
  abstract getCategorias() : Observable<ICategoria[]>;
  abstract getAllServicios() : Observable<IServicio[]>;
  abstract getServicios(idCategoria :  string) : Observable<IServicio[]>

  abstract getCategoria(id:string): Observable<ICategoria>;
  abstract crearCategoria(categoria: ICategoria): Observable<ICategoria>;
  abstract actualizarCategoria(id:string, categoria: ICategoria): Observable<ICategoria>;
  abstract eliminarCategoria(id:string): Observable<boolean>;
}
