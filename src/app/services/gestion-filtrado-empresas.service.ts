import { computed, effect, inject, Injectable, signal } from '@angular/core';
import IEmpresasService from './IEmpresasService';
import { IEmpresaDisplay, IFiltros } from '../types';
import { Subscription } from 'rxjs';
import { rxResource } from '@angular/core/rxjs-interop';


@Injectable({
  providedIn: 'root',
})
export class GestionFiltradoEmpresasService {

  constructor(){
    effect(()=> {
      console.log(
        this.empresas()
      );

    })
  }

  //private empresas = signal<IEmpresaDisplay[]>([]);
  private filtros = signal<IFiltros>({
    nombre: '',
    localidad: '',
    provincia: '',
    vacantes: 0,
    categoria: '',
    servicio: ''
  });


  public orden = signal<string>('asc');
  //tipo asc|desc
  public criterio = signal<string>('nombre');
  //keyof Icompany porque tiene que ser algo de la interfaz
//obtener empresas del servicio
  private servicioEmpresas = inject(IEmpresasService);

  private empresasRx = rxResource({
    loader: () => this.servicioEmpresas.getEmpresas()
  })

  public empresas = computed(()=> this.empresasRx.value() ?? []);

  //todo hacer dos computadas, una que filtra y otra que ordena dependiente de la primera
  //filtrar
  public empresasFiltradas = computed(() => {
    console.log('filtrar');



      const clon = [...this.empresas()];
      let filtrado = clon.filter((x) =>
        this.filtros().nombre.length == 0
          ? true
          : x.nombre
              .toLocaleLowerCase()
              .includes(this.filtros().nombre.toLocaleLowerCase())
      );


      //console.log(filtrado);
      filtrado = filtrado.filter((x) =>
        this.filtros().provincia ? this.filtros().provincia.includes(x.direccion.provincia.name) : true
      );

      filtrado = filtrado.filter((x) =>
        this.filtros().localidad ? x.direccion.poblacion.name == this.filtros().localidad : true
      );


      filtrado = filtrado.filter((x) =>{
        if(!this.filtros().vacantes) return true;
        return x.vacantes == this.filtros().vacantes;

      });

      filtrado = filtrado.filter((x) =>
        this.filtros().categoria
          ? x.categorias.find(cat => cat.name == this.filtros().categoria)
          : true
      );

      filtrado = filtrado.filter((x) => this.filtros().servicio ? x.servicios.find(serv => serv.name == this.filtros().servicio) : true);



      //Ordenar
      filtrado.sort((left, right) => {
        switch(this.criterio()){
          case 'nombre' :
            if(this.orden() == 'asc') return left.nombre.localeCompare(right.nombre);
            else return right.nombre.localeCompare(left.nombre);

          case 'vacantes' :
          if(this.orden() == 'asc') return left.vacantes - right.vacantes;
            else return right.vacantes - left.vacantes;

          case 'nota' :
            let notaMediaLeft = (left.puntuacion + left.puntuacion)/2;
            let notaMediaRight = (right.puntuacion + right.puntuacion)/2;
            if(this.orden() == 'asc') return notaMediaLeft - notaMediaRight;
            else return notaMediaRight - notaMediaLeft;

          case 'municipio' :
            if(this.orden() == 'asc') return left.direccion.poblacion.name.localeCompare(right.direccion.poblacion.name);
            else return right.direccion.poblacion.name.localeCompare(left.direccion.poblacion.name);

        }

        return 1;
      })

      //console.log(filtrado);

      return filtrado;
    });




  getEmpresasFiltradas(){
    return this.empresasFiltradas;
  };

  actualizarFiltros(filtros : IFiltros ){
    console.log(filtros);

    this.filtros.set(filtros);
  };

}
