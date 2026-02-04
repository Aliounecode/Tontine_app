import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Paiement } from '../../../models/modeles';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-liste-paiements',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './liste-paiements.html',
  styleUrls: ['./liste-paiements.css'],
})
export class ListePaiements implements OnInit {
  // Propriétés de la classe ListePaiements
  paiements: Paiement[] = [];
  tontineId: number | null = null;
  tontineNom: string = '';
  chargement = true;
  recherche = '';
  filtrePeriode: string = '';
  totalPaiements = 0;
  moyennePaiement = 0;
  nombrePaiements = 0;
  nouveauPaiement = {
    montant: 0,
    periode: 1,
  };

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.tontineId = +params['id']; // Conversion propre en nombre
      this.chargerPaiements();
      this.chargerDetailsTontine();
    });
  }

  chargerDetailsTontine() {
    if (!this.tontineId) return;

    this.http.get(`http://localhost:8000/tontines/${this.tontineId}`).subscribe({
      next: (tontine: any) => {
        this.tontineNom = tontine.nom;
        this.nouveauPaiement.montant = tontine.montant_cotisation;
        this.cdr.detectChanges(); // <--- 3. Mise à jour écran
      },
      error: (error) => {
        console.error('Erreur lors du chargement de la tontine:', error);
        this.cdr.detectChanges();
      },
    });
  }

  chargerPaiements() {
    if (!this.tontineId) return;

    this.chargement = true;
    this.http
      .get<Paiement[]>(`http://localhost:8000/tontines/${this.tontineId}/paiements`)
      .subscribe({
        next: (data) => {
          this.paiements = data;
          this.calculerStatistiques();
          this.chargement = false;
          this.cdr.detectChanges(); // <--- Arrêt du spinner
        },
        error: (error) => {
          console.error('Erreur lors du chargement des paiements:', error);
          this.chargement = false;
          this.cdr.detectChanges(); // <--- Arrêt du spinner (erreur)
        },
      });
  }

  get paiementsFiltres(): Paiement[] {
    let resultats = this.paiements;

    // Filtre par recherche
    if (this.recherche) {
      const searchLower = this.recherche.toLowerCase();
      resultats = resultats.filter(
        (p) =>
          p.id_utilisateur.toString().includes(this.recherche) ||
          p.montant.toString().includes(this.recherche),
      );
    }

    // Filtre par période
    if (this.filtrePeriode) {
      if (this.filtrePeriode === 'mois') {
        const maintenant = new Date();
        const debutMois = new Date(maintenant.getFullYear(), maintenant.getMonth(), 1);
        resultats = resultats.filter((p) => new Date(p.date_versement) >= debutMois);
      } else if (this.filtrePeriode === 'semaine') {
        const maintenant = new Date();
        const debutSemaine = new Date(maintenant);
        debutSemaine.setDate(maintenant.getDate() - maintenant.getDay());
        resultats = resultats.filter((p) => new Date(p.date_versement) >= debutSemaine);
      }
    }

    // Trier par date décroissante
    return resultats.sort(
      (a, b) => new Date(b.date_versement).getTime() - new Date(a.date_versement).getTime(),
    );
  }
  // Méthode pour calculer les statistiques des paiements
  calculerStatistiques() {
    this.totalPaiements = this.paiements.reduce((sum, p) => sum + p.montant, 0);
    this.nombrePaiements = this.paiements.length;
    this.moyennePaiement =
      this.nombrePaiements > 0 ? this.totalPaiements / this.nombrePaiements : 0;
  }
  // Méthode pour enregistrer un nouveau paiement
  effectuerPaiement() {
    if (!this.tontineId || this.nouveauPaiement.montant <= 0) {
      alert('Montant invalide');
      return;
    }

    const paiement = {
      id_tontine: this.tontineId,
      montant: this.nouveauPaiement.montant,
      periode: this.nouveauPaiement.periode,
    };

    this.http.post('http://localhost:8000/paiements', paiement).subscribe({
      next: () => {
        alert('Paiement enregistré avec succès !');
        this.chargerPaiements();
        this.nouveauPaiement = {
          montant: 0,
          periode: this.nouveauPaiement.periode + 1,
        };
        this.cdr.detectChanges(); // <--- Mise à jour écran
      },
      error: (error) => {
        alert(error.error?.detail || "Erreur lors de l'enregistrement du paiement");
        this.cdr.detectChanges(); // <--- Mise à jour écran
      },
    });
  }

  getPeriodesDisponibles(): number[] {
    const periodes = this.paiements.map((p) => p.periode);
    if (periodes.length === 0) return [1];

    const maxPeriode = Math.max(...periodes);
    const result = [];
    for (let i = 1; i <= maxPeriode + 1; i++) {
      result.push(i);
    }
    return result;
  }

  getCouleurStatut(paiement: Paiement): string {
    const datePaiement = new Date(paiement.date_versement);
    const maintenant = new Date();
    const diffJours = (maintenant.getTime() - datePaiement.getTime()) / (1000 * 3600 * 24);

    if (diffJours <= 1) return 'success';
    if (diffJours <= 7) return 'warning';
    return 'secondary';
  }

  getTexteStatut(paiement: Paiement): string {
    const datePaiement = new Date(paiement.date_versement);
    const maintenant = new Date();
    const diffJours = Math.floor(
      (maintenant.getTime() - datePaiement.getTime()) / (1000 * 3600 * 24),
    );

    if (diffJours === 0) return "Aujourd'hui";
    if (diffJours === 1) return 'Hier';
    if (diffJours < 7) return `Il y a ${diffJours} jours`;
    if (diffJours < 30) return `Il y a ${Math.floor(diffJours / 7)} semaines`;
    return `Il y a ${Math.floor(diffJours / 30)} mois`;
  }

  exporterPaiements() {
    // TODO: Implémenter l'export
    alert('Export des paiements (fonctionnalité à implémenter)');
  }

  getSommeParPeriode(): { periode: number; somme: number }[] {
    const sommes: { [periode: number]: number } = {};

    this.paiements.forEach((p) => {
      sommes[p.periode] = (sommes[p.periode] || 0) + p.montant;
    });

    return Object.entries(sommes)
      .map(([periode, somme]) => ({
        periode: parseInt(periode),
        somme,
      }))
      .sort((a, b) => a.periode - b.periode);
  }

  getCouleurPeriode(periode: number): string {
    const couleurs = [
      '#007bff',
      '#6610f2',
      '#6f42c1',
      '#e83e8c',
      '#dc3545',
      '#fd7e14',
      '#ffc107',
      '#28a745',
      '#20c997',
      '#17a2b8',
    ];
    return couleurs[(periode - 1) % couleurs.length];
  }
}
