import { Routes } from '@angular/router';
import { roleIs } from './guards/is-role.guard';
import { AdminProfileComponent } from './components/profiles/admin-profile/admin-profile.component';
import { EstudianteProfileComponent } from './components/profiles/estudiante-profile/estudiante-profile.component';
import { ProfesorProfileComponent } from './components/profiles/profesor-profile/profesor-profile.component';
import { RouteNotFoundComponent } from './components/route-not-found/route-not-found.component';
import { EmpresaProfileComponent } from './components/profiles/empresa-profile/empresa-profile.component';
import { LoginComponent } from './components/login/login.component';
import { EmpresaComponent } from './components/empresas/empresa/empresa.component';
import { CreateEmpresaComponent } from './components/empresas/create-empresa/create-empresa.component';
import { empresaResolver } from './resolvers/empresa.resolver';
import { EmpresasPrincipalComponent } from './components/empresas/empresas-principal/empresas-principal.component';
import { ListaEmpresasAlumnosComponent } from './components/empresas/lista-empresas-alumnos/lista-empresas-alumnos.component';
import { UpdateEmpresaComponent } from './components/empresas/update-empresa/update-empresa.component';
import { MailEmpresaComponent } from './components/empresas/mail-empresa/mail-empresa.component';


export const routes: Routes = [
  {path: 'profile', component: AdminProfileComponent, canMatch: [()=>roleIs('admin')] },
  {path: 'profile', component: EstudianteProfileComponent, canMatch: [()=>roleIs('estudiante')]},
  {path: 'profile', component: ProfesorProfileComponent, canMatch: [()=>roleIs('profesor')]},
  {path: 'profile', component: EmpresaProfileComponent, canMatch: [()=>roleIs('empresa')]},
  {path: 'dashboard', component: EmpresasPrincipalComponent, /* canActivate: [()=>roleIs('profesor', 'admin')] */},
  {path: 'login', component: LoginComponent},
  {path: 'company/:id', component: EmpresaComponent, resolve: {empresa: empresaResolver}/* , canActivate: [()=>roleIs('profesor', 'admin')] */},
  {path: 'company/update/:id', component: UpdateEmpresaComponent, resolve: {empresa: empresaResolver}/* , canActivate: [()=>roleIs('profesor', 'admin')] */},
  {path: 'create-company', component: CreateEmpresaComponent,/*  canActivate: [()=>roleIs('profesor', 'admin')] */},
  {path: 'company/contact', component: MailEmpresaComponent},
  {path: 'empresas-alumnos/:id', component: ListaEmpresasAlumnosComponent},
  {path: '', redirectTo: 'login', pathMatch:'full'},
  {path: '**', component: RouteNotFoundComponent}
];
