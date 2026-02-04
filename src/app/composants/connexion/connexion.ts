import { Component, ChangeDetectorRef } from '@angular/core'; // <--- 1. Import ajouté
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../utils/auth';

@Component({
  selector: 'app-connexion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './connexion.html',
  styleUrls: ['./connexion.css'],
})
export class Connexion {
  loginData = {
    telephone: '',
    mot_de_passe: '',
  };

  chargement = false;
  erreur: string | null = null;
  passwordVisible = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    private cdr: ChangeDetectorRef, // <--- 2. Injection du détecteur
  ) {}

  seConnecter() {
    if (this.chargement) return;

    this.chargement = true;
    this.erreur = null;

    this.http.post('http://localhost:8000/login', this.loginData).subscribe({
      next: (response: any) => {
        // Sauvegarder les données d'authentification
        this.authService.saveAuthData(response.access_token, response.utilisateur);

        // Arrêter le chargement et mettre à jour la vue avant la redirection
        this.chargement = false;
        this.cdr.detectChanges(); // <--- 3. Mise à jour forcée (Succès)

        // Rediriger selon le rôle
        this.redirigerSelonRole(response.utilisateur.role);
      },
      error: (error) => {
        this.erreur = error.error?.detail || 'Erreur de connexion';

        this.chargement = false;
        this.cdr.detectChanges(); // <--- 4. Mise à jour forcée (Erreur) - Le spinner s'arrête ici
      },
    });
  }

  redirigerSelonRole(role: string) {
    switch (role) {
      case 'admin':
        this.router.navigate(['/admin/utilisateurs']);
        break;
      case 'trésorier':
        this.router.navigate(['/tontines']);
        break;
      case 'membre':
        this.router.navigate(['/mes-tontines']);
        break;
      default:
        this.router.navigate(['/']);
    }
  }

  basculerPasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  demarrerInscription() {
    this.router.navigate(['/inscription']);
  }
}
