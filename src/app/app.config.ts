import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import IEmpresasService from './services/IEmpresasService';
import { EmpresasFakerService } from './services/empresas-faker.service';
import { EmpresasJsonService } from './services/empresas-json.service';
import { provideHttpClient } from '@angular/common/http';
import { EmpresasApiService } from './services/empresas-api.service';


export const appConfig: ApplicationConfig = {
  providers: [
    {provide: IEmpresasService, useExisting: EmpresasApiService},
    provideHttpClient(),
    provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes)
  ]
};
