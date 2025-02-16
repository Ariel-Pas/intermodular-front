import { inject, Inject, Injectable } from '@angular/core';
import IServicioService from './iservicio-service';
import { Observable } from 'rxjs';
import { IServicio } from '../../types';
import { IServicioBeta } from '../../types';
// import { API_URL } from '../../tokens/token-formulario';
import { API_BASE } from '../../tokens/tokens';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ServicioApiService extends IServicioService {
  constructor(@Inject(API_BASE) private apiUrl: string) {
    super();
  }

  private httpClient = inject(HttpClient);

  override getServicios(): Observable<IServicioBeta[]> {
    return this.httpClient.get<IServicioBeta[]>(`${this.apiUrl}/servicios`);
  }
  override getServicio(id: string): Observable<IServicioBeta> {
    return this.httpClient.get<IServicioBeta>(`${this.apiUrl}/servicios/${id}`);
  }
  override crearServicio(servicio: IServicioBeta): Observable<IServicioBeta> {
    return this.httpClient.post<IServicioBeta>(`${this.apiUrl}/servicios`, servicio);
  }
  override actualizarServicio(id: string, servicio: IServicioBeta): Observable<IServicioBeta> {
    return this.httpClient.put<IServicioBeta>(`${this.apiUrl}/servicios/${id}`, servicio);
  }
  override eliminarServicio(id: string): Observable<boolean> {
    return this.httpClient.delete<boolean>(`${this.apiUrl}/servicios/${id}`);
  }

}
