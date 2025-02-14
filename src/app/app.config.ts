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
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { MatIconModule } from '@angular/material/icon';


export const appConfig: ApplicationConfig = {
  providers: [
    {provide: IEmpresasService, useExisting: EmpresasFakerService},
    {provide: IAuthenticationService, useExisting: AuthFakeService},
    {provide: ILocalizacionService, useExisting: LocalizacionesJsonService},
    {provide: ICategoriaService, useExisting: CategoriasJsonService},
    {provide: API_BASE, useValue: 'http://localhost:3000'},
    // DEBORA NOBS
    {provide: API_URL, useValue: 'http://localhost:8000/'},
    {provide: IFormulariosService, useExisting: FormulariosApiService},
    {provide: IReseniaService, useExisting: ReseniaApiService},
    {provide: ITokenService, useExisting: TokenApiService},
    {provide: ISolicitudService, useExisting: SolicitudApiService},
    {provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher},
    importProvidersFrom(SweetAlert2Module.forRoot()),
    // DEBORA NOBS
    MatIconModule,
    provideHttpClient(withInterceptors([AuthTokenInterceptor])),
    provideRouter(routes, withComponentInputBinding()),
    provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideAnimationsAsync(), provideAnimationsAsync()
  ]
};

