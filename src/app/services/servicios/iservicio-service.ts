import { Observable } from "rxjs";
import { IServicio } from "../../types";
import { IServicioBeta } from "../../types";

export default abstract class IServicioService {
    abstract getServicios(): Observable<IServicioBeta[]>;
    abstract getServicio(id: string): Observable<IServicioBeta>;
    //AQUI DEBERIA ESTAR INewServicio
    abstract crearServicio(servicio: IServicioBeta): Observable<IServicioBeta>;
    abstract actualizarServicio(id: string, servicio: IServicioBeta): Observable<IServicioBeta>;
    abstract eliminarServicio(id: string): Observable<boolean>;
}
