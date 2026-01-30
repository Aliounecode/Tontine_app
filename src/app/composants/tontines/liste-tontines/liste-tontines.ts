import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // <--- 1. Import
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Tontine } from '../../../models/modeles';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-liste-tontines',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './liste-tontines.html',
  styleUrls: ['./liste-tontines.css'],
})
export class ListeTontines implements OnInit {
  tontines: Tontine[] = [];
  chargement = true;
  recherche = '';
  filtreFrequence = 'tous';
  triPar = 'date_creation';
  ordre = 'desc';

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef, // <--- 2. Injection indispensable
  ) {}

  ngOnInit() {
    this.chargerTontines();
  }

  chargerTontines() {
    this.chargement = true;

    // <--- 3. URL CORRIGÉE (Pas de slash à la fin !)
    this.http.get<Tontine[]>('http://localhost:8000/tontines').subscribe({
      next: (data) => {
        this.tontines = data;
        this.chargement = false;
        this.cdr.detectChanges(); // <--- 4. Mise à jour forcée de l'écran
      },
      error: (error) => {
        console.error('Erreur lors du chargement des tontines:', error);
        this.chargement = false;
        this.cdr.detectChanges(); // <--- Arrêt du spinner même en cas d'erreur
      },
    });
  }

  supprimerTontine(id: number) {
    if (confirm('Attention : cela supprimera tous les paiements et membres liés. Confirmer ?')) {
      this.http.delete(`http://localhost:8000/tontines/${id}`).subscribe({
        next: () => {
          this.chargerTontines();
          this.cdr.detectChanges();
        },
        error: (err) => alert('Erreur lors de la suppression'),
      });
    }
  }

  get tontinesFiltrees(): Tontine[] {
    let resultats = this.tontines;

    // Filtre par recherche
    if (this.recherche) {
      const searchLower = this.recherche.toLowerCase();
      resultats = resultats.filter(
        (t) =>
          t.nom.toLowerCase().includes(searchLower) ||
          t.description?.toLowerCase().includes(searchLower),
      );
    }

    // Filtre par fréquence
    if (this.filtreFrequence !== 'tous') {
      resultats = resultats.filter((t) => t.frequence === this.filtreFrequence);
    }

    // Tri
    resultats.sort((a, b) => {
      let aValue: any, bValue: any;

      if (this.triPar === 'nom') {
        aValue = a.nom;
        bValue = b.nom;
      } else if (this.triPar === 'montant_cotisation') {
        aValue = a.montant_cotisation;
        bValue = b.montant_cotisation;
      } else {
        aValue = new Date(a.date_creation).getTime();
        bValue = new Date(b.date_creation).getTime();
      }

      if (this.ordre === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return resultats;
  }

  get frequencesDisponibles(): string[] {
    const frequences = this.tontines.map((t) => t.frequence);
    return [...new Set(frequences)];
  }

  getStatutTontine(tontine: Tontine): string {
    const dateDebut = new Date(tontine.date_demarrage);
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

  changerTri(nouveauTri: string) {
    if (this.triPar === nouveauTri) {
      this.ordre = this.ordre === 'asc' ? 'desc' : 'asc';
    } else {
      this.triPar = nouveauTri;
      this.ordre = 'desc';
    }
  }
}
