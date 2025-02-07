import { Observable } from "rxjs";
import { IResenia } from "../../types";

export abstract class IReseniaService
{
  public abstract crearResenia(resenia: IResenia) : Observable<IResenia>;
}
