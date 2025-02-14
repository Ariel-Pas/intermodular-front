import { Observable } from "rxjs";
import { IUsuario } from "../../types";

export default abstract class IUsuarioService {
  abstract getUsuarios(): Observable<IUsuario[]>;
  abstract getUsuario(id:string): Observable<IUsuario>;
  abstract crearUsuario(usuario: IUsuario): Observable<IUsuario>;
  abstract actualizarUsuario(id:string, usuario: IUsuario): Observable<IUsuario>;
  abstract eliminarUsuario(id:string): Observable<boolean>;
}
