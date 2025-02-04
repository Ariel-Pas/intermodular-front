import { Observable } from "rxjs";
import { IEmpresaCompleta, IEmpresaDisplay, INewEmpresa, UrlValue } from "../types";

export default abstract class IEmpresasService{
  abstract getEmpresas(): Observable<IEmpresaDisplay[]>;
  abstract getEmpresa(idEmpresa : string): Observable<IEmpresaCompleta | undefined> ;
  abstract getEmpresaByToken(token : string) : Observable<IEmpresaCompleta | undefined> ;
  abstract getByName(nombreEmpresa: string): Observable<IEmpresaDisplay | undefined>;

  abstract getUrlAbierta(): Observable<UrlValue>;
  abstract getEmpresasAlumnos(idEmpresa : string): Observable<IEmpresaDisplay[]>;
  abstract crearEmpresa(empresa : INewEmpresa): Observable<IEmpresaDisplay>;
  abstract buscarPorCif(cif:string): Observable<IEmpresaDisplay>;
  abstract asociarEmpresa(idEmpresa: string) : Observable<boolean>;
}
