import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthApiBetaService } from '../services/auth/auth-api-beta.service';

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
