import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../utils/auth';
import { Utilisateur } from '../../models/modeles';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profil.html',
  styleUrls: ['./profil.css'],
})
export class Profil implements OnInit {
  utilisateur: Utilisateur | null = null;
  chargement = true;

  constructor(
    private authService: AuthService,
    private http: HttpClient,
  ) {}

  ngOnInit() {
    this.chargerProfil();
  }

  chargerProfil() {
    this.chargement = true;

    // Utiliser le token pour récupérer les infos du profil
    this.http.get<Utilisateur>('http://localhost:8000/profil').subscribe({
      next: (data) => {
        this.utilisateur = data;
        this.chargement = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement du profil:', error);
        this.chargement = false;
      },
    });
  }

  getRoleBadgeClass(): string {
    switch (this.utilisateur?.role) {
      case 'admin':
        return 'bg-danger';
      case 'trésorier':
        return 'bg-success';
      case 'membre':
        return 'bg-info';
      default:
        return 'bg-secondary';
    }
  }
}
