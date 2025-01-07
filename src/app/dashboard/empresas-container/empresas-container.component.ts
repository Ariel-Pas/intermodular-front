import { Component } from '@angular/core';
import { SectionsUnderlineComponent } from '../../components/sections-underline/sections-underline.component';
import { stringPair } from '../../types';
@Component({
  selector: 'app-empresas-container',
  imports: [SectionsUnderlineComponent],
  templateUrl: './empresas-container.component.html',
  styleUrl: './empresas-container.component.scss'
})
export class EmpresasContainerComponent {
  public listaSecciones : stringPair[] = [['lista', 'Listado'], ['mapa', 'Mapa']];
}
