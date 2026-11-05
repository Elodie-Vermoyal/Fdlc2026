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
    // Page de configuration des zones des plans, pas dans le menu (protégée par mot de passe)
    path: 'config-plan',
    loadComponent: () => import('./page-config-plan/page-config-plan.page').then( m => m.PageConfigPlanPage)
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
