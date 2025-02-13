import { Injectable } from '@angular/core';
import { CanActivate, CanActivateFn, Router } from '@angular/router';
import { AuthApiBetaService } from '../services/auth/auth-api-beta.service';

// export const authguardGuard: CanActivateFn = (route, state) => {
//   return true;
// };

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthApiBetaService, private router: Router) {}

  canActivate(): boolean {
    if (!this.authService.currentToken) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}
