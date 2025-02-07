import { Component } from '@angular/core';
import { SectionsUnderlineComponent } from '../../components/sections-underline/sections-underline.component';
import { stringPair } from '../../types';
import { OrdenSelectComponent } from '../../components/orden-select/orden-select.component';
import {MatTabsModule} from '@angular/material/tabs'
import { CompanyMapComponent } from '../../components/empresas/company-map/company-map.component';
@Component({
  selector: 'app-empresas-container',
  imports: [ OrdenSelectComponent, MatTabsModule, CompanyMapComponent],
  templateUrl: './empresas-container.component.html',
  styleUrl: './empresas-container.component.scss'
})
export class EmpresasContainerComponent {

}
