import { ResolveFn } from '@angular/router';
import { IEmpresaDisplay } from '../types';
import { inject } from '@angular/core';
import IEmpresasService from '../services/IEmpresasService';

export const empresaResolver: ResolveFn<IEmpresaDisplay | undefined> = (route, state) => {
  const servicioEmpresas = inject(IEmpresasService);
  return servicioEmpresas.getEmpresa(route.params['id']);
};
