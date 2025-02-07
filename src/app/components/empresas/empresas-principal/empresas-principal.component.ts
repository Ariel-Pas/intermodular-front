import { Component } from '@angular/core';
import { MatTab, MatTabContent, MatTabGroup, MatTabsModule } from '@angular/material/tabs';
import { CompanyMapComponent } from '../company-map/company-map.component';
import { CompanyListComponent } from '../company-list/company-list.component';
import { FiltroEmpresasComponent } from '../filtro-empresas/filtro-empresas.component';
import { OrdenSelectComponent } from '../../orden-select/orden-select.component';
import { MailEmpresaComponent } from '../mail-empresa/mail-empresa.component';

@Component({
  selector: 'app-empresas-principal',
  imports: [MatTabContent, MatTabGroup, MatTab, CompanyMapComponent,MailEmpresaComponent, CompanyListComponent, FiltroEmpresasComponent, OrdenSelectComponent],
  templateUrl: './empresas-principal.component.html',
  styleUrl: './empresas-principal.component.scss'
})
export class EmpresasPrincipalComponent {

}
