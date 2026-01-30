import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // AJOUT : OnInit et ChangeDetectorRef
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router'; // AJOUT : ActivatedRoute
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-formulaire-tontine',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './formulaire-tontine.html',
  styleUrls: ['./formulaire-tontine.css'],
})
export class FormulaireTontine implements OnInit {
  // AJOUT : implements OnInit
  nouvelleTontine = {
    nom: '',
    description: '',
    montant_cotisation: 0,
    frequence: 'mensuel',
    mode_rotation: 'ordre',
    nombre_max_membres: 10,
    date_demarrage: new Date().toISOString().split('T')[0],
  };

  chargement = false;
  erreur: string | null = null;
  success = false;
  etapeActuelle = 1;
  totalEtapes = 3;
  tontineId: number | null = null; // Stocke l'ID si on est en mode modification

  frequences = [
    { value: 'journalier', label: 'Journalier', icon: 'bi-calendar-day' },
    { value: 'hebdomadaire', label: 'Hebdomadaire', icon: 'bi-calendar-week' },
    { value: 'mensuel', label: 'Mensuel', icon: 'bi-calendar-month' },
  ];

  modesRotation = [
    {
      value: 'ordre',
      label: 'Ordre fixe',
      description: 'Les membres reçoivent dans un ordre prédéfini',
    },
    {
      value: 'aléatoire',
      label: 'Tirage aléatoire',
      description: 'Le bénéficiaire est tiré au sort à chaque tour',
    },
    {
      value: 'priorité',
      label: 'Priorité',
      description: 'Les membres avec des besoins urgents sont prioritaires',
    },
  ];

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute, // AJOUT : Injection de la route
    private cdr: ChangeDetectorRef, // AJOUT : Injection du détecteur
  ) {}

  ngOnInit() {
    // On vérifie si un ID est présent dans l'URL (mode modification)
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.tontineId = +id;
      this.chargement = true;
      this.http.get<any>(`http://localhost:8000/tontines/${id}`).subscribe({
        next: (data) => {
          this.nouvelleTontine = data;
          this.chargement = false;
          this.cdr.detectChanges(); // Force la mise à jour du formulaire avec les données
        },
        error: (err) => {
          this.erreur = 'Impossible de charger les données de la tontine';
          this.chargement = false;
          this.cdr.detectChanges();
        },
      });
    }
  }

  validerEtape1(): boolean {
    if (!this.nouvelleTontine.nom.trim()) {
      this.erreur = 'Le nom de la tontine est requis';
      return false;
    }
    if (this.nouvelleTontine.montant_cotisation <= 0) {
      this.erreur = 'Le montant de cotisation doit être positif';
      return false;
    }
    if (this.nouvelleTontine.nombre_max_membres < 2) {
      this.erreur = 'Le nombre de membres doit être au moins 2';
      return false;
    }
    return true;
  }

  validerFormulaire(): boolean {
    if (!this.validerEtape1()) return false;

    // Si on modifie, on ne bloque pas forcément sur la date passée
    if (!this.tontineId) {
      const dateDebut = new Date(this.nouvelleTontine.date_demarrage);
      const aujourdhui = new Date();
      if (dateDebut < aujourdhui) {
        this.erreur = 'La date de démarrage doit être future';
        return false;
      }
    }
    return true;
  }

  avancerEtape() {
    if (this.etapeActuelle === 1 && !this.validerEtape1()) return;
    if (this.etapeActuelle < this.totalEtapes) {
      this.etapeActuelle++;
      this.erreur = null;
    }
    this.cdr.detectChanges();
  }

  reculerEtape() {
    if (this.etapeActuelle > 1) {
      this.etapeActuelle--;
      this.erreur = null;
    }
    this.cdr.detectChanges();
  }

  enregistrerTontine() {
    // Renommé pour être plus général
    if (this.chargement) return;
    if (!this.validerFormulaire()) {
      this.etapeActuelle = 1;
      return;
    }

    this.chargement = true;
    this.erreur = null;

    const baseUrl = 'http://localhost:8000/tontines';

    if (this.tontineId) {
      // --- MODE UPDATE (PUT) ---
      this.http.put(`${baseUrl}/${this.tontineId}`, this.nouvelleTontine).subscribe({
        next: () => {
          this.success = true;
          this.chargement = false;
          this.cdr.detectChanges();
          setTimeout(() => this.router.navigate(['/tontines']), 2000);
        },
        error: (error) => {
          this.erreur = error.error?.detail || 'Erreur lors de la modification';
          this.chargement = false;
          this.cdr.detectChanges();
        },
      });
    } else {
      // --- MODE CREATE (POST) ---
      // Note : pas de slash à la fin pour éviter les erreurs CORS/Redirect
      this.http.post(baseUrl, this.nouvelleTontine).subscribe({
        next: () => {
          this.success = true;
          this.chargement = false;
          this.cdr.detectChanges();
          setTimeout(() => this.router.navigate(['/tontines']), 2000);
        },
        error: (error) => {
          this.erreur = error.error?.detail || 'Erreur lors de la création';
          this.chargement = false;
          this.cdr.detectChanges();
        },
      });
    }
  }

  annuler() {
    if (this.etapeActuelle > 1) {
      this.reculerEtape();
    } else {
      this.router.navigate(['/tontines']);
    }
  }

  get progression(): number {
    return (this.etapeActuelle / this.totalEtapes) * 100;
  }

  calculerMontantTotal(): number {
    return this.nouvelleTontine.montant_cotisation * this.nouvelleTontine.nombre_max_membres;
  }

  get descriptionRotation(): string {
    const mode = this.modesRotation.find((m) => m.value === this.nouvelleTontine.mode_rotation);
    return mode ? mode.description : '';
  }
}
