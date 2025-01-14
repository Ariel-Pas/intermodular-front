import { Observable } from "rxjs";
import { ICategoria, IServicio } from "../../types";

export abstract class ICategoriaService
{
  abstract getCategorias() : Observable<ICategoria[]>;
  abstract getServicios(idCategoria :  string) : Observable<IServicio[]>
}
