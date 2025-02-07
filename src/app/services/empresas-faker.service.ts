import { Injectable, signal } from '@angular/core';
import IEmpresasService from './IEmpresasService';
import { IEmpresaDisplay, InfoGeografia } from '../types';
import townsJson from '../data/towns.json';
import { faker } from '@faker-js/faker';
import { Observable, of, throwError } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class EmpresasFakerService /* extends IEmpresasService */{

  private empresas : IEmpresaDisplay[];

  private towns: InfoGeografia = townsJson;
  private provincias = [...Object.keys(this.towns)];
  //array para generar categorias
  private categorias = [
    'Programación web',
    'Comercio electrónico',
    'RRSS',
    'Marketing',
    'Aplicaciones',
  ];

  private ids = 0;
  constructor() {
   // super();
    this.empresas = (
      Array.from({ length: 10 }, (): IEmpresaDisplay => {
        const prov =
          this.provincias[Math.floor(Math.random() * this.provincias.length)];
        let e: IEmpresaDisplay = {
          id: (this.ids++).toString(),
          nombre: faker.company.name(),
          descripcion: faker.lorem.text().substring(0, 60),
          email: 'contacto@techsolutions.com',
          direccion: {
            calle: 'Calle Innovación, 123',
            provincia: {id: '1', name: 'P', area: '10'},
            poblacion: {id: '1', name: 'p', region :'1'}
              /* this.towns[prov][
                Math.floor(Math.random() * this.towns[prov].length)
              ] */,
            posicion: {
              coordX: 38 + Math.random()*2.5,
              coordY: -0.7 + Math.random()*1,
            },
          },

          horario: {
            horario_manana: '08:00 - 14:00',
            horario_tarde: '15:00 - 18:00',
            finSemana: false,
          },

          imagen: 'https://imagenes.elpais.com/resizer/v2/Y3W6QUFBBZLLTALRW6NBRPZ2RA.jpg?auth=d68f18251117888479d8fdc3210796bc86d9d3f41719da72c2877bcafc3504ea&width=414',
          categorias: [
            this.categorias[Math.floor(Math.random() * this.categorias.length)],
            this.categorias[Math.floor(Math.random() * this.categorias.length)],
          ],
          servicios: ['PHP', 'TS'],
          vacantes:  Math.floor(Math.random() * 7),
          puntuacion: Math.random()*10
        };
        return e;
      })
    );
  }

  getEmpresas(){
    return of(this.empresas);
  }

  getEmpresa(idEmpresa: string): Observable<IEmpresaDisplay | undefined> {
    let empresa = this.empresas.find(e => e.id == idEmpresa);
    return of(empresa);
  }

  getByName(nombreEmpresa: string): Observable<IEmpresaDisplay | undefined>{
      let empresa = this.empresas.find(e => e.nombre == nombreEmpresa);
      if(empresa) return of(empresa);
      return throwError(()=>({error : 'No existe la empresa'}))
  }

  buscarPorCif(cif:string): Observable<IEmpresaDisplay>
  {
    let emp :IEmpresaDisplay = {
      id: (this.ids++).toString(),
    nombre: faker.company.name(),
    descripcion: faker.lorem.text().substring(0, 60),
    email: 'contacto@techsolutions.com',
    direccion: {
      calle: 'Calle Innovación, 123',
      provincia: {id: '1', name: 'P', area: '10'},
      poblacion: {id: '1', name: 'p', region :'1'},
      posicion: {
        coordX: 38 + Math.random()*2.5,
        coordY: -0.7 + Math.random()*1,
      },
    },

    horario: {
      horario_manana: '08:00 - 14:00',
      horario_tarde: '15:00 - 18:00',
      finSemana: false,
    },

    imagen: 'https://imagenes.elpais.com/resizer/v2/Y3W6QUFBBZLLTALRW6NBRPZ2RA.jpg?auth=d68f18251117888479d8fdc3210796bc86d9d3f41719da72c2877bcafc3504ea&width=414',
    categorias: [
      this.categorias[Math.floor(Math.random() * this.categorias.length)],
      this.categorias[Math.floor(Math.random() * this.categorias.length)],
    ],
    servicios: ['PHP', 'TS'],
    vacantes:  Math.floor(Math.random() * 7),
    puntuacion: Math.random()*10
  }
    return of(emp);

  }
}
