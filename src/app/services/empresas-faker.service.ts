import { Injectable, signal } from '@angular/core';
import IEmpresasService from './IEmpresasService';
import { IEmpresaDisplay, InfoGeografia } from '../types';
import townsJson from '../towns.json';
import { faker } from '@faker-js/faker';
@Injectable({
  providedIn: 'root'
})
export class EmpresasFakerService extends IEmpresasService{
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
    super();
    this.empresas = (
      Array.from({ length: 10 }, (): IEmpresaDisplay => {
        const prov =
          this.provincias[Math.floor(Math.random() * this.provincias.length)];
        let e: IEmpresaDisplay = {
          id: this.ids++,
          nombre: faker.company.name(),
          cif: 'B12345678',
          descripcion: faker.lorem.text().substring(0, 60),
          email: 'contacto@techsolutions.com',
          direccion: {
            calle: 'Calle Innovación, 123',
            provincia: prov,
            poblacion:
              this.towns[prov][
                Math.floor(Math.random() * this.towns[prov].length)
              ],
            posicion: {
              coordX: 40.416775,
              coordY: -3.70379,
            },
          },

          horario: {
            horario_manana: '08:00 - 14:00',
            horario_tarde: '15:00 - 18:00',
            finSemana: false,
          },

          imagen: 'https://example.com/logo-techsolutions.png',
          categorias: [
            this.categorias[Math.floor(Math.random() * this.categorias.length)],
            this.categorias[Math.floor(Math.random() * this.categorias.length)],
          ],
          servicios: ['PHP', 'TS'],
          vacantes: [
            {
              cantidad: Math.floor(Math.random() * 7),
              anyo: 2024,
            },
          ],
          puntuacion: {
            profesor: Math.random()*10,
            alumno: Math.random()*10
          }
        };
        return e;
      })
    );
  }

  getEmpresas(){
    return this.empresas;
  }
}
