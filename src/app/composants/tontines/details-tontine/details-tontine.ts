import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // <--- 1. Import vital
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Tontine, StatistiquesTontine, Membre, Paiement, Tour } from '../../../models/modeles';

@Component({
  selector: 'app-details-tontine',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './details-tontine.html',
  styleUrls: ['./details-tontine.css'],
})
export class DetailsTontine implements OnInit {
  tontine: Tontine | null = null;
  statistiques: StatistiquesTontine | null = null;
  derniersPaiements: Paiement[] = [];
  derniersTours: Tour[] = [];
  membres: Membre[] = [];
  chargement = true;
  idTontine: number | null = null;
  ongletActif = 'informations';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private cdr: ChangeDetectorRef, // <--- 2. Injection
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.idTontine = +params['id']; // Le '+' pour convertir en nombre
      this.chargerDonnees();
    });
  }

  chargerDonnees() {
    if (!this.idTontine) return;

    this.chargement = true;

    // Charger la tontine
    this.http.get<Tontine>(`http://localhost:8000/tontines/${this.idTontine}`).subscribe({
      next: (tontine) => {
        this.tontine = tontine;
        // Une fois la tontine chargée, on lance les autres requêtes
        this.chargerStatistiques();
        this.chargerMembres();
        this.chargerPaiements();
        this.chargerTours();
        this.cdr.detectChanges(); // <--- 3. Mise à jour écran (Tontine chargée)
      },
      error: (error) => {
        console.error('Erreur lors du chargement de la tontine:', error);
        this.chargement = false;
        this.cdr.detectChanges(); // <--- Mise à jour (Erreur)
      },
    });
  }

  chargerStatistiques() {
    if (!this.idTontine) return;

    this.http
      .get<StatistiquesTontine>(`http://localhost:8000/tontines/${this.idTontine}/statistiques`)
      .subscribe({
        next: (stats) => {
          this.statistiques = stats;
          this.cdr.detectChanges(); // <--- Mise à jour (Stats chargées)
        },
        error: (error) => {
          console.error('Erreur lors du chargement des statistiques:', error);
          this.cdr.detectChanges();
        },
      });
  }

  chargerMembres() {
    if (!this.idTontine) return;

    this.http.get<Membre[]>(`http://localhost:8000/tontines/${this.idTontine}/membres`).subscribe({
      next: (membres) => {
        this.membres = membres;
        this.cdr.detectChanges(); // <--- Mise à jour (Membres chargés)
      },
      error: (error) => {
        console.error('Erreur lors du chargement des membres:', error);
        this.cdr.detectChanges();
      },
    });
  }

  chargerPaiements() {
    if (!this.idTontine) return;

    this.http
      .get<Paiement[]>(`http://localhost:8000/tontines/${this.idTontine}/paiements`)
      .subscribe({
        next: (paiements) => {
          this.derniersPaiements = paiements.slice(0, 5);
          this.cdr.detectChanges(); // <--- Mise à jour (Paiements chargés)
        },
        error: (error) => {
          console.error('Erreur lors du chargement des paiements:', error);
          this.cdr.detectChanges();
        },
      });
  }

  chargerTours() {
    if (!this.idTontine) return;

    this.http.get<Tour[]>(`http://localhost:8000/tontines/${this.idTontine}/tours`).subscribe({
      next: (tours) => {
        this.derniersTours = tours.slice(0, 5);
        this.chargement = false; // <--- C'est ici que le chargement global se termine
        this.cdr.detectChanges(); // <--- Mise à jour FINALE (Arrête le spinner)
      },
      error: (error) => {
        console.error('Erreur lors du chargement des tours:', error);
        this.chargement = false;
        this.cdr.detectChanges(); // <--- Mise à jour (Erreur)
      },
    });
  }

  changerOnglet(onglet: string) {
    this.ongletActif = onglet;
    // Pas besoin de CDR ici car c'est un évènement utilisateur direct (click), Angular gère généralement bien
    // Mais si ça bug, tu peux ajouter this.cdr.detectChanges();
  }

  getStatutTontine(): string {
    if (!this.tontine) return '';

    const dateDebut = new Date(this.tontine.date_demarrage);
    const aujourdhui = new Date();

    if (dateDebut > aujourdhui) {
      return 'À venir';
    } else {
      return 'En cours';
    }
  }

  getCouleurStatut(statut: string): string {
    switch (statut) {
      case 'À venir':
        return 'warning';
      case 'En cours':
        return 'success';
      case 'Terminée':
        return 'secondary';
      default:
        return 'light';
    }
  }

  getIconeFrequence(frequence: string): string {
    switch (frequence) {
      case 'journalier':
        return 'bi-calendar-day';
      case 'hebdomadaire':
        return 'bi-calendar-week';
      case 'mensuel':
        return 'bi-calendar-month';
      default:
        return 'bi-calendar';
    }
  }

  calculerProchaineCotisation(): Date {
    const aujourdhui = new Date();
    const prochaineDate = new Date(aujourdhui);

    if (!this.tontine) return prochaineDate;

    switch (this.tontine.frequence) {
      case 'journalier':
        prochaineDate.setDate(aujourdhui.getDate() + 1);
        break;
      case 'hebdomadaire':
        prochaineDate.setDate(aujourdhui.getDate() + 7);
        break;
      case 'mensuel':
        prochaineDate.setMonth(aujourdhui.getMonth() + 1);
        break;
    }

    return prochaineDate;
  }

  getMembreActuel(): string {
    if (this.membres.length === 0) return 'Aucun';

    const membreActuel = this.membres.find((m) => m.position === 1);
    return membreActuel ? `Membre #${membreActuel.id_utilisateur}` : 'Aucun';
  }

  getProchainMembre(): string {
    if (this.membres.length < 2) return 'Aucun';

    const prochainMembre = this.membres.find((m) => m.position === 2);
    return prochainMembre ? `Membre #${prochainMembre.id_utilisateur}` : 'Aucun';
  }
}
