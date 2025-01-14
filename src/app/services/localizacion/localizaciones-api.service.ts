import { inject, Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ILocalizacionService } from './ILocalizacionService';
import { HttpClient } from '@angular/common/http';
import { IRegion, ITown } from '../../types';

@Injectable({
  providedIn: 'root',
})
export class LocalizacionesApiService extends ILocalizacionService{
  private httpClient = inject(HttpClient);

  public getRegiones(): Observable<IRegion[]> {
    return this.httpClient.get<IRegion[]>('http://localhost:3000/regions?area=10');
  }

  public getPoblaciones(idRegion: string): Observable<ITown[] | undefined> {
    return this.httpClient.get<ITown[]>('http://localhost:3000/towns', {params: {'region' : idRegion}});
  }
}
