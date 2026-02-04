import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../utils/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const requiredRole = route.data['role'];

    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/connexion']);
      return false;
    }

    if (requiredRole && !this.authService.canAccessRoute(requiredRole)) {
      // Rediriger vers une page d'accès refusé ou l'accueil
      this.router.navigate(['/acces-refuse']);
      return false;
    }

    return true;
  }
}
