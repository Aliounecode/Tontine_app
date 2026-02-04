import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { StatistiquesTontine } from '../../models/modeles';

@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './accueil.html',
  styleUrls: ['./accueil.css'],
})
export class Accueil implements OnInit {
  // Données simulées pour l'affichage
  statistiques: StatistiquesTontine | null = null;
  derniereTontine: any = null;
  prochainPaiement: any = null;

  constructor(private http: HttpClient) {} // Injection du HttpClient pour les futures requêtes HTTP

  ngOnInit() {
    // Initialisation des données
    this.chargerDonnees();
  }

  chargerDonnees() {
    // Simulation de données pour l'accueil
    this.statistiques = {
      total_cotisations: 0,
      total_distribue: 0,
      solde_restant: 0,
      membres_actifs: 0,
      tours_realises: 0,
    };

    this.derniereTontine = {
      nom: 'Neant',
      montant: 0,
      frequence: 'Neant',
    };

    this.prochainPaiement = {
      date: '2024-01-25',
      montant: 0,
    };
  }

  getProchainPaiementJours(): number {
    const today = new Date();
    const prochainDate = new Date(this.prochainPaiement.date);
    const diffTime = prochainDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}
