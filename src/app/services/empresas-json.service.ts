import { Injectable } from '@angular/core';
import IEmpresasService from './IEmpresasService';
import { IEmpresaDisplay, InfoGeografia, EmpresaJson } from '../types';
import townsJson from '../data/towns.json';
import empresasData from '../data/data.json';
import { Observable, of } from 'rxjs';




@Injectable({
  providedIn: 'root'
})
export class EmpresasJsonService extends IEmpresasService {
  private empresas : IEmpresaDisplay[];
  private towns: InfoGeografia = townsJson;

  private data : EmpresaJson[] = empresasData['companies'];

  constructor() {
    super();
    let ids = 0;
    this.empresas = this.data.map(empresa => {
      let e : IEmpresaDisplay =  {
        id: (ids++).toString(),
        nombre: empresa.name,
        cif : '00000000X',
        descripcion: 'Empresa',
        email : empresa.email,
        telefono: empresa.phone,
        direccion: {
          calle: empresa.address.street,
          provincia: empresa.address.region,
          poblacion: empresa.address.town,
          posicion: {
            coordX: empresa.address.position.lat,
            coordY: empresa.address.position.lng
          }
        },
        horario: {
          horario_manana: empresa.workingHours.start,
          horario_tarde: empresa.workingHours.end,
          finSemana : true
        },
        imagen : empresa.image,
        categorias : empresa.categories,
        servicios: ['PHP', 'RRSS'],
        vacantes: [
          {
            anyo: empresa.openings[0].year,
            cantidad: empresa.openings[0].count
          }
        ],
        puntuacion: {
          profesor: empresa.score.teacher /10,
          alumno: empresa.score.student /10
        }

      };

      return e;
    })

  }

  getEmpresas(){
    return of(this.empresas);
  }

  getEmpresa(idEmpresa: string): Observable<IEmpresaDisplay | undefined> {
      let empresa = this.empresas.find(e => e.id == idEmpresa);
      return of(empresa);
    }
}
