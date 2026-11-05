import { Component, AfterViewInit, ElementRef, input, viewChild } from '@angular/core';
import {
  IonTabs,
  IonTab,
  IonTabBar,
  IonTabButton,
  IonLabel,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonMenuButton,
  IonContent,
  GestureController,
} from '@ionic/angular';

import { PlanHallComponent } from '../../components/plan-hall/plan-hall.component';

// Page des plans : un onglet par hall, on passe d'un hall à l'autre
// avec la barre du bas ou en glissant le doigt à gauche / à droite
@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  imports: [
    IonTabs,
    IonTab,
    IonTabBar,
    IonTabButton,
    IonLabel,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonBackButton,
    IonMenuButton,
    IonContent,
    PlanHallComponent
  ],
})
export class TabsPage implements AfterViewInit
{
  // Paramètres de la route : /plans/3?numLieu=302
  public numHall = input<number>( -1 ) ;
  public numLieu = input<number>( -1 ) ;

  protected readonly halls = [1, 2, 3, 4, 5] ;
  protected hallCourant: number = 1 ;

  // Pas de swipe quand le plan est zoomé, sinon on ne peut plus le faire défiler
  protected zoomActif: boolean = false ;

  protected tabs = viewChild(IonTabs) ;
  protected element: ElementRef ;
  protected gestureCtrl: GestureController ;

  constructor( element: ElementRef, gestureCtrl: GestureController )
  {
    this.element = element ;
    this.gestureCtrl = gestureCtrl ;
  }

  ngAfterViewInit()
  {
    // Hall demandé, sinon celui du lieu (premier chiffre du numero : 302 -> hall 3)
    let hall = Number( this.numHall() ) ;
    if( !this.halls.includes( hall ) ) hall = Math.floor( Number( this.numLieu() ) / 100 ) ;
    if( !this.halls.includes( hall ) ) hall = 1 ;
    this.afficheHall( hall ) ;

    let gesture = this.gestureCtrl.create( {
      el: this.element.nativeElement,
      gestureName: "swipe-hall",
      direction: "x",
      threshold: 20,
      onEnd: detail =>
      {
        if( this.zoomActif || Math.abs( detail.deltaX ) < 80 ) return ;

        // glisser vers la gauche = hall suivant
        if( detail.deltaX < 0 ) this.afficheHall( this.hallCourant + 1 ) ;
        else this.afficheHall( this.hallCourant - 1 ) ;
      }
    } ) ;
    gesture.enable() ;
  }

  afficheHall( hall: number )
  {
    if( !this.halls.includes( hall ) ) return ;
    this.hallCourant = hall ;
    this.tabs()?.select( "hall" + hall ) ;
  }

  onTabChange( event: { tab: string } )
  {
    this.hallCourant = Number( event.tab.replace( "hall", "" ) ) ;
    this.zoomActif = false ;
  }
}
