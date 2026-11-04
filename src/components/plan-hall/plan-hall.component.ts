import { Component, OnChanges, computed, input, output, signal } from '@angular/core';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { addOutline, removeOutline } from 'ionicons/icons';

import {
  IonButton,
  IonIcon,
  IonToast,
 } from '@ionic/angular';

import { LieuService } from '../../servcies/lieu.service';
import { Lieu } from '../../modeles/Lieu';

@Component({
  selector: 'app-plan-hall',
  templateUrl: './plan-hall.component.html',
  styleUrls: ['./plan-hall.component.scss'],
  imports: [
    IonButton,
    IonIcon,
    IonToast,
  ],
})
export class PlanHallComponent  implements OnChanges
{
  // Numero du hall affiché
  public    numHall = input.required<number>() ;

  // Lieu à mettre en évidence sur le plan (-1 = aucun)
  public    numLieu = input<number>( -1 ) ;

  // Page appelée quand on clique sur un stand, le num du lieu est ajouté à la fin
  public    lienPage = input<string>( "/page-lieu" ) ;

  // Prévient le parent quand le plan est zoomé (pour bloquer le swipe entre les halls)
  public    onZoom = output<boolean>() ;

  protected serviceLieu: LieuService ;
  protected router: Router ;

  protected lieux = signal<Array<Lieu>>( [] ) ;

  // Taille réelle de l'image, les zones de la BD sont en pixels de l'image
  protected largeur = signal(0) ;
  protected hauteur = signal(0) ;

  protected zoom = signal(1) ;

  // Zoom avec deux doigts : écart entre les doigts et zoom au début du geste
  private ecartDepart: number = 0 ;
  private zoomDepart: number = 1 ;

  // Lieu sur lequel on vient de cliquer (affiché en surbrillance avec un message)
  protected lieuClique = signal<Lieu | null>( null ) ;

  // Seulement les lieux qui ont une zone dessinée
  protected zones = computed( () => this.lieux().filter( l => l.x1 != null && l.x2 != null ) ) ;

  protected lieuSelectionne = computed( () => this.zones().find( l => l.num == this.numLieu() ) ) ;

  constructor( serviceLieu: LieuService, router: Router )
  {
    this.serviceLieu = serviceLieu ;
    this.router = router ;
    addIcons( { addOutline, removeOutline } ) ;
  }

  ngOnChanges()
  {
    this.serviceLieu.getLieuxDuHall( this.numHall() ).subscribe( lieux => this.lieux.set( lieux ) ) ;
  }

  onImageChargee( event: Event )
  {
    let image = event.target as HTMLImageElement ;
    this.largeur.set( image.naturalWidth ) ;
    this.hauteur.set( image.naturalHeight ) ;
  }

  onClickZone( lieu: Lieu )
  {
    if( this.pageExiste() ) this.router.navigate( [this.lienPage(), lieu.num] ) ;
    else this.lieuClique.set( lieu ) ;
  }

  // Vrai si la page d'information des lieux est déclarée dans les routes
  private pageExiste(): boolean
  {
    let page = this.lienPage().replace( "/", "" ) ;
    return this.router.config.some( route => route.path?.startsWith( page + "/" ) ) ;
  }

  // ex : "Stand 222", sinon le nom du lieu
  protected nomLieu( lieu: Lieu ): string
  {
    if( lieu.type == "stand" ) return "Stand " + lieu.num ;
    return lieu.nom || "Lieu " + lieu.num ;
  }

  changeZoom( pas: number )
  {
    let zoom = Math.min( 3, Math.max( 1, this.zoom() + pas ) ) ;
    this.zoom.set( zoom ) ;
    this.onZoom.emit( zoom > 1 ) ;
  }

  onTouchStart( event: TouchEvent )
  {
    if( event.touches.length != 2 ) return ;

    this.ecartDepart = this.ecart( event ) ;
    this.zoomDepart = this.zoom() ;
    // pas de changement de hall pendant le zoom
    this.onZoom.emit( true ) ;
  }

  onTouchMove( event: TouchEvent )
  {
    if( event.touches.length != 2 || this.ecartDepart == 0 ) return ;

    event.preventDefault() ;
    let zoom = this.zoomDepart * this.ecart( event ) / this.ecartDepart ;
    this.zoom.set( Math.min( 3, Math.max( 1, zoom ) ) ) ;
  }

  onTouchEnd( event: TouchEvent )
  {
    if( this.ecartDepart == 0 || event.touches.length > 0 ) return ;

    this.ecartDepart = 0 ;
    // apres la fin du swipe des tabs, sinon le hall change quand on dézoome
    setTimeout( () => this.onZoom.emit( this.zoom() > 1 ) ) ;
  }

  // Distance entre les deux doigts
  private ecart( event: TouchEvent ): number
  {
    let a = event.touches[0] ;
    let b = event.touches[1] ;
    return Math.hypot( a.clientX - b.clientX, a.clientY - b.clientY ) ;
  }
}
