import { Component, input } from '@angular/core';
import { GestionFiltradoEmpresasService } from '../../services/gestion-filtrado-empresas.service';
import { FormsModule } from '@angular/forms';

interface ITipoOrdenacion{
  criterio: string,
  orden: 'asc' | 'desc'
}


@Component({
  selector: 'orden-select',
  imports: [FormsModule],
  templateUrl: './orden-select.component.html',
  styleUrl: './orden-select.component.scss'
})
export class OrdenSelectComponent {

  criterioOrdenacion = input.required<string[]>();


  constructor(public empresasService: GestionFiltradoEmpresasService){
  }

  //modelo para formulario
  protected ordenModel : ITipoOrdenacion = {
    criterio : 'nombre',
    orden: 'asc'
  }

  //funciones que se ejecutan onchange
  actualizarCriterioOrdenacion(){
    this.empresasService.criterio.set(this.ordenModel.criterio);
  }
  actualizarOrden(){
    this.empresasService.orden.set(this.ordenModel.orden);
  }
}
