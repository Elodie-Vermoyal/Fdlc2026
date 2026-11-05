import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonItem,
  IonButton,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonNote,
  IonToast,
  IonAlert,
} from '@ionic/angular';

import { LieuService } from '../../servcies/lieu.service';
import { ConfigService } from '../../servcies/config.service';
import { Lieu } from '../../modeles/Lieu';

// Page de config (accessible depuis /config) pour dessiner les zones des stands sur les plans.
// Les coordonnées sont enregistrées dans x1, y1, x2, y2 de la table lieu,
// en pixels de l'image du hall.
@Component({
  selector: 'app-page-config-plan',
  templateUrl: './page-config-plan.page.html',
  styleUrls: ['./page-config-plan.page.scss'],
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonItem,
    IonButton,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonSelect,
    IonSelectOption,
    IonNote,
    IonToast,
    IonAlert,
    FormsModule
  ]
})
export class PageConfigPlanPage
{
  protected serviceLieu: LieuService ;
  protected serviceConfig: ConfigService ;
  protected router: Router ;

  protected readonly halls = [1, 2, 3, 4, 5] ;
  protected hall = signal(1) ;
  protected lieux = signal<Array<Lieu>>( [] ) ;
  protected numChoisi: number = -1 ;

  // Taille réelle de l'image du hall
  protected largeur = signal(0) ;
  protected hauteur = signal(0) ;

  // Rectangle en train d'être dessiné
  protected zone = signal<{ x1: number, y1: number, x2: number, y2: number } | null>( null ) ;
  private dessinEnCours: boolean = false ;

  protected message = signal("") ;

  // Confirmation avant de supprimer une zone
  protected alerteSupprimer = signal(false) ;

  protected readonly boutonsSupprimer = [
    { text: "Annuler", role: "cancel" },
    { text: "Supprimer", role: "destructive", handler: () => this.onSupprimer() }
  ] ;

  protected nbZones = computed( () => this.lieux().filter( l => l.x1 != null ).length ) ;

  constructor( serviceLieu: LieuService, serviceConfig: ConfigService, router: Router )
  {
    this.serviceLieu = serviceLieu ;
    this.serviceConfig = serviceConfig ;
    this.router = router ;
  }

  // Sans mot de passe on retourne sur la page principale de config
  ionViewWillEnter()
  {
    if( !this.serviceConfig.connecte() ) this.router.navigateByUrl( "/config" ) ;
    else this.chargeHall( this.hall() ) ;
  }

  chargeHall( hall: number )
  {
    this.hall.set( hall ) ;
    this.largeur.set( 0 ) ;
    this.zone.set( null ) ;
    this.numChoisi = -1 ;
    this.serviceLieu.getLieuxDuHall( hall ).subscribe( lieux => this.lieux.set( lieux ) ) ;
  }

  onImageChargee( event: Event )
  {
    let image = event.target as HTMLImageElement ;
    this.largeur.set( image.naturalWidth ) ;
    this.hauteur.set( image.naturalHeight ) ;
  }

  lieuChoisi(): Lieu | undefined
  {
    return this.lieux().find( l => l.num == this.numChoisi ) ;
  }

  // Position de la souris (ou du doigt) en pixels de l'image
  private position( event: PointerEvent ): { x: number, y: number }
  {
    let svg = ( event.currentTarget as SVGSVGElement ).getBoundingClientRect() ;
    return {
      x: Math.round( ( event.clientX - svg.left ) * this.largeur() / svg.width ),
      y: Math.round( ( event.clientY - svg.top ) * this.hauteur() / svg.height )
    } ;
  }

  onPointerDown( event: PointerEvent )
  {
    if( this.numChoisi < 0 ) return ;

    let p = this.position( event ) ;
    this.zone.set( { x1: p.x, y1: p.y, x2: p.x, y2: p.y } ) ;
    this.dessinEnCours = true ;
    ( event.currentTarget as Element ).setPointerCapture( event.pointerId ) ;
  }

  onPointerMove( event: PointerEvent )
  {
    let zone = this.zone() ;
    if( !this.dessinEnCours || !zone ) return ;

    let p = this.position( event ) ;
    this.zone.set( { x1: zone.x1, y1: zone.y1, x2: p.x, y2: p.y } ) ;
  }

  onPointerUp( event: PointerEvent )
  {
    this.dessinEnCours = false ;
  }

  // Clic sur une zone déjà dessinée : on choisit le lieu correspondant
  onClickZone( lieu: Lieu )
  {
    if( this.dessinEnCours ) return ;
    this.numChoisi = lieu.num ;
    this.zone.set( null ) ;
  }

  onEnregistrer()
  {
    let lieu = this.lieuChoisi() ;
    let zone = this.zone() ;
    if( !lieu || !zone ) return ;

    // on range les coins pour avoir x1 < x2 et y1 < y2
    lieu.x1 = Math.min( zone.x1, zone.x2 ) ;
    lieu.y1 = Math.min( zone.y1, zone.y2 ) ;
    lieu.x2 = Math.max( zone.x1, zone.x2 ) ;
    lieu.y2 = Math.max( zone.y1, zone.y2 ) ;
    lieu.hall = this.hall() ;

    if( lieu.x2 - lieu.x1 < 5 || lieu.y2 - lieu.y1 < 5 )
    {
      this.message.set( "La zone est trop petite" ) ;
      return ;
    }

    this.enregistre( lieu, "Zone du lieu " + lieu.num + " enregistrée" ) ;
  }

  onSupprimer()
  {
    let lieu = this.lieuChoisi() ;
    if( !lieu ) return ;

    lieu.x1 = lieu.y1 = lieu.x2 = lieu.y2 = null as any ;
    this.enregistre( lieu, "Zone du lieu " + lieu.num + " supprimée" ) ;
  }

  private enregistre( lieu: Lieu, message: string )
  {
    this.serviceLieu.majZoneLieu( this.serviceConfig.mdp, lieu ).subscribe( {
      next: () =>
      {
        this.zone.set( null ) ;
        this.lieux.set( [...this.lieux()] ) ;
        this.message.set( message ) ;
      },
      error: erreur =>
      {
        // 403 : mot de passe refusé par le serveur
        if( erreur.status == 403 )
        {
          this.serviceConfig.deconnexion() ;
          this.router.navigateByUrl( "/config" ) ;
        }
        this.message.set( "Erreur lors de l'enregistrement" ) ;
        this.chargeHall( this.hall() ) ;
      }
    }) ;
  }
}
