import { Observable } from "rxjs";
import { ICategoria, ICategoriaBeta, IServicio } from "../../types";

export abstract class ICategoriaService
{
  abstract getCategorias() : Observable<ICategoria[]>;
  abstract getAllServicios() : Observable<IServicio[]>;
  abstract getServicios(idCategoria :  string) : Observable<IServicio[]>

  abstract getCategoriasBeta(): Observable<ICategoriaBeta[]>;
  abstract getCategoria(id:string): Observable<ICategoriaBeta>;
  abstract crearCategoria(categoria: ICategoriaBeta): Observable<ICategoriaBeta>;
  abstract actualizarCategoria(id:string, categoria: ICategoriaBeta): Observable<ICategoriaBeta>;
  abstract eliminarCategoria(id:string): Observable<boolean>;
}
