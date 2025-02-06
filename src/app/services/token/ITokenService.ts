import { Observable } from "rxjs";
import { IFormulario, IPregunta, IToken } from "../../types";

export abstract class ITokenService
{
  public abstract generarToken( empresaId : number, formularioId: number, centroId: number) : Observable<IToken>;

  public abstract buscarFormularioPorToken(token: string): Observable<IToken>;
}

