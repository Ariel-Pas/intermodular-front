import { inject, Inject, Injectable } from '@angular/core';
import IServicioService from './iservicio-service';
import { Observable } from 'rxjs';
import { IServicio } from '../../types';
import { API_URL } from '../../tokens/token-formulario';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ServicioApiService extends IServicioService {
  constructor(@Inject(API_URL) private apiUrl: string) {
    super();
  }

  private httpClient = inject(HttpClient);

  override getServicios(): Observable<IServicio[]> {
    return this.httpClient.get<IServicio[]>(`${this.apiUrl}/servicios`);
  }
  override getServicio(id: string): Observable<IServicio> {
    return this.httpClient.get<IServicio>(`${this.apiUrl}/servicios/${id}`);
  }
  override crearServicio(servicio: IServicio): Observable<IServicio> {
    return this.httpClient.post<IServicio>(`${this.apiUrl}/servicios`, servicio);
  }
  override actualizarServicio(id: string, servicio: IServicio): Observable<IServicio> {
    return this.httpClient.put<IServicio>(`${this.apiUrl}/servicios/${id}`, servicio);
  }
  override eliminarServicio(id: string): Observable<boolean> {
    return this.httpClient.delete<boolean>(`${this.apiUrl}/servicios/${id}`);
  }


}
