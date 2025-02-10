import { Observable } from "rxjs";
import { IEmpresaCompleta, IEmpresaDisplay, INewEmpresa, UrlValue } from "../types";
import { resource } from "@angular/core";

export default abstract class IEmpresasService{
  //abstract empresasResource : resource<Response, IEmpresaDisplay[]>;
  abstract getEmpresas(): Observable<IEmpresaDisplay[]>;
  abstract getEmpresa(idEmpresa : string): Observable<IEmpresaCompleta | undefined> ;
  abstract getEmpresaByToken(token : string) : Observable<IEmpresaCompleta | undefined> ;
  abstract getByName(nombreEmpresa: string): Observable<IEmpresaDisplay | undefined>;

  abstract getUrlAbierta(): Observable<UrlValue>;
  abstract getEmpresasAlumnos(idEmpresa : string): Observable<IEmpresaDisplay[]>;
  abstract crearEmpresa(empresa : INewEmpresa): Observable<IEmpresaDisplay>;
  abstract actualizarEmpresaAuth(id:string, empresa : INewEmpresa): Observable<IEmpresaDisplay>;
  abstract actualizarEmpresaToken(token:string, empresa : INewEmpresa): Observable<IEmpresaDisplay>;
  abstract buscarPorCif(cif:string): Observable<IEmpresaDisplay>;
  abstract asociarEmpresa(idEmpresa: string) : Observable<boolean>;
  abstract actualizarNota(idEmpresa: string, nota:string): Observable<boolean>;
  abstract enviarMail(datos : {empresas: string[], mensaje: string}) : Observable<boolean>;
  abstract eliminarEmpresa(id: string) : Observable<boolean>;
}
