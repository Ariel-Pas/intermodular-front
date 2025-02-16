import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import IEmpresasService from './services/IEmpresasService';
//import { EmpresasFakerService } from './services/empresas-faker.service';
//import { EmpresasJsonService } from './services/empresas-json.service';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { EmpresasApiService } from './services/empresas-api.service';
import { IAuthenticationService } from './services/auth/IAuthenticationService';
import { AuthFakeService } from './services/auth/auth-fake.service';
import { AuthTokenInterceptor } from './interceptors/auth-token.interceptor';
import { API_BASE } from './tokens/tokens';
import { ILocalizacionService } from './services/localizacion/ILocalizacionService';
import { LocalizacionesJsonService } from './services/localizacion/localizaciones-json.service';
import { ICategoriaService } from './services/categorias/ICategoriasService';
import { CategoriasJsonService } from './services/categorias/categorias-json.service';

//import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { LocalizacionesApiService } from './services/localizacion/localizaciones-api.service';

import { API_URL } from './tokens/token-formulario';
import { IFormulariosService } from './services/formularios/IFormulariosService';
import { FormulariosApiService } from './services/formularios/formularios-api.service';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
import { IReseniaService } from './services/resenias/IReseniaService';
import { ReseniaApiService } from './services/resenias/resenia-api.service';
import { ITokenService } from './services/token/ITokenService';
import { TokenApiService } from './services/token/token-api.service';
import { ISolicitudService } from './services/solicitudes/ISolicitudService';
import { SolicitudApiService } from './services/solicitudes/solicitud-api.service';

import { MatIconModule } from '@angular/material/icon';

import { CategoriasApiService } from './services/categorias/categorias-api.service';

//modificar esta ruta y poner la de la api SIN /api
const rutaBase = 'http://servidor.laravel/';

export const appConfig: ApplicationConfig = {
  providers: [
    {provide: IEmpresasService, useExisting: EmpresasApiService},
    {provide: IAuthenticationService, useExisting: AuthFakeService},
    {provide: ILocalizacionService, useExisting: LocalizacionesApiService},
    {provide: ICategoriaService, useExisting: CategoriasApiService},
    provideRouter(routes, withComponentInputBinding()),
    provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideAnimationsAsync(),
    importProvidersFrom(SweetAlert2Module.forRoot()),



    {provide: API_BASE, useValue: `${rutaBase}api`},


    {provide: API_URL, useValue: rutaBase},

    {provide: IFormulariosService, useExisting: FormulariosApiService},
    {provide: IReseniaService, useExisting: ReseniaApiService},
    {provide: ITokenService, useExisting: TokenApiService},
    {provide: ISolicitudService, useExisting: SolicitudApiService},
    {provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher},
    importProvidersFrom(SweetAlert2Module.forRoot()),


    MatIconModule,
    provideHttpClient(withInterceptors([AuthTokenInterceptor])),
    provideRouter(routes, withComponentInputBinding()),
    provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideAnimationsAsync(), provideAnimationsAsync()

   // provideHttpClient(withInterceptors([AuthTokenInterceptor])),
    //provideRouter(routes, withComponentInputBinding()),
    //provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), ////provideAnimationsAsync()

  ]
};

