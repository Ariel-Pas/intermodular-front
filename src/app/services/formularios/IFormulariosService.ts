import { Observable } from "rxjs";
import { IFormulario, IPregunta } from "../../types";

export abstract class IFormulariosService
{
  public abstract getPreguntas(idFormulario : string) : Observable<IPregunta[]>;
}
