import { Injectable } from '@angular/core';
import IEmpresasService from './IEmpresasService';
import { IEmpresaDisplay, InfoGeografia } from '../types';
import townsJson from '../towns.json';
import empresasData from '../data.json';

interface EmpresaJson {
  id: string,
  name: string,
  image: string,
  phone?: string | undefined,
  email?: string | undefined,
  address: {
      region: string,
      town: string,
      street: string,
      position: {
          lat: number,
          lng: number
      }
  },
  openings: {
      year: number,
      count: number
  }[],
  categories: string[],
  workingHours: {
      start: string,
      end: string
  },
  score: {
      teacher: number,
      student: number
  }
}



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
        id: ids++,
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
    return this.empresas;
  }
}
