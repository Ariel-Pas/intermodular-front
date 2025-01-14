import { Inject, inject, Injectable } from '@angular/core';
import IEmpresasService from './IEmpresasService';
import { map, Observable } from 'rxjs';
import { IEmpresaDisplay, EmpresaJson } from '../types';
import { HttpClient } from '@angular/common/http';
import { API_BASE } from '../tokens/tokens';


@Injectable({
  providedIn: 'root',
})
export class EmpresasApiService extends IEmpresasService {
  constructor(@Inject(API_BASE) private baseUrl: string) {
    super();
  }

  private httpClient = inject(HttpClient);

  getEmpresas(): Observable<IEmpresaDisplay[]> {
    return this.httpClient
      .get<EmpresaJson[]>(`${this.baseUrl}/companies`)
      .pipe(
        //mapear al tipo que se usa en la web
        //se recibe un array de EmpresJson y hay que mapearlo a array de IEmpresaDisplay

        map((empresas) => {
          return empresas.map((empresa) => {
            let e: IEmpresaDisplay = {
              id: empresa.id,
              nombre: empresa.name,
              cif: '00000000X',
              descripcion: 'Empresa',
              email: empresa.email,
              telefono: empresa.phone,
              direccion: {
                calle: empresa.address.street,
                provincia: empresa.address.region,
                poblacion: empresa.address.town,
                posicion: {
                  coordX: empresa.address.position.lat,
                  coordY: empresa.address.position.lng,
                },
              },
              horario: {
                horario_manana: empresa.workingHours.start,
                horario_tarde: empresa.workingHours.end,
                finSemana: true,
              },
              imagen: empresa.image,
              categorias: empresa.categories,
              servicios: ['PHP', 'RRSS'],
              vacantes: [
                {
                  anyo: empresa.openings[0].year,
                  cantidad: empresa.openings[0].count,
                },
              ],
              puntuacion: {
                profesor: empresa.score.teacher / 10,
                alumno: empresa.score.student / 10,
              },
            };

            return e;
          });
        })
      );
  }

  getEmpresa(idEmpresa: string): Observable<IEmpresaDisplay> {
    return this.httpClient
      .get<EmpresaJson>(`${this.baseUrl}/companies/${idEmpresa}`)
      .pipe(
        map((empresa) => {
          let e: IEmpresaDisplay = {
            id: empresa.id,
            nombre: empresa.name,
            cif: '00000000X',
            descripcion: 'Empresa',
            email: empresa.email,
            telefono: empresa.phone,
            direccion: {
              calle: empresa.address.street,
              provincia: empresa.address.region,
              poblacion: empresa.address.town,
              posicion: {
                coordX: empresa.address.position.lat,
                coordY: empresa.address.position.lng,
              },
            },
            horario: {
              horario_manana: empresa.workingHours.start,
              horario_tarde: empresa.workingHours.end,
              finSemana: true,
            },
            imagen: empresa.image,
            categorias: empresa.categories,
            servicios: ['PHP', 'RRSS'],
            vacantes: [
              {
                anyo: empresa.openings[0].year,
                cantidad: empresa.openings[0].count,
              },
            ],
            puntuacion: {
              profesor: empresa.score.teacher / 10,
              alumno: empresa.score.student / 10,
            },
          };

          return e;
        })
      );
  }
}
