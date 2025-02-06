import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import IEmpresasService from './services/IEmpresasService';
import { EmpresasFakerService } from './services/empresas-faker.service';
import { EmpresasJsonService } from './services/empresas-json.service';
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
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { LocalizacionesApiService } from './services/localizacion/localizaciones-api.service';


export const appConfig: ApplicationConfig = {
  providers: [
    {provide: IEmpresasService, useExisting: EmpresasFakerService},
    {provide: IAuthenticationService, useExisting: AuthFakeService},
    {provide: ILocalizacionService, useExisting: LocalizacionesJsonService},
    {provide: ICategoriaService, useExisting: CategoriasJsonService},
    {provide: API_BASE, useValue: 'http://servidor.laravel/api'},
    provideHttpClient(withInterceptors([AuthTokenInterceptor])),
    provideRouter(routes, withComponentInputBinding()),
    provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideAnimationsAsync(),
    importProvidersFrom(SweetAlert2Module.forRoot()),

  ]
};
