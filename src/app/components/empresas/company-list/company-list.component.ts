import { Component, computed, effect, inject, signal } from '@angular/core';
import { FiltroEmpresasComponent } from '../filtro-empresas/filtro-empresas.component';
import { EmpresaCardComponent } from '../card-empresa/card-empresa.component';
import IEmpresasService from '../../../services/IEmpresasService';
import { rxResource } from '@angular/core/rxjs-interop';
import { GestionFiltradoEmpresasService } from '../../../services/gestion-filtrado-empresas.service';


@Component({
  selector: 'company-list',
  imports: [FiltroEmpresasComponent, EmpresaCardComponent],
  templateUrl: './company-list.component.html',
  styleUrl: './company-list.component.scss'
})
export class CompanyListComponent {

  constructor(){
    effect(()=>{
      console.log('url',this.url());

    })

    effect(()=>{
      console.log(this.empresasFiltradasService.empresas());
    })



  }




  public empresasFiltradasService = inject(GestionFiltradoEmpresasService);
  public empresasService = inject(IEmpresasService);



    private empresasRx = rxResource({
      loader: () => this.empresasService.getEmpresas()
    })

    public empresas = computed(()=> this.empresasRx.value() ?? []);


  private urlCompartirRx = rxResource({
    loader: () => this.empresasService.getUrlAbierta()
  })

  protected urlCompartir = computed(() => this.urlCompartirRx.value() ?? {url: ''});

  protected baseurl = `${window.origin}/empresas-alumnos/`;
  protected url = computed(() => this.urlCompartir() ? `${this.baseurl}${this.urlCompartir().url}`  : '');


}
