import { Component, OnChanges, AfterViewInit, OnDestroy, ChangeDetectorRef, ElementRef, computed, input, output, signal, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { addOutline, removeOutline } from 'ionicons/icons';

import {
  IonButton,
  IonIcon,
  IonToast,
 } from '@ionic/angular';

import { LieuService } from '../../services/lieu.service';
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
export class PlanHallComponent  implements OnChanges, AfterViewInit, OnDestroy
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

  // Largeur du plan sans zoom : le hall doit tenir en entier dans le cadre
  protected largeurBase = signal(0) ;
  private observateur: ResizeObserver | null = null ;

  // Zoom avec deux doigts : écart entre les doigts et zoom au début du geste
  private ecartDepart: number = 0 ;
  private zoomDepart: number = 1 ;

  // Point du plan sous les doigts, en fraction de la taille du plan (0 à 1)
  private pointX: number = 0 ;
  private pointY: number = 0 ;

  protected cadre = viewChild.required<ElementRef<HTMLElement>>( "cadre" ) ;
  protected plan = viewChild.required<ElementRef<HTMLElement>>( "plan" ) ;
  protected cdr: ChangeDetectorRef ;

  // Lieu sur lequel on vient de cliquer (affiché en surbrillance avec un message)
  protected lieuClique = signal<Lieu | null>( null ) ;

  // Bouton Situer : on zoome une seule fois sur le lieu demandé
  private lieuxCharges: boolean = false ;
  private dejaSitue: boolean = false ;
  protected messageSituer = signal("") ;

  // Seulement les lieux qui ont une zone dessinée
  protected zones = computed( () => this.lieux().filter( l => l.x1 != null && l.x2 != null ) ) ;

  protected lieuSelectionne = computed( () => this.zones().find( l => l.num == this.numLieu() ) ) ;

  constructor( serviceLieu: LieuService, router: Router, cdr: ChangeDetectorRef )
  {
    this.serviceLieu = serviceLieu ;
    this.router = router ;
    this.cdr = cdr ;
    addIcons( { addOutline, removeOutline } ) ;
  }

  ngOnChanges()
  {
    this.lieuxCharges = false ;
    this.dejaSitue = false ;
    this.serviceLieu.getLieuxDuHall( this.numHall() ).subscribe( lieux =>
    {
      this.lieux.set( lieux ) ;
      this.lieuxCharges = true ;
      this.situeLieu() ;
    }) ;
  }

  // Recalcule la taille du plan quand le cadre change de taille
  // (rotation de l'écran, fenêtre redimensionnée, onglet du hall affiché)
  ngAfterViewInit()
  {
    this.observateur = new ResizeObserver( () => this.calculeLargeurBase() ) ;
    this.observateur.observe( this.cadre().nativeElement ) ;
  }

  ngOnDestroy()
  {
    this.observateur?.disconnect() ;
  }

  onImageChargee( event: Event )
  {
    let image = event.target as HTMLImageElement ;
    this.largeur.set( image.naturalWidth ) ;
    this.hauteur.set( image.naturalHeight ) ;
    this.calculeLargeurBase() ;
  }

  // Plus grande largeur pour que l'image tienne en largeur et en hauteur (1100 px max)
  private calculeLargeurBase()
  {
    let cadre = this.cadre().nativeElement ;
    if( this.largeur() == 0 || cadre.clientWidth == 0 ) return ;

    let largeur = Math.min( cadre.clientWidth, cadre.clientHeight * this.largeur() / this.hauteur(), 1100 ) ;
    this.largeurBase.set( Math.floor( largeur ) ) ;
    this.situeLieu() ;
  }

  // Bouton Situer de la page exposant : zoom sur le stand demandé (numLieu)
  // Il faut que les lieux soient chargés et que le plan soit affiché
  private situeLieu()
  {
    if( this.dejaSitue || !this.lieuxCharges || this.largeurBase() == 0 ) return ;

    // le lieu n'est pas dans ce hall
    let lieu = this.lieux().find( l => l.num == this.numLieu() ) ;
    if( !lieu ) return ;

    this.dejaSitue = true ;

    if( lieu.x1 == null )
    {
      this.messageSituer.set( this.nomLieu( lieu ) + " n'est pas encore placé sur le plan" ) ;
      return ;
    }

    // le centre du stand vient au centre de l'écran
    this.pointX = ( lieu.x1 + lieu.x2 ) / 2 / this.largeur() ;
    this.pointY = ( lieu.y1 + lieu.y2 ) / 2 / this.hauteur() ;

    let cadre = this.cadre().nativeElement.getBoundingClientRect() ;
    this.zoomeSur( 2, cadre.left + cadre.width / 2, cadre.top + cadre.height / 2 ) ;
    this.onZoom.emit( true ) ;
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

  // Boutons + et - : on zoome sur le centre de l'écran
  changeZoom( pas: number )
  {
    let cadre = this.cadre().nativeElement.getBoundingClientRect() ;
    let x = cadre.left + cadre.width / 2 ;
    let y = cadre.top + cadre.height / 2 ;

    this.retientPoint( x, y ) ;
    this.zoomeSur( this.zoom() + pas, x, y ) ;
    this.onZoom.emit( this.zoom() > 1 ) ;
  }

  // Mémorise quel point du plan se trouve sous la position x, y de l'écran
  private retientPoint( x: number, y: number )
  {
    let plan = this.plan().nativeElement.getBoundingClientRect() ;
    this.pointX = ( x - plan.left ) / plan.width ;
    this.pointY = ( y - plan.top ) / plan.height ;
  }

  // Change le zoom puis fait défiler le cadre pour que le point retenu reste en x, y
  private zoomeSur( zoom: number, x: number, y: number )
  {
    this.zoom.set( Math.min( 3, Math.max( 1, zoom ) ) ) ;
    // met à jour la taille du plan tout de suite
    this.cdr.detectChanges() ;

    let plan = this.plan().nativeElement.getBoundingClientRect() ;
    let cadre = this.cadre().nativeElement ;
    cadre.scrollLeft += plan.left + this.pointX * plan.width - x ;
    cadre.scrollTop += plan.top + this.pointY * plan.height - y ;
  }

  onTouchStart( event: TouchEvent )
  {
    if( event.touches.length != 2 ) return ;

    this.ecartDepart = this.ecart( event ) ;
    this.zoomDepart = this.zoom() ;
    let milieu = this.milieu( event ) ;
    this.retientPoint( milieu.x, milieu.y ) ;
    // pas de changement de hall pendant le zoom
    this.onZoom.emit( true ) ;
  }

  onTouchMove( event: TouchEvent )
  {
    if( event.touches.length != 2 || this.ecartDepart == 0 ) return ;

    event.preventDefault() ;
    // le milieu des doigts suit aussi le déplacement de la main
    let milieu = this.milieu( event ) ;
    this.zoomeSur( this.zoomDepart * this.ecart( event ) / this.ecartDepart, milieu.x, milieu.y ) ;
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

  // Point au milieu des deux doigts
  private milieu( event: TouchEvent ): { x: number, y: number }
  {
    let a = event.touches[0] ;
    let b = event.touches[1] ;
    return { x: ( a.clientX + b.clientX ) / 2, y: ( a.clientY + b.clientY ) / 2 } ;
  }
}
