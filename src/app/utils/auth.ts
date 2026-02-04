import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Utilisateur, Token } from '../models/modeles';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  getUser(): any {
    throw new Error('Method not implemented.');
  }
  private tokenKey = 'tontine_token';
  private userKey = 'tontine_user';

  constructor(private router: Router) {}

  saveAuthData(token: string, utilisateur: Utilisateur): void {
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.userKey, JSON.stringify(utilisateur));
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getCurrentUser(): Utilisateur | null {
    const userStr = localStorage.getItem(this.userKey);
    return userStr ? JSON.parse(userStr) : null;
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user ? user.role === role : false;
  }

  isAdminOrTresorier(): boolean {
    const user = this.getCurrentUser();
    return user ? ['admin', 'trésorier'].includes(user.role) : false;
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.router.navigate(['/connexion']);
  }

  canAccessRoute(requiredRole?: string): boolean {
    if (!this.isLoggedIn()) {
      return false;
    }

    if (!requiredRole) {
      return true;
    }

    return this.hasRole(requiredRole);
  }
}
