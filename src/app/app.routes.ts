import { Routes } from '@angular/router';
import { roleIs } from './guards/is-role.guard';
import { ProfesorProfileComponent } from './components/profiles/profesor-profile/profesor-profile.component';
import { RouteNotFoundComponent } from './components/route-not-found/route-not-found.component';
import { LoginComponent } from './components/login/login.component';
import { EmpresaComponent } from './components/empresas/empresa/empresa.component';
import { CreateEmpresaComponent } from './components/empresas/create-empresa/create-empresa.component';
import { empresaResolver } from './resolvers/empresa.resolver';

import { EmpresasPrincipalComponent } from './components/empresas/empresas-principal/empresas-principal.component';
import { ListaEmpresasAlumnosComponent } from './components/empresas/lista-empresas-alumnos/lista-empresas-alumnos.component';
import { UpdateEmpresaComponent } from './components/empresas/update-empresa/update-empresa.component';
import { MailEmpresaComponent } from './components/empresas/mail-empresa/mail-empresa.component';


// import { FormAlumnosComponent } from './components/formularios/formulario_alumnos/form-alumnos/form-alumnos.component';
import { FormulariosComponent } from './components/formularios/formularios/formularios.component';
import { SolicitudesComponent } from './components/solicitudes/solicitudes/solicitudes.component';
import { CentroProfileComponent } from './components/profiles/centro-profile/centro-profile.component';
import { AuthGuard } from './guards/authguard.guard';
import { RoleGuard } from './guards/roleguard.guard';
import { SelectRoleComponent } from './components/login/select-role/select-role.component';


export const routes: Routes = [
  //PERFILES
  // {path: 'profile', component: CentroProfileComponent, canMatch: [()=>roleIs('Centro')]},
  // {path: 'profile', component: ProfesorProfileComponent, canMatch: [()=>roleIs('Tutor')]},
  {path: 'profile/Centro', component: CentroProfileComponent, canMatch: [RoleGuard], data: {expectedRole: 'Centro'}},
  {path: 'profile/Tutor', component: ProfesorProfileComponent, canMatch: [RoleGuard], data: {expectedRole: 'Tutor'}},
  {path: 'select-role', component: SelectRoleComponent, canActivate: [AuthGuard]},

  {path: 'dashboard', component: EmpresasPrincipalComponent, /* canActivate: [()=>roleIs('profesor', 'admin')] */},
  {path: 'login', component: LoginComponent},
  {path: 'company/:id', component: EmpresaComponent, resolve: {empresa: empresaResolver}/* , canActivate: [()=>roleIs('profesor', 'admin')] */},
  {path: 'company/update/:id', component: UpdateEmpresaComponent, resolve: {empresa: empresaResolver}/* , canActivate: [()=>roleIs('profesor', 'admin')] */},
  {path: 'create-company', component: CreateEmpresaComponent,/*  canActivate: [()=>roleIs('profesor', 'admin')] */},

  {path: 'company/contact', component: MailEmpresaComponent},
  {path: 'empresas-alumnos/:id', component: ListaEmpresasAlumnosComponent},

  // rutas formulario:
  {path: 'create-formulario', component: FormulariosComponent }, // sacar creo ,
  {path: 'formulario/:id', component: FormulariosComponent},
  {path: 'create-solicitud', component: SolicitudesComponent},

  {path: '', redirectTo: 'login', pathMatch:'full'},
  {path: '**', component: RouteNotFoundComponent}
];
