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
    path: '',
    loadComponent: () => import('./accueil/accueil.page').then( m => m.AccueilPage)
  },
];
