import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class App {
  title = 'Gestion Tontine Digitale';
  menuItems = [
    { path: '/', label: 'Accueil', icon: 'bi-house' },
    { path: '/utilisateurs', label: 'Utilisateurs', icon: 'bi-people' },
    { path: '/tontines', label: 'Tontines', icon: 'bi-cash-stack' },
  ];
}
