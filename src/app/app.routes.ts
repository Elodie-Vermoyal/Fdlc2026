import { Routes } from '@angular/router';

export const routes: Routes = [
  /*{
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },*/
  {
    path: 'liste-exposants-page',
    loadComponent: () => import('./liste-exposants-page/liste-exposants-page.page').then( m => m.ListeExposantsPagePage)
  },
  {
    path: 'liste-livres-page',
    loadComponent: () => import('./liste-livres-page/liste-livres-page.page').then( m => m.ListeLivresPagePage)
  },
  {
    path: 'page-livre/:id',
    loadComponent: () => import('./page-livre/page-livre.page').then( m => m.PageLivrePage)
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
  
    path: 'page-personne/:id',
    loadComponent: () => import('./page-personne/page-personne.page')
      .then(m => m.PagePersonnePage)
  },
  {
    path: 'page-planning-personnel',
    loadComponent: () => import('./page-planning-personnel/page-planning-personnel.page').then( m => m.PagePlanningPersonnelPage)
  },

  {
    path: 'page-liste-personnes',
    loadComponent: () => import('./page-liste-personnes/page-liste-personnes.page').then( m => m.PageListePersonnesPage)
  }
  ,
  {
    path: 'page-liste-evenements',
    loadComponent: () => import('./page-liste-evenements/page-liste-evenements.page').then( m => m.PageListeEvenementsPage)  
  }
];
