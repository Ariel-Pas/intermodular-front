import { Injectable } from '@angular/core';
import { ILocalizacionService } from './ILocalizacionService';
import { Observable, of } from 'rxjs';
import { IRegion, ITown } from '../../types';
import regions from "../../data/regions.json" ;
import towns from "../../data/towns-json.json" ;

@Injectable({
  providedIn: 'root'
})
export class LocalizacionesJsonService extends ILocalizacionService{
  private regionsCV = regions.filter(r => r.area == '10')
  public getRegiones(): Observable<IRegion[]> {
    return of(this.regionsCV);
  }

  public getPoblaciones(idRegion : string): Observable<ITown[] |undefined> {
    return of(towns.filter(t => t.region == idRegion));
  }

  
}
