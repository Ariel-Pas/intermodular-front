import { Component, input } from '@angular/core';
import { stringPair } from '../../types';
import { OrdenSelectComponent } from '../orden-select/orden-select.component';


@Component({
  selector: 'sections-underline',
  imports: [OrdenSelectComponent],
  templateUrl: './sections-underline.component.html',
  styleUrl: './sections-underline.component.scss'
})
export class SectionsUnderlineComponent {
  //recibe un array de tuplas de la forma [id objetivo a mostrar, texto del link] ej [['lista', 'Listado'], ['mapa, 'Mapa']],
  //siendo 'lista' y 'mapa' divs dentro de un tab-content
 public listaSecciones = input.required<stringPair[]>({alias: 'lista'});
 public criteriosOrdenacion = input<string[]>([]);
}
