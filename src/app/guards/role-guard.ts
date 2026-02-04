import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../utils/auth';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const requiredRoles = route.data['roles'] as Array<string>;

    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/connexion']);
      return false;
    }

    if (requiredRoles) {
      const user = this.authService.getCurrentUser();
      if (!user || !requiredRoles.includes(user.role)) {
        this.router.navigate(['/acces-refuse']);
        return false;
      }
    }

    return true;
  }
}
