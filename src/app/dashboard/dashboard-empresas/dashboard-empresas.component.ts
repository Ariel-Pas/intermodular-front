import { Component, computed, signal } from '@angular/core';
import { FiltroEmpresasComponent } from '../filtro-empresas/filtro-empresas.component';
import { EmpresasContainerComponent } from '../empresas-container/empresas-container.component';
import { EmpresaCardComponent } from '../card-empresa/card-empresa.component';
import { IEmpresaDisplay, IFiltros, InfoGeografia } from '../../types';

import { faker } from '@faker-js/faker';
import townsJson from '../../towns.json';


@Component({
  selector: 'dashboard-empresas',
  imports: [
    FiltroEmpresasComponent,
    EmpresasContainerComponent,
    EmpresaCardComponent,
  ],
  templateUrl: './dashboard-empresas.component.html',
  styleUrl: './dashboard-empresas.component.scss',
})
export class DashboardEmpresasComponent {

  //Crear signal para los filtros. Al principio está vacia
  filtros = signal<IFiltros>({
    nombre : '',
    localidad: '',
    provincia: '',
    vacantes: 0,
    categoria: ''
  });

  //gestionar cambio de filtros
  //actualizar signal de los filtros cuando se reciba la salida del componente filtro
  filtrosChanged($event : IFiltros) : void {
    this.filtros.set($event);
    console.log(this.filtros());

  }


  //generar array empresas
  //array para generar una provincia y localidad
  private towns : InfoGeografia = townsJson;
  private provincias = [...Object.keys(this.towns)];
  //array para generar categorias
  private categorias = ['Programación web', 'Comercio electrónico', 'RRSS', 'Marketing', 'Aplicaciones'];

  private ids = 0;
  empresas = signal<IEmpresaDisplay[]>(Array.from(
    { length: 10 },
    (): IEmpresaDisplay => {
      const prov = this.provincias[Math.floor(Math.random() * this.provincias.length)];
      let e: IEmpresaDisplay = {
        id: this.ids++,
        nombre: faker.company.name(),
        cif: 'B12345678',
        descripcion: faker.lorem.text().substring(0,60),
        email: 'contacto@techsolutions.com',
        direccion: 'Calle Innovación, 123',
        provincia: prov,
        poblacion: this.towns[prov][Math.floor(Math.random() * this.towns[prov].length)],
        coordX: 40.416775,
        coordY: -3.70379,
        horario_manana: '08:00 - 14:00',
        horario_tarde: '15:00 - 18:00',
        finSemana: false,
        imagen: 'https://example.com/logo-techsolutions.png',
        categorias: [this.categorias[Math.floor(Math.random()*this.categorias.length)], this.categorias[Math.floor(Math.random()*this.categorias.length)]],
        servicios: ['PHP', 'TS'],
        vacantes : Math.floor(Math.random()*7)
      };
      return e;
    }
  ))

  //crear computada a partir del array aplicando los filtros
  empresasFiltradas = computed(()=>{

    const clon = [...this.empresas()];
    let filtrado = clon.filter(x => this.filtros().nombre.length == 0 ? true :  x.nombre.toLocaleLowerCase().includes(this.filtros().nombre.toLocaleLowerCase()));
    filtrado = filtrado.filter(x => this.filtros().provincia ?  x.provincia ==  this.filtros().provincia : true);
    filtrado = filtrado.filter(x => this.filtros().localidad ?  x.poblacion ==  this.filtros().localidad : true);
    filtrado = filtrado.filter(x => this.filtros().vacantes ?  x.vacantes ==  this.filtros().vacantes : true);
    filtrado = filtrado.filter(x => this.filtros().categoria ?  x.categorias.includes(this.filtros().categoria) : true);

    return filtrado;
  })
}
