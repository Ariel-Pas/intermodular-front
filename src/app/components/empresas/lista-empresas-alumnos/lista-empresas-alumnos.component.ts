import { Component, computed, inject, input } from '@angular/core';
import IEmpresasService from '../../../services/IEmpresasService';
import { rxResource } from '@angular/core/rxjs-interop';
import { EmpresaCardComponent } from '../card-empresa/card-empresa.component';

@Component({
  selector: 'app-lista-empresas-alumnos',
  imports: [EmpresaCardComponent],
  templateUrl: './lista-empresas-alumnos.component.html',
  styleUrl: './lista-empresas-alumnos.component.scss'
})
export class ListaEmpresasAlumnosComponent {
  public id = input.required<string>();
  private empresasService = inject(IEmpresasService);

  private empresasRx = rxResource({
    loader: ()=>this.empresasService.getEmpresasAlumnos(this.id())
  })

  protected empresas = computed(()=> this.empresasRx.value() ?? []);
}
