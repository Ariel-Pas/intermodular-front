import { Observable } from "rxjs";
import { IServicio } from "../../types";

export default abstract class IServicioService {
    abstract getServicios(): Observable<IServicio[]>;
    abstract getServicio(id: string): Observable<IServicio>;
    //AQUI DEBERIA ESTAR INewServicio
    abstract crearServicio(servicio: IServicio): Observable<IServicio>;
    abstract actualizarServicio(id: string, servicio: IServicio): Observable<IServicio>;
    abstract eliminarServicio(id: string): Observable<boolean>;
}
