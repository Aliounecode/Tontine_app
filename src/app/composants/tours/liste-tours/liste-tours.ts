import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // <--- 1. Import vital
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Tour, Membre } from '../../../models/modeles';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-liste-tours',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './liste-tours.html',
  styleUrls: ['./liste-tours.css'],
})
export class ListeTours implements OnInit {
  tours: Tour[] = [];
  membres: Membre[] = [];
  tontineId: number | null = null;
  tontineNom: string = '';
  chargement = true;
  recherche = '';
  totalDistribue = 0;
  nombreTours = 0;
  nouveauTour = {
    id_utilisateur: '',
    periode: 1,
    montant_recu: 0,
  };

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private cdr: ChangeDetectorRef, // <--- 2. Injection du détecteur
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.tontineId = +params['id']; // Conversion en nombre pour être propre
      this.chargerTours();
      this.chargerMembres();
      this.chargerDetailsTontine();
    });
  }

  chargerDetailsTontine() {
    if (!this.tontineId) return;

    this.http.get(`http://localhost:8000/tontines/${this.tontineId}`).subscribe({
      next: (tontine: any) => {
        this.tontineNom = tontine.nom;
        this.nouveauTour.montant_recu = tontine.montant_cotisation * tontine.nombre_max_membres;
        this.cdr.detectChanges(); // <--- 3. Mise à jour écran
      },
      error: (error) => {
        console.error('Erreur lors du chargement de la tontine:', error);
        this.cdr.detectChanges();
      },
    });
  }

  chargerTours() {
    if (!this.tontineId) return;

    this.chargement = true;
    this.http.get<Tour[]>(`http://localhost:8000/tontines/${this.tontineId}/tours`).subscribe({
      next: (data) => {
        this.tours = data;
        this.calculerStatistiques();
        this.chargement = false;
        this.cdr.detectChanges(); // <--- Arrête le spinner
      },
      error: (error) => {
        console.error('Erreur lors du chargement des tours:', error);
        this.chargement = false;
        this.cdr.detectChanges(); // <--- Arrête le spinner en erreur
      },
    });
  }

  chargerMembres() {
    if (!this.tontineId) return;

    this.http.get<Membre[]>(`http://localhost:8000/tontines/${this.tontineId}/membres`).subscribe({
      next: (data) => {
        this.membres = data;
        this.cdr.detectChanges(); // <--- Mise à jour liste déroulante membres
      },
      error: (error) => {
        console.error('Erreur lors du chargement des membres:', error);
        this.cdr.detectChanges();
      },
    });
  }

  get toursFiltres(): Tour[] {
    let resultats = this.tours;

    if (this.recherche) {
      resultats = resultats.filter(
        (t) =>
          t.id_utilisateur.toString().includes(this.recherche) ||
          t.periode.toString().includes(this.recherche),
      );
    }

    return resultats.sort((a, b) => b.periode - a.periode);
  }

  calculerStatistiques() {
    this.totalDistribue = this.tours.reduce((sum, t) => sum + t.montant_recu, 0);
    this.nombreTours = this.tours.length;
  }

  attribuerTour() {
    if (!this.tontineId || !this.nouveauTour.id_utilisateur) {
      alert('Veuillez sélectionner un membre');
      return;
    }

    if (this.nouveauTour.montant_recu <= 0) {
      alert('Montant invalide');
      return;
    }

    const tour = {
      id_tontine: this.tontineId,
      id_utilisateur: parseInt(this.nouveauTour.id_utilisateur),
      periode: this.nouveauTour.periode,
      montant_recu: this.nouveauTour.montant_recu,
    };

    // <--- 4. CORRECTION URL (PAS DE SLASH A LA FIN)
    this.http.post('http://localhost:8000/tours', tour).subscribe({
      next: () => {
        alert('Tour attribué avec succès !');
        this.chargerTours();
        this.nouveauTour = {
          id_utilisateur: '',
          periode: this.nouveauTour.periode + 1,
          montant_recu: this.nouveauTour.montant_recu,
        };
        this.cdr.detectChanges(); // <--- Mise à jour écran
      },
      error: (error) => {
        alert(error.error?.detail || "Erreur lors de l'attribution du tour");
        this.cdr.detectChanges(); // <--- Mise à jour écran
      },
    });
  }

  getPeriodesDisponibles(): number[] {
    const periodes = this.tours.map((t) => t.periode);
    if (periodes.length === 0) return [1];

    const maxPeriode = Math.max(...periodes);
    const result = [];
    for (let i = 1; i <= maxPeriode + 1; i++) {
      result.push(i);
    }
    return result;
  }

  getMembresDisponibles(): Membre[] {
    return this.membres.sort((a, b) => a.position - b.position);
  }

  getCouleurPeriode(periode: number): string {
    const couleurs = ['primary', 'success', 'info', 'warning', 'danger'];
    return couleurs[(periode - 1) % couleurs.length];
  }

  getMembreParId(id: number): Membre | undefined {
    return this.membres.find((m) => m.id_utilisateur === id);
  }

  getPositionMembre(id: number): number {
    const membre = this.getMembreParId(id);
    return membre ? membre.position : 0;
  }

  getToursParMembre(): { id_utilisateur: number; tours: number; montant: number }[] {
    const result: { [key: number]: { tours: number; montant: number } } = {};

    this.tours.forEach((t) => {
      if (!result[t.id_utilisateur]) {
        result[t.id_utilisateur] = { tours: 0, montant: 0 };
      }
      result[t.id_utilisateur].tours++;
      result[t.id_utilisateur].montant += t.montant_recu;
    });

    return Object.entries(result)
      .map(([id, data]) => ({
        id_utilisateur: parseInt(id),
        tours: data.tours,
        montant: data.montant,
      }))
      .sort((a, b) => b.tours - a.tours);
  }

  getProchainMembre(): Membre | null {
    if (this.membres.length === 0) return null;

    const membresAvecTour = new Set(this.tours.map((t) => t.id_utilisateur));
    const membresSansTour = this.membres.filter((m) => !membresAvecTour.has(m.id_utilisateur));

    if (membresSansTour.length === 0) return null;

    // Retourner le membre avec la plus petite position qui n'a pas encore eu de tour
    return membresSansTour.sort((a, b) => a.position - b.position)[0];
  }

  exporterTours() {
    // TODO: Implémenter l'export
    alert('Export des tours (fonctionnalité à implémenter)');
  }
}
