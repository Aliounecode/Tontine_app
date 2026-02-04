import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // <--- 1. Import vital
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Membre } from '../../../models/modeles';

@Component({
  selector: 'app-liste-membres',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './liste-membres.html',
  styleUrls: ['./liste-membres.css'],
})
export class ListeMembres implements OnInit {
  // Propriétés de ListeMembres
  membres: Membre[] = [];
  tontineId: number | null = null;
  tontineNom: string = '';
  chargement = true;
  recherche = '';
  nouveauMembre = {
    id_utilisateur: '',
    position: 0,
  };

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private cdr: ChangeDetectorRef, // <--- 2. Injection du détecteur
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      // Recuperer l'ID de la tontine depuis les parametres de l'URL
      this.tontineId = +params['id']; // Le '+' assure que c'est bien un nombre
      this.chargerMembres();
      this.chargerDetailsTontine();
    });
  }

  chargerDetailsTontine() {
    if (!this.tontineId) return;

    this.http.get(`http://localhost:8000/tontines/${this.tontineId}`).subscribe({
      next: (tontine: any) => {
        this.tontineNom = tontine.nom;
        this.cdr.detectChanges(); // <--- 3. Mise à jour forcée
      },
      error: (error) => {
        console.error('Erreur lors du chargement de la tontine:', error);
        this.cdr.detectChanges(); // <--- Mise à jour forcée (même en erreur)
      },
    });
  }

  chargerMembres() {
    if (!this.tontineId) return;

    this.chargement = true;
    this.http.get<Membre[]>(`http://localhost:8000/tontines/${this.tontineId}/membres`).subscribe({
      next: (data) => {
        this.membres = data;
        this.chargement = false;
        // Définir la position par défaut pour le nouveau membre
        this.nouveauMembre.position = this.membres.length + 1;
        this.cdr.detectChanges(); // <--- 4. Mise à jour forcée (arrête le spinner)
      },
      error: (error) => {
        console.error('Erreur lors du chargement des membres:', error);
        this.chargement = false;
        this.cdr.detectChanges(); // <--- Arrête le spinner en erreur
      },
    });
  }
  // Filtrer les membres selon la recherche
  get membresFiltres(): Membre[] {
    if (!this.recherche) return this.membres; // Si pas de recherche, retourner tous les membres

    const searchLower = this.recherche.toLowerCase();
    return this.membres.filter((m) => m.id_utilisateur.toString().includes(this.recherche));
  }

  ajouterMembre() {
    if (!this.tontineId || !this.nouveauMembre.id_utilisateur) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    const nouveauMembre = {
      id_tontine: this.tontineId,
      id_utilisateur: parseInt(this.nouveauMembre.id_utilisateur),
      position: this.nouveauMembre.position,
      date_adhesion: new Date().toISOString().split('T')[0],
    };

    this.http.post('http://localhost:8000/membres', nouveauMembre).subscribe({
      next: () => {
        alert('Membre ajouté avec succès !');
        this.chargerMembres();
        this.nouveauMembre = {
          id_utilisateur: '',
          position: this.membres.length + 2,
        };
        this.cdr.detectChanges(); // <--- 6. Mise à jour forcée
      },
      error: (error) => {
        alert(error.error?.detail || "Erreur lors de l'ajout du membre");
        this.cdr.detectChanges(); // <--- Mise à jour forcée
      },
    });
  }

  retirerMembre(membreId: number) {
    if (confirm('Êtes-vous sûr de vouloir retirer ce membre ?')) {
      this.http.delete(`http://localhost:8000/membres/${membreId}`).subscribe({
        next: () => {
          alert('Membre retiré avec succès !');
          this.chargerMembres();
        },
        error: (error) => {
          alert(error.error?.detail || 'Erreur lors du retrait du membre');
        },
      });
    }
  }

  calculerJoursDepuis(date: string): number {
    const dateAdhesion = new Date(date);
    const aujourdhui = new Date();
    const diffTime = Math.abs(aujourdhui.getTime() - dateAdhesion.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  modifierPosition(membre: Membre) {
    const nouvellePosition = prompt(
      `Nouvelle position pour le membre #${membre.id_utilisateur} :`,
      membre.position.toString(),
    );
    if (nouvellePosition) {
      const positionNum = parseInt(nouvellePosition);
      if (!isNaN(positionNum)) {
        this.reordonnerMembre(membre.id, positionNum);
      }
    }
  }

  calculerNombreMembres(): number {
    // Retourne le nombre total de membres
    return this.membres.length;
  }

  getMembreParPosition(position: number): Membre | undefined {
    return this.membres.find((m) => m.position === position); // Retourne le membre à la position donnée
  }

  getPositionDisponible(): number {
    const positions = this.membres.map((m) => m.position).sort((a, b) => a - b); // Trier les positions existantes
    let position = 1;

    for (const pos of positions) {
      if (pos === position) {
        position++;
      } else {
        break;
      }
    }

    return position;
  }

  reordonnerMembre(membreId: number, nouvellePosition: number) {
    if (nouvellePosition < 1 || nouvellePosition > this.membres.length) {
      alert('Position invalide');
      return;
    }

    this.http
      .patch(`http://localhost:8000/membres/${membreId}`, { position: nouvellePosition })
      .subscribe({
        next: () => {
          alert(`Membre ${membreId} déplacé à la position ${nouvellePosition}`);
          this.chargerMembres(); // Recharger les membres après modification
        },
        error: (error) => {
          alert(error.error?.detail || 'Erreur lors du déplacement du membre');
        },
      });
  }

  genererOrdrePassage(): Membre[] {
    return [...this.membres].sort((a, b) => a.position - b.position); // Retourne une nouvelle liste triée par position
  }
}
