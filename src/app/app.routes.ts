import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./composants/accueil/accueil').then((m) => m.Accueil),
  },
  {
    path: 'utilisateurs',
    loadComponent: () =>
      import('./composants/utilisateurs/liste-utilisateurs/liste-utilisateurs').then(
        (m) => m.ListeUtilisateurs,
      ),
  },
  {
    path: 'utilisateurs/nouveau',
    loadComponent: () =>
      import('./composants/utilisateurs/formulaire-utilisateur/formulaire-utilisateur').then(
        (m) => m.FormulaireUtilisateur,
      ),
  },
  {
    path: 'tontines',
    loadComponent: () =>
      import('./composants/tontines/liste-tontines/liste-tontines').then((m) => m.ListeTontines),
  },
  {
    path: 'tontines/nouvelle',
    loadComponent: () =>
      import('./composants/tontines/formulaire-tontine/formulaire-tontine').then(
        (m) => m.FormulaireTontine,
      ),
  },
  {
    path: 'tontines/:id',
    loadComponent: () =>
      import('./composants/tontines/details-tontine/details-tontine').then((m) => m.DetailsTontine),
  },
  {
    path: 'tontines/:id/membres',
    loadComponent: () =>
      import('./composants/membres/liste-membres/liste-membres').then((m) => m.ListeMembres),
  },
  {
    path: 'tontines/:id/paiements',
    loadComponent: () =>
      import('./composants/paiements/liste-paiements/liste-paiements').then(
        (m) => m.ListePaiements,
      ),
  },
  {
    path: 'tontines/:id/tours',
    loadComponent: () =>
      import('./composants/tours/liste-tours/liste-tours').then((m) => m.ListeTours),
  },
];
