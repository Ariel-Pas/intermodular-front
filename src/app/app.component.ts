import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DashboardEmpresasComponent } from './dashboard/dashboard-empresas/dashboard-empresas.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, DashboardEmpresasComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'intermodular-front';
}
