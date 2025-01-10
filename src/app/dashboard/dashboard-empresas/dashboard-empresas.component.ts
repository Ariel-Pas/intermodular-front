import { Component, computed, effect, model, Signal, signal } from '@angular/core';
import { FiltroEmpresasComponent } from '../filtro-empresas/filtro-empresas.component';
import { EmpresasContainerComponent } from '../empresas-container/empresas-container.component';
import { EmpresaCardComponent } from '../card-empresa/card-empresa.component';
import { IEmpresaDisplay, stringPair} from '../../types';

import { GestionFiltradoEmpresasService } from '../../services/gestion-filtrado-empresas.service';
import { SectionsUnderlineComponent } from '../../components/sections-underline/sections-underline.component';


@Component({
  selector: 'dashboard-empresas',
  imports: [
    FiltroEmpresasComponent,
    EmpresasContainerComponent,
    EmpresaCardComponent,
    SectionsUnderlineComponent
  ],
  templateUrl: './dashboard-empresas.component.html',
  styleUrl: './dashboard-empresas.component.scss',

})
export class DashboardEmpresasComponent {
  public listaSecciones : stringPair[] = [['lista', 'Listado'], ['mapa', 'Mapa']];

  constructor(public empresasService: GestionFiltradoEmpresasService) {

  }

  public empresasFiltradas = computed(()=>{
    return this.empresasService.getEmpresasFiltradas();
  })


}
