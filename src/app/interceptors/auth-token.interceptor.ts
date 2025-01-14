import { HttpInterceptorFn } from '@angular/common/http';
import { IAuthenticationService } from '../services/auth/IAuthenticationService';
import { inject } from '@angular/core';

export const AuthTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(IAuthenticationService);
  const reqWithAuth = req.clone({
    headers : req.headers.set('Authorization' , `Bearer ${authService.token()}`)
  })

  return authService.token() ? next(reqWithAuth) : next(req);
};
