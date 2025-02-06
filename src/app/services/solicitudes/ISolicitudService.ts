import { Observable } from "rxjs";
import { ICentro, IResenia, ISolicitud } from "../../types";

export abstract class ISolicitudService
{
  public abstract crearSolicitud(solicitud: ISolicitud) : Observable<ISolicitud>;

  public abstract cargarCentros() : Observable<ICentro[]>;

  public abstract cargarCiclosSegunCentro(centro: ICentro) : Observable<ICentro>;
}
