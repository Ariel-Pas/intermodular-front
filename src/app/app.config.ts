import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

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


export const appConfig: ApplicationConfig = {
  providers: [
    {provide: IEmpresasService, useExisting: EmpresasApiService},
    {provide: IAuthenticationService, useExisting: AuthFakeService},
    {provide: API_BASE, useValue: 'http://localhost:3000'},
    provideHttpClient(withInterceptors([AuthTokenInterceptor])),
    provideRouter(routes),
    provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes)
  ]
};
