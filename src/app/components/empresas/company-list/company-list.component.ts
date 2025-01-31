import { Component, computed, inject } from '@angular/core';
import { FiltroEmpresasComponent } from '../filtro-empresas/filtro-empresas.component';
import { EmpresaCardComponent } from '../card-empresa/card-empresa.component';
import IEmpresasService from '../../../services/IEmpresasService';
import { rxResource } from '@angular/core/rxjs-interop';
import { GestionFiltradoEmpresasService } from '../../../services/gestion-filtrado-empresas.service';
;

@Component({
  selector: 'company-list',
  imports: [FiltroEmpresasComponent, EmpresaCardComponent],
  templateUrl: './company-list.component.html',
  styleUrl: './company-list.component.scss'
})
export class CompanyListComponent {
  public empresasService = inject(GestionFiltradoEmpresasService);

   /*  private empresasRx = rxResource({
      loader: () =>this.empresasService.getEmpresas()
    })

    public empresas = computed (()=>
      this.empresasRx.value() ?? []
    ); */
}
