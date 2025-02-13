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
    const currentRole = this.authService.sessionSubject.value?.activatedRole;

    if (currentRole !== expectedRole) {
      this.router.navigate(['/unauthorized']);
      return false;
    }
    return true;
  }
}
