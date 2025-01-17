import { Routes } from '@angular/router';
import { DashboardEmpresasComponent } from './dashboard/dashboard-empresas/dashboard-empresas.component';
import { roleIs } from './guards/is-role.guard';
import { AdminProfileComponent } from './components/profiles/admin-profile/admin-profile.component';
import { EstudianteProfileComponent } from './components/profiles/estudiante-profile/estudiante-profile.component';
import { ProfesorProfileComponent } from './components/profiles/profesor-profile/profesor-profile.component';
import { RouteNotFoundComponent } from './components/route-not-found/route-not-found.component';
import { EmpresaProfileComponent } from './components/profiles/empresa-profile/empresa-profile.component';
import { LoginComponent } from './components/login/login.component';
import { EmpresaComponent } from './components/empresas/empresa/empresa.component';
import { CreateEmpresaComponent } from './components/empresas/create-empresa/create-empresa.component';

export const routes: Routes = [
  {path: 'profile', component: AdminProfileComponent, canMatch: [()=>roleIs('admin')] },
  {path: 'profile', component: EstudianteProfileComponent, canMatch: [()=>roleIs('estudiante')]},
  {path: 'profile', component: ProfesorProfileComponent, canMatch: [()=>roleIs('profesor')]},
  {path: 'profile', component: EmpresaProfileComponent, canMatch: [()=>roleIs('empresa')]},
  {path: 'dashboard', component: DashboardEmpresasComponent},
  {path: 'login', component: LoginComponent},
  {path: 'company/:id', component: EmpresaComponent},
  {path: 'create-company', component: CreateEmpresaComponent},
  {path: '**', component: RouteNotFoundComponent}
];
