import { Component, input } from '@angular/core';
import { GestionFiltradoEmpresasService } from '../../services/gestion-filtrado-empresas.service';

@Component({
  selector: 'orden-select',
  imports: [],
  templateUrl: './orden-select.component.html',
  styleUrl: './orden-select.component.scss'
})
export class OrdenSelectComponent {

  criterioOrdenacion = input.required<string[]>();

  constructor(public empresasService: GestionFiltradoEmpresasService){

  }

  //TODO Meter model aqui
  //criterioModel:string[] = this.criterioOrdenacion();

  actualizarCriterioOrdenacion(event : Event){
    if( event.target instanceof HTMLSelectElement)
    this.empresasService.criterio.set(event.target.value);


  }

  actualizarOrden(event : Event){
    if( event.target instanceof HTMLSelectElement)
    this.empresasService.orden.set(event.target.value);
  }
}
