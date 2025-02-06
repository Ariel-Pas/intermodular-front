import { inject, Inject, Injectable } from '@angular/core';
import { API_URL } from '../../tokens/token-formulario';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ICentro, IResenia, ISolicitud } from '../../types';
import { ISolicitudService } from './ISolicitudService';

@Injectable({
  providedIn: 'root'
})
export class SolicitudApiService extends ISolicitudService {

  constructor( @Inject(API_URL) private api_url:string) {
    super();
   }

  private http = inject(HttpClient);

  crearSolicitud(solicitud: ISolicitud): Observable<ISolicitud> {
    return this.http.post<ISolicitud>(`${this.api_url}api/solicitudes`, solicitud, {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  cargarCentros(): Observable<ICentro[]> {
    return this.http.get<ICentro[]>(`${this.api_url}api/centros`);
  }

  cargarCiclosSegunCentro(centro: ICentro): Observable<ICentro> {
    return this.http.get<ICentro>(`${this.api_url}api/ciclosPorCentro/${centro.id}`);
  }
}
