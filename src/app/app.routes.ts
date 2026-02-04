import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth-guard';
import { RoleGuard } from './guards/role-guard';

export const routes: Routes = [
  // Routes publiques
  {
    path: 'connexion',
    loadComponent: () => import('./composants/connexion/connexion').then((m) => m.Connexion),
  },
  {
    path: 'inscription',
    loadComponent: () => import('./composants/inscription/inscription').then((m) => m.Inscription),
  },

  // Route protégée par authentification (Accueil)
  {
    path: '',
    loadComponent: () => import('./composants/accueil/accueil').then((m) => m.Accueil),
    canActivate: [AuthGuard],
  },

  // --- Routes ADMIN ---
  {
    path: 'admin/utilisateurs',
    loadComponent: () =>
      import('./composants/utilisateurs/liste-utilisateurs/liste-utilisateurs').then(
        (m) => m.ListeUtilisateurs,
      ),
    canActivate: [RoleGuard],
    data: { roles: ['admin'] },
  },
  {
    path: 'utilisateurs/nouveau',
    loadComponent: () =>
      import('./composants/utilisateurs/formulaire-utilisateur/formulaire-utilisateur').then(
        (m) => m.FormulaireUtilisateur,
      ),
    canActivate: [RoleGuard],
    data: { roles: ['admin'] },
  },

  // --- Routes TONTINES (Admin & Trésorier) ---
  {
    path: 'tontines',
    loadComponent: () =>
      import('./composants/tontines/liste-tontines/liste-tontines').then((m) => m.ListeTontines),
    canActivate: [RoleGuard],
    data: { roles: ['admin', 'trésorier'] },
  },
  {
    path: 'tontines/nouvelle',
    loadComponent: () =>
      import('./composants/tontines/formulaire-tontine/formulaire-tontine').then(
        (m) => m.FormulaireTontine,
      ),
    canActivate: [RoleGuard],
    data: { roles: ['admin', 'trésorier'] },
  },

  // --- AJOUT : Route MEMBRE (Mes Tontines) ---
  // On réutilise ListeTontines car le backend renvoie déjà la liste filtrée pour le membre
  {
    path: 'mes-tontines',
    loadComponent: () =>
      import('./composants/tontines/liste-tontines/liste-tontines').then((m) => m.ListeTontines),
    canActivate: [RoleGuard],
    data: { roles: ['membre'] },
  },

  // --- Routes DÉTAILS (Communes mais protégées) ---
  // Note: Un membre doit aussi pouvoir voir les détails de SA tontine.
  // J'ai ajouté 'membre' aux rôles autorisés ici.
  {
    path: 'tontines/:id',
    loadComponent: () =>
      import('./composants/tontines/details-tontine/details-tontine').then((m) => m.DetailsTontine),
    canActivate: [RoleGuard],
    data: { roles: ['admin', 'trésorier', 'membre'] },
  },
  {
    path: 'tontines/:id/membres',
    loadComponent: () =>
      import('./composants/membres/liste-membres/liste-membres').then((m) => m.ListeMembres),
    canActivate: [RoleGuard],
    data: { roles: ['admin', 'trésorier', 'membre'] },
  },
  {
    path: 'tontines/:id/paiements',
    loadComponent: () =>
      import('./composants/paiements/liste-paiements/liste-paiements').then(
        (m) => m.ListePaiements,
      ),
    canActivate: [RoleGuard],
    data: { roles: ['admin', 'trésorier', 'membre'] },
  },
  {
    path: 'tontines/:id/tours',
    loadComponent: () =>
      import('./composants/tours/liste-tours/liste-tours').then((m) => m.ListeTours),
    canActivate: [RoleGuard],
    data: { roles: ['admin', 'trésorier', 'membre'] },
  },

  // Route d'accès refusé
  {
    path: 'acces-refuse',
    loadComponent: () => import('./composants/connexion/connexion').then((m) => m.Connexion), // Ou une page spécifique 403
  },

  // Redirection par défaut
  { path: '**', redirectTo: '/connexion' },
];
