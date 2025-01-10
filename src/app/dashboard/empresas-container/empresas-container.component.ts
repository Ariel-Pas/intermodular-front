import { Component } from '@angular/core';
import { SectionsUnderlineComponent } from '../../components/sections-underline/sections-underline.component';
import { stringPair } from '../../types';
import { OrdenSelectComponent } from '../../components/orden-select/orden-select.component';
@Component({
  selector: 'app-empresas-container',
  imports: [SectionsUnderlineComponent, OrdenSelectComponent],
  templateUrl: './empresas-container.component.html',
  styleUrl: './empresas-container.component.scss'
})
export class EmpresasContainerComponent {
  public listaSecciones : stringPair[] = [['lista', 'Listado'], ['mapa', 'Mapa']];
}
