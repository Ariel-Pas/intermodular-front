import { ResolveFn } from '@angular/router';
import { IEmpresaCompleta, IEmpresaDisplay } from '../types';
import { inject } from '@angular/core';
import IEmpresasService from '../services/IEmpresasService';
import { IAuthenticationService } from '../services/auth/IAuthenticationService';
import { AuthApiBetaService } from '../services/auth/auth-api-beta.service';

export const empresaResolver: ResolveFn<IEmpresaCompleta | undefined> = (route, state) => {
  const servicioEmpresas = inject(IEmpresasService);
  const authService = inject(AuthApiBetaService);
  if(authService.currentToken != null)
    return servicioEmpresas.getEmpresa(route.params['id']);

  return servicioEmpresas.getEmpresaByToken(route.params['id']);
};
