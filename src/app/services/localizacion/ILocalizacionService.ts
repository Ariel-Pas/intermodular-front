import { Observable } from "rxjs";
import { IRegion, ITown } from "../../types";

export abstract class ILocalizacionService
{
  public abstract getRegiones() : Observable<IRegion[]>;
  public abstract getPoblaciones(idRegion : string) : Observable<ITown[] | undefined>;
}
