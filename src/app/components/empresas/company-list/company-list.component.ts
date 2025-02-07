import { Component, computed, effect, inject, signal } from '@angular/core';
import { FiltroEmpresasComponent } from '../filtro-empresas/filtro-empresas.component';
import { EmpresaCardComponent } from '../card-empresa/card-empresa.component';
import IEmpresasService from '../../../services/IEmpresasService';
import { rxResource } from '@angular/core/rxjs-interop';
import { GestionFiltradoEmpresasService } from '../../../services/gestion-filtrado-empresas.service';
import { tap } from 'rxjs';
import { ur } from '@faker-js/faker';
;

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
  }


  public empresasFiltradasService = inject(GestionFiltradoEmpresasService);
  public empresasService = inject(IEmpresasService);

/*   protected url = signal('');
  url$ = this.empresasService.getUrlAbierta().pipe(
    tap(response => {
      this.url.set(response.url)
      console.log('tap');

      console.log(response);

    })
  ) */

/*   url$ = this.empresasService.getUrlAbierta().subscribe({
    next(x) {
      this.url.set(x.url)
    }
  }) */


  private urlCompartirRx = rxResource({
    loader: () => this.empresasService.getUrlAbierta()
  })

  protected urlCompartir = computed(() => this.urlCompartirRx.value() ?? {url: ''});

  protected baseurl = `${window.origin}/empresas-alumnos/`;
  protected url = computed(() => this.urlCompartir() ? `${this.baseurl}${this.urlCompartir().url}`  : '');

  /* private empresasRx = rxResource({
    loader: () => this.servicioEmpresas.getEmpresas()
  })

    private empresas = computed(()=> this.empresasRx.value() ?? []);*/

}
