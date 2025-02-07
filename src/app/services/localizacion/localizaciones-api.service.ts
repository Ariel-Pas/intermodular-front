import { inject, Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ILocalizacionService } from './ILocalizacionService';
import { HttpClient } from '@angular/common/http';
import { IRegion, ITown } from '../../types';
import { API_BASE } from '../../tokens/tokens';

@Injectable({
  providedIn: 'root',
})
export class LocalizacionesApiService extends ILocalizacionService {
  constructor(@Inject(API_BASE) private baseUrl: string) {
    super();
  }

  private httpClient = inject(HttpClient);

  public getRegiones(): Observable<IRegion[]> {
    return this.httpClient.get<IRegion[]>(`${this.baseUrl}/provincias`);
  }

  public getPoblaciones(idRegion: string): Observable<ITown[]> {
    return this.httpClient.get<ITown[]>(`${this.baseUrl}/municipios/${idRegion}`);
  }
}
