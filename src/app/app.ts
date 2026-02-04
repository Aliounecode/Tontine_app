import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { AuthService } from './utils/auth'; // <--- Ton chemin correct
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class App implements OnInit {
  utilisateurConnecte: any = null;
  menuItems: any[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.mettreAJourMenu();

    // Écouter les changements de page
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      this.mettreAJourMenu();
    });
  }

  mettreAJourMenu() {
    // CORRECTION ICI : getCurrentUser() au lieu de getUser()
    this.utilisateurConnecte = this.authService.getCurrentUser();

    if (this.utilisateurConnecte) {
      const role = this.utilisateurConnecte.role;

      if (role === 'admin') {
        this.menuItems = [
          { path: '/admin/utilisateurs', label: 'Utilisateurs', icon: 'bi-people' },
          { path: '/tontines', label: 'Tontines', icon: 'bi-cash-stack' },
        ];
      } else if (role === 'trésorier') {
        this.menuItems = [{ path: '/tontines', label: 'Gestion Tontines', icon: 'bi-cash-stack' }];
      } else {
        // Membre
        this.menuItems = [{ path: '/mes-tontines', label: 'Mes Tontines', icon: 'bi-wallet2' }];
      }
    } else {
      this.menuItems = [];
    }
  }

  seDeconnecter() {
    this.authService.logout();
    this.mettreAJourMenu();
  }

  get estConnecte(): boolean {
    return !!this.utilisateurConnecte;
  }

  get nomUtilisateur(): string {
    return this.utilisateurConnecte?.nom_utilisateur || 'Utilisateur';
  }

  get roleUtilisateur(): string {
    return this.utilisateurConnecte?.role || '';
  }
}
