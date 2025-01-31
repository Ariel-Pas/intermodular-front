import { Component, inject, viewChild } from '@angular/core';
import {GoogleMap, MapMarker, MapInfoWindow} from '@angular/google-maps'
import { GestionFiltradoEmpresasService } from '../../../services/gestion-filtrado-empresas.service';
import { IEmpresaDisplay } from '../../../types';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'company-map',
  imports: [GoogleMap, MapMarker, MapInfoWindow, RouterLink],
  templateUrl: './company-map.component.html',
  styleUrl: './company-map.component.scss'
})
export class CompanyMapComponent {
  protected gestionEmpresas = inject(GestionFiltradoEmpresasService);
  protected zoom = 10;

  protected marcadorSeleccionado: IEmpresaDisplay|undefined = undefined;

  infoWindow = viewChild.required(MapInfoWindow);
  openInfoWindow(mapMarker : MapMarker, empresaSelec : IEmpresaDisplay) {
    this.marcadorSeleccionado = empresaSelec;
    //this.googleMap().panTo(poi.location);
    this.infoWindow().open(mapMarker, true);
  }

}
