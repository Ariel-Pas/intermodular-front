import { Inject, inject, Injectable } from '@angular/core';
import IEmpresasService from './IEmpresasService';
import { map, Observable } from 'rxjs';
import { IEmpresaDisplay, EmpresaJson, UrlValue, INewEmpresa } from '../types';
import { HttpClient } from '@angular/common/http';
import { API_BASE } from '../tokens/tokens';
import { IAuthenticationService } from './auth/IAuthenticationService';


@Injectable({
  providedIn: 'root',
})
export class EmpresasApiService extends IEmpresasService {
  constructor(@Inject(API_BASE) private baseUrl: string) {
    super();
  }
  private authService = inject(IAuthenticationService);
  private httpClient = inject(HttpClient);

  getEmpresas(): Observable<IEmpresaDisplay[]> {
    return this.httpClient
      .get<IEmpresaDisplay[]>(`${this.baseUrl}/empresas-usuario`)

  }

  getEmpresa(idEmpresa: string): Observable<IEmpresaDisplay> {
    return this.httpClient
      .get<IEmpresaDisplay>(`${this.baseUrl}/empresa-completa/${idEmpresa}`)

  }


  getByName(nombreEmpresa: string): Observable<IEmpresaDisplay | undefined>{
    return this.httpClient
    .get<IEmpresaDisplay>(`${this.baseUrl}/companies/name/${nombreEmpresa}`);
  }

  getUrlAbierta(): Observable<UrlValue>
  {
    return this.httpClient
    .get<UrlValue>(`${this.baseUrl}/empresas-centro-url`);
  }

  getEmpresasAlumnos(idEmpresa : string): Observable<IEmpresaDisplay[]> {
    return this.httpClient
      .get<IEmpresaDisplay[]>(`${this.baseUrl}/empresas-centro/${idEmpresa}`)

  }

  crearEmpresa(empresa : INewEmpresa): Observable<IEmpresaDisplay>
  {
    return this.httpClient.post<IEmpresaDisplay>(`${this.baseUrl}/empresas`, empresa)
  }

  buscarPorCif(cif:string): Observable<IEmpresaDisplay>
  {
    return this.httpClient
      .get<IEmpresaDisplay>(`${this.baseUrl}/empresas/comprobar-cif/${cif}`);
  }

  asociarEmpresa(idEmpresa: string) : Observable<boolean>
  {
    return this.httpClient.get<boolean>(`${this.baseUrl}/empresas/asociar-centro/${idEmpresa}`);
  }

}
