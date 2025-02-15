import { HttpInterceptorFn } from '@angular/common/http';
import { IAuthenticationService } from '../services/auth/IAuthenticationService';
import { inject } from '@angular/core';
import { AuthApiBetaService } from '../services/auth/auth-api-beta.service';

export const AuthTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthApiBetaService);
  const reqWithAuth = req.clone({
    headers : req.headers
      .append('Authorization' , `Bearer ${authService.currentToken}`)
      .append('Accept', 'application/json')

  })

  return authService.currentToken ? next(reqWithAuth) : next(req);
};
