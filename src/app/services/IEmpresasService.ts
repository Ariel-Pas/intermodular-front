import { Observable } from "rxjs";
import { IEmpresaDisplay } from "../types";

export default abstract class IEmpresasService{
  abstract getEmpresas(): Observable<IEmpresaDisplay[]>;
  abstract getEmpresa(idEmpresa : string): Observable<IEmpresaDisplay | undefined> ;
}
