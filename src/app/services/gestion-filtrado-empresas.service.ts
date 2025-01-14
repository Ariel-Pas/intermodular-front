import { computed, effect, inject, Injectable, signal } from '@angular/core';
import IEmpresasService from './IEmpresasService';
import { IEmpresaDisplay, IFiltros } from '../types';
import { Subscription } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class GestionFiltradoEmpresasService {

  private empresas = signal<IEmpresaDisplay[]>([]);
  private filtros = signal<IFiltros>({
    nombre: '',
    localidad: '',
    provincia: '',
    vacantes: 0,
    categoria: '',
    servicio: ''
  });

  public orden = signal<string>('asc');
  public criterio = signal<string>('nombre');

 /*  constructor(private empresasService : IEmpresasService) {

    this.empresas.set(empresasService.getEmpresas());

  } */

  private servicioEmpresas = inject(IEmpresasService);
  private observableEmpresas$ = this.servicioEmpresas.getEmpresas();
  private subscripcionEmpresas : Subscription = this.observableEmpresas$.subscribe(empresas => {
    this.empresas.set(empresas);
  })


  public empresasFiltradas = computed(() => {
    console.log('computar empresas');
    this.filtros();
    this.empresas();
      const clon = [...this.empresas()];
      let filtrado = clon.filter((x) =>
        this.filtros().nombre.length == 0
          ? true
          : x.nombre
              .toLocaleLowerCase()
              .includes(this.filtros().nombre.toLocaleLowerCase())
      );

      filtrado = filtrado.filter((x) =>
        this.filtros().provincia ? this.filtros().provincia.includes(x.direccion.provincia) : true
      );

      filtrado = filtrado.filter((x) =>
        this.filtros().localidad ? x.direccion.poblacion == this.filtros().localidad : true
      );

      filtrado = filtrado.filter((x) =>{
        if(!this.filtros().vacantes) return true;
        return x.vacantes[0].cantidad == this.filtros().vacantes;

      });

      filtrado = filtrado.filter((x) =>
        this.filtros().categoria
          ? x.categorias.includes(this.filtros().categoria)
          : true
      );

      filtrado = filtrado.filter((x) => this.filtros().servicio ? x.servicios.includes(this.filtros().servicio) : true);

      //Ordenar
      filtrado.sort((left, right) => {
        switch(this.criterio()){
          case 'nombre' :
            if(this.orden() == 'asc') return left.nombre.localeCompare(right.nombre);
            else return right.nombre.localeCompare(left.nombre);

          case 'vacantes' :
          if(this.orden() == 'asc') return left.vacantes[0].cantidad - right.vacantes[0].cantidad;
            else return right.vacantes[0].cantidad - left.vacantes[0].cantidad;

          case 'nota' :
            let notaMediaLeft = (left.puntuacion.alumno + left.puntuacion.profesor)/2;
            let notaMediaRight = (right.puntuacion.alumno + right.puntuacion.profesor)/2;
            if(this.orden() == 'asc') return notaMediaLeft - notaMediaRight;
            else return notaMediaRight - notaMediaLeft;

          case 'municipio' :
            if(this.orden() == 'asc') return left.direccion.poblacion.localeCompare(right.direccion.poblacion);
            else return right.direccion.poblacion.localeCompare(left.direccion.poblacion);

        }

        return 1;
      })

      return filtrado;
    });




  getEmpresasFiltradas(){
    console.log('getempresasfiltradas');

    return this.empresasFiltradas;
  };

  actualizarFiltros(filtros : IFiltros ){
    console.log('actualizarfiltros');
    console.log(filtros);

    this.filtros.set(filtros);
  };

}
