import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-formulaire-utilisateur',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './formulaire-utilisateur.html',
  styleUrls: ['./formulaire-utilisateur.css'],
})
export class FormulaireUtilisateur {
  nouvelUtilisateur = {
    nom_utilisateur: '',
    telephone: '',
    email: '',
    mot_de_passe: '',
    confirm_mot_de_passe: '',
    role: 'membre',
  };

  chargement = false;
  erreur: string | null = null;
  success = false;
  passwordVisible = false;
  confirmPasswordVisible = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef, // <--- 1. Injection de l'outil de détection
  ) {}

  validerFormulaire(): boolean {
    this.erreur = null;

    if (!this.nouvelUtilisateur.nom_utilisateur.trim()) {
      this.erreur = "Le nom d'utilisateur est requis";
      return false;
    }

    if (!this.nouvelUtilisateur.telephone.match(/^[0-9]{9,}$/)) {
      this.erreur = 'Numéro de téléphone invalide';
      return false;
    }

    if (!this.nouvelUtilisateur.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      this.erreur = 'Email invalide';
      return false;
    }

    if (this.nouvelUtilisateur.mot_de_passe.length < 6) {
      this.erreur = 'Le mot de passe doit contenir au moins 6 caractères';
      return false;
    }

    if (this.nouvelUtilisateur.mot_de_passe !== this.nouvelUtilisateur.confirm_mot_de_passe) {
      this.erreur = 'Les mots de passe ne correspondent pas';
      return false;
    }

    return true;
  }

  creerUtilisateur() {
    if (this.chargement) return;

    if (!this.validerFormulaire()) {
      return;
    }

    this.chargement = true;
    this.success = false;

    const { confirm_mot_de_passe, ...data } = this.nouvelUtilisateur;

    this.http.post('http://localhost:8000/utilisateurs', data).subscribe({
      next: () => {
        this.success = true;
        this.chargement = false;

        // <--- 2. FORCER LA MISE A JOUR (Succès)
        this.cdr.detectChanges();

        setTimeout(() => {
          this.router.navigate(['/utilisateurs']);
        }, 2000);
      },
      error: (error) => {
        this.erreur = error.error?.detail || 'Erreur lors de la création';
        this.chargement = false;

        // <--- 3. FORCER LA MISE A JOUR (Erreur)
        this.cdr.detectChanges();
      },
    });
  }

  annuler() {
    this.router.navigate(['/utilisateurs']);
  }

  basculerPasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  basculerConfirmPasswordVisibility() {
    this.confirmPasswordVisible = !this.confirmPasswordVisible;
  }

  genererMotDePasse() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    this.nouvelUtilisateur.mot_de_passe = password;
    this.nouvelUtilisateur.confirm_mot_de_passe = password;
  }
}
