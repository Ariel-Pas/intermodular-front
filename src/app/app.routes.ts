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
import { UnauthorizedComponent } from './components/login/unauthorized/unauthorized.component';
import { UsuariosComponent } from './components/usuarios/usuarios/usuarios.component';
import { CreateUsuarioComponent } from './components/usuarios/create-usuario/create-usuario.component';
import { UpdateUsuarioComponent } from './components/usuarios/update-usuario/update-usuario.component';
import { ServiciosComponent } from './components/servicios/servicios/servicios.component';
import { CategoriasComponent } from './components/categorias/categorias/categorias.component';

//TEST
export const routes: Routes = [
  //PERFILES
  {path: 'profile/Centro', component: CentroProfileComponent, canMatch: [RoleGuard], data: {expectedRole: 'Centro'}},
  {path: 'profile/Tutor', component: ProfesorProfileComponent, canMatch: [RoleGuard], data: {expectedRole: 'Tutor'}},
  {path: 'select-role', component: SelectRoleComponent, canActivate: [AuthGuard]},
  {path: 'unauthorized', component: UnauthorizedComponent},


  //USUARIOS
  {path: 'usuarios', component: UsuariosComponent , canMatch: [RoleGuard], data: {expectedRole: 'Centro'}},
  {path: 'create-usuario', component: CreateUsuarioComponent , canMatch: [RoleGuard], data: {expectedRole: 'Centro'}},
  {path: 'update-usuario/:id', component: UpdateUsuarioComponent , canMatch: [RoleGuard], data: {expectedRole: 'Centro'}},

  //SERVICIOS
  {path: 'servicios', component: ServiciosComponent, canActivate: [AuthGuard]},

  //CATEGORIAS
  {path: 'categorias', component: CategoriasComponent, canActivate: [AuthGuard]},

  //GENERAL + EMPRESAS

  {path: 'dashboard', component: EmpresasPrincipalComponent, canActivate: [AuthGuard]},

  {path: 'login', component: LoginComponent},
  {path: 'company/:id', component: EmpresaComponent, resolve: {empresa: empresaResolver}, canActivate: [AuthGuard]},
  {path: 'company/update/:id', component: UpdateEmpresaComponent, resolve: {empresa: empresaResolver}/* , canActivate: [()=>roleIs('profesor', 'admin')] */},
  {path: 'create-company', component: CreateEmpresaComponent, canActivate: [AuthGuard]},

  {path: 'company/contact', component: MailEmpresaComponent, canActivate: [AuthGuard]},
  {path: 'empresas-alumnos/:id', component: ListaEmpresasAlumnosComponent },

  // rutas formulario:
  {path: 'create-formulario', component: FormulariosComponent , canActivate: [AuthGuard]},
  {path: 'formulario/:id', component: FormulariosComponent, canActivate: [AuthGuard]},
  {path: 'create-solicitud', component: SolicitudesComponent},

  {path: '', redirectTo: 'login', pathMatch:'full'},
  {path: '**', component: RouteNotFoundComponent}
];
