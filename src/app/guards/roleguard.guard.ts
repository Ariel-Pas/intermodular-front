import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, CanMatch, Route, Router, UrlSegment } from '@angular/router';
import { AuthApiBetaService } from '../services/auth/auth-api-beta.service';
import { role } from '../types';

// export const roleguardGuard: CanActivateFn = (route, state) => {
//   return true;
// };

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanMatch {
  constructor(private authService: AuthApiBetaService, private router: Router) {}

  canMatch(route: Route, segments: UrlSegment[]): boolean {
    const expectedRole = route.data?.['expectedRole'] as role;
    const currentRole = this.authService.sesionSubject.value?.activatedRole;

    if(!currentRole){
      this.router.navigate(['/select-role']);
      return false;
    }

    //Permitir el acceso si el rol esperado es el activado o si el usuario tiene Admin
    if(currentRole === expectedRole || this.authService.hasRole('Admin')){
      return true;
    }

    this.router.navigate(['/unauthorized']);
    return false;
  }
}
