import { Component, ChangeDetectorRef } from '@angular/core'; // <--- 1. Import ajouté
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-inscription',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './inscription.html',
  styleUrls: ['./inscription.css'],
})
export class Inscription {
  nouvelUtilisateur = {
    nom_utilisateur: '',
    telephone: '',
    email: '',
    mot_de_passe: '',
    confirm_mot_de_passe: '',
    role: 'membre', // Par défaut, un nouvel utilisateur est un membre
  };

  chargement = false;
  erreur: string | null = null;
  success = false;
  passwordVisible = false;
  confirmPasswordVisible = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef, // <--- 2. Injection du détecteur
  ) {}

  creerCompte() {
    if (this.chargement) return;

    // Validation
    if (this.nouvelUtilisateur.mot_de_passe !== this.nouvelUtilisateur.confirm_mot_de_passe) {
      this.erreur = 'Les mots de passe ne correspondent pas';
      return;
    }

    this.chargement = true;
    this.erreur = null;

    // Envoyer les données (sans la confirmation de mot de passe)
    const { confirm_mot_de_passe, ...data } = this.nouvelUtilisateur;

    // <--- 3. URL corrigée (suppression du slash final pour éviter les erreurs 307/404)
    this.http.post('http://localhost:8000/utilisateurs', data).subscribe({
      next: () => {
        this.success = true;
        this.chargement = false;

        // <--- 4. Forcer la mise à jour de l'écran (Arrête le spinner et affiche le succès)
        this.cdr.detectChanges();

        // Rediriger vers la page de connexion après 2 secondes
        setTimeout(() => {
          // Note : Vérifie si ta route est '/connexion' ou '/login' dans app.routes.ts
          this.router.navigate(['/connexion']);
        }, 2000);
      },
      error: (error) => {
        this.erreur = error.error?.detail || 'Erreur lors de la création du compte';
        this.chargement = false;

        // <--- 5. Forcer la mise à jour (Arrête le spinner et affiche l'erreur)
        this.cdr.detectChanges();
      },
    });
  }

  annuler() {
    this.router.navigate(['/connexion']);
  }

  basculerPasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  basculerConfirmPasswordVisibility() {
    this.confirmPasswordVisible = !this.confirmPasswordVisible;
  }

  genererMotDePasse() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 10; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    this.nouvelUtilisateur.mot_de_passe = password;
    this.nouvelUtilisateur.confirm_mot_de_passe = password;
  }
}
