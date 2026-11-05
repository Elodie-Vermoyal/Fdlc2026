import { Routes } from '@angular/router';

export const routes: Routes = [
  /*{
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },*/
  {
    path: 'liste-exposants-page',
    loadComponent: () => import('./liste-exposants-page/liste-exposants-page.page').then( m => m.ListeExposantsPagePage)
  },
  {
    path: '',
    loadComponent: () => import('./accueil/accueil.page').then( m => m.AccueilPage)
  },
  {
    path: 'page-exposant/:id',
    loadComponent: () => import('./page-exposant/page-exposant.page').then( m => m.PageExposantPage)
  },
  {
    // Affiche les détails de la personne correspondant à l'identifiant
    path: 'page-personne/:id',
    loadComponent: () => import('./page-personne/page-personne.page')
      .then(m => m.PagePersonnePage)
  },
  {
    // Plans des halls, ex : /plans/3?numLieu=302
    path: 'plans',
    loadComponent: () => import('./tabs/tabs.page').then( m => m.TabsPage)
  },
  {
    path: 'plans/:numHall',
    loadComponent: () => import('./tabs/tabs.page').then( m => m.TabsPage)
  },
  {
    // Pages de configuration, pas dans le menu (protégées par mot de passe sur /config)
    path: 'config',
    loadComponent: () => import('./page-config/page-config.page').then( m => m.PageConfigPage)
  },
  {
    path: 'config-plan',
    loadComponent: () => import('./page-config-plan/page-config-plan.page').then( m => m.PageConfigPlanPage)
  },
  {
    path: 'config-evenement',
    loadComponent: () => import('./page-config-evenement/page-config-evenement.page').then( m => m.PageConfigEvenementPage)
  },
  {
    path: 'page-planning-personnel',
    loadComponent: () => import('./page-planning-personnel/page-planning-personnel.page').then( m => m.PagePlanningPersonnelPage)
  },

  {
    path: 'page-liste-personnes',
    loadComponent: () => import('./page-liste-personnes/page-liste-personnes.page').then( m => m.PageListePersonnesPage)
  }
];
