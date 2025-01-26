import { Observable } from "rxjs";
import { ICategoria, IServicio } from "../../types";

export abstract class ICategoriaService
{
  abstract getCategorias() : Observable<ICategoria[]>;
  abstract getAllServicios() : Observable<IServicio[]>;
  abstract getServicios(idCategoria :  string) : Observable<IServicio[]>
}
