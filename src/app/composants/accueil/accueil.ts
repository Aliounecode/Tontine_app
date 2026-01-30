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
  statistiques: StatistiquesTontine | null = null;
  derniereTontine: any = null;
  prochainPaiement: any = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.chargerDonnees();
  }

  chargerDonnees() {
    // Simulation de données pour l'accueil
    this.statistiques = {
      total_cotisations: 1500000,
      total_distribue: 1200000,
      solde_restant: 300000,
      membres_actifs: 45,
      tours_realises: 120,
    };

    this.derniereTontine = {
      nom: 'Tontine des Amis',
      montant: 50000,
      frequence: 'mensuel',
    };

    this.prochainPaiement = {
      date: '2024-01-25',
      montant: 10000,
    };
  }

  getProchainPaiementJours(): number {
    const today = new Date();
    const prochainDate = new Date(this.prochainPaiement.date);
    const diffTime = prochainDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}
