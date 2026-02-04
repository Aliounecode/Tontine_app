import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Utilisateur } from '../../../models/modeles';

@Component({
  selector: 'app-liste-utilisateurs',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule], // Importer FormsModule pour ngModel
  templateUrl: './liste-utilisateurs.html',
  styleUrls: ['./liste-utilisateurs.css'],
})
export class ListeUtilisateurs implements OnInit {
  // Propriétés pour la gestion des utilisateurs
  utilisateurs: Utilisateur[] = [];
  chargement = true;
  recherche = '';
  page = 1;
  itemsParPage = 10;

  // Injecter HttpClient et ChangeDetectorRef
  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
  ) {}
  // Charger les utilisateurs au démarrage du composant
  ngOnInit() {
    this.chargerUtilisateurs();
  }

  // Méthode pour charger les utilisateurs depuis l'API
  chargerUtilisateurs() {
    this.chargement = true;
    this.http.get<Utilisateur[]>('http://localhost:8000/utilisateurs/').subscribe({
      next: (data) => {
        this.utilisateurs = data;
        this.chargement = false;

        // <--- 3. Forcer l'affichage de la liste
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Erreur lors du chargement des utilisateurs:', error);
        this.chargement = false;

        // <--- 4. Forcer l'arrêt du spinner en cas d'erreur
        this.cdr.detectChanges();
      },
    });
  }
  // Filtrer les utilisateurs en fonction de la recherche
  get utilisateursFiltres(): Utilisateur[] {
    if (!this.recherche) return this.utilisateurs;

    const searchLower = this.recherche.toLowerCase();
    return this.utilisateurs.filter(
      (u) =>
        u.nom_utilisateur.toLowerCase().includes(searchLower) ||
        u.email.toLowerCase().includes(searchLower) ||
        u.telephone.includes(this.recherche),
    );
  }
  // Obtenir les utilisateurs pour la page actuelle
  get utilisateursPagines(): Utilisateur[] {
    const start = (this.page - 1) * this.itemsParPage;
    return this.utilisateursFiltres.slice(start, start + this.itemsParPage);
  }
  // Calculer le nombre total de pages
  get nombrePages(): number {
    return Math.ceil(this.utilisateursFiltres.length / this.itemsParPage);
  }

  changerPage(nouvellePage: number) {
    if (nouvellePage >= 1 && nouvellePage <= this.nombrePages) {
      this.page = nouvellePage;
    }
  }
  // Supprimer un utilisateur
  supprimerUtilisateur(id: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      this.http.delete(`http://localhost:8000/utilisateurs/${id}`).subscribe({
        next: () => {
          alert('Utilisateur supprimé avec succès');
          this.chargerUtilisateurs(); // Recharge la liste
          this.cdr.detectChanges();
        },
        error: (err) => alert('Erreur lors de la suppression'),
      });
    }
  }
  // Obtenir l'indice de début et de fin pour l'affichage
  getIndiceDebut(): number {
    return (this.page - 1) * this.itemsParPage + 1;
  }

  getIndiceFin(): number {
    const fin = this.page * this.itemsParPage;
    return Math.min(fin, this.utilisateursFiltres.length);
  }
}
