//Pourquoi ce fichier existe-t-il ?
//Ce fichier définit les interfaces TypeScript pour les modèles de données utilisés dans l'application Tontine.
//Il permet de structurer et de typer les données manipulées dans l'application,
// facilitant ainsi le développement et la maintenance du code.

export interface Utilisateur {
  id: number;
  nom_utilisateur: string;
  telephone: string;
  email: string;
  role: string;
  date_creation: string;
}

export interface Tontine {
  id: number;
  nom: string;
  description?: string;
  montant_cotisation: number;
  frequence: 'journalier' | 'hebdomadaire' | 'mensuel';
  mode_rotation: 'ordre' | 'aléatoire' | 'priorité';
  id_tresorier: number;
  nombre_max_membres: number;
  date_demarrage: string;
  date_creation: string;
}

export interface Membre {
  id: number;
  id_tontine: number;
  id_utilisateur: number;
  date_adhesion: string;
  position: number;
}

export interface Paiement {
  id: number;
  id_tontine: number;
  id_utilisateur: number;
  montant: number;
  periode: number;
  date_versement: string;
}

export interface Tour {
  id: number;
  id_tontine: number;
  id_utilisateur: number;
  periode: number;
  montant_recu: number;
  date_reception: string;
}

export interface StatistiquesTontine {
  total_cotisations: number;
  total_distribue: number;
  solde_restant: number;
  membres_actifs: number;
  tours_realises: number;
}

export interface Token {
  access_token: string;
  token_type: string;
  utilisateur: Utilisateur;
}

export interface LoginData {
  telephone: string;
  mot_de_passe: string;
}
