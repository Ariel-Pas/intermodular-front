import { Component, input } from '@angular/core';
import { stringPair } from '../../types';


@Component({
  selector: 'sections-underline',
  imports: [],
  templateUrl: './sections-underline.component.html',
  styleUrl: './sections-underline.component.scss'
})
export class SectionsUnderlineComponent {
  //recibe un array de tuplas de la forma [id objetivo a mostrar, texto del link] ej [['lista', 'Listado'], ['mapa, 'Mapa']],
  //siendo 'lista' y 'mapa' divs dentro de un tab-content
 public listaSecciones = input.required<stringPair[]>({alias: 'lista'});
}
