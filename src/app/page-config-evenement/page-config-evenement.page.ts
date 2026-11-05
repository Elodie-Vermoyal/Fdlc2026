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
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonDatetime,
  IonDatetimeButton,
  IonModal,
  IonButton,
  IonSearchbar,
  IonCheckbox,
  IonChip,
  IonIcon,
  IonNote,
  IonToast,
  IonAlert,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { closeCircle } from 'ionicons/icons';

import { ConfigService } from '../../services/config.service';
import { EvenementService } from '../../services/evenement.service';
import { LieuService } from '../../services/lieu.service';
import { LivreService } from '../../services/livre.service';
import { PersonneService } from '../../services/personne.service';
import { Evenement } from '../../modeles/Evenements';
import { Etape } from '../../modeles/Etape';
import { Lieu } from '../../modeles/Lieu';
import { Livre } from '../../modeles/Livre';
import { Personne } from '../../modeles/Personne';

// Page de config (accessible depuis /config) pour alimenter la table evenement
// et choisir les livres présentés (table presenter)
@Component({
  selector: 'app-page-config-evenement',
  templateUrl: './page-config-evenement.page.html',
  styleUrls: ['./page-config-evenement.page.scss'],
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonList,
    IonItem,
    IonLabel,
    IonInput,
    IonTextarea,
    IonSelect,
    IonSelectOption,
    IonDatetime,
    IonDatetimeButton,
    IonModal,
    IonButton,
    IonSearchbar,
    IonCheckbox,
    IonChip,
    IonIcon,
    IonNote,
    IonToast,
    IonAlert,
    FormsModule
  ]
})
export class PageConfigEvenementPage
{
  protected serviceConfig: ConfigService ;
  protected serviceEvenement: EvenementService ;
  protected serviceLieu: LieuService ;
  protected serviceLivre: LivreService ;
  protected servicePersonne: PersonneService ;
  protected router: Router ;

  protected evenements = signal<Array<Evenement>>( [] ) ;
  protected lieux = signal<Array<Lieu>>( [] ) ;
  protected types = signal<Array<string>>( [] ) ;
  protected livres = signal<Array<Livre>>( [] ) ;
  protected personnes = signal<Array<Personne>>( [] ) ;

  // Dates du festival pour les ion-datetime
  protected readonly debutFestival = Etape.debutFestival ;
  protected readonly finFestival = Etape.finFestival ;

  // Evenement en cours de modification (null = on affiche la liste)
  protected evenement = signal<Evenement | null>( null ) ;
  protected idLivres = signal<Array<number>>( [] ) ;
  protected erreur = signal("") ;
  protected message = signal("") ;
  protected alerteSupprimer = signal(false) ;

  protected readonly boutonsSupprimer = [
    { text: "Annuler", role: "cancel" },
    { text: "Supprimer", role: "destructive", handler: () => this.onSupprimer() }
  ] ;

  // Fenetres de choix des livres et de l'animateur avec une recherche
  protected modalLivres = signal(false) ;
  protected modalAnimateur = signal(false) ;
  protected recherche = signal("") ;

  protected livresTrouves = computed( () =>
  {
    let texte = this.recherche().toLowerCase() ;
    return this.livres().filter( l => ( l.titre + " " + ( l.nom ?? "" ) ).toLowerCase().includes( texte ) ).slice( 0, 100 ) ;
  }) ;

  protected personnesTrouvees = computed( () =>
  {
    let texte = this.recherche().toLowerCase() ;
    return this.personnes().filter( p => this.nomPersonne( p ).toLowerCase().includes( texte ) ).slice( 0, 100 ) ;
  }) ;

  constructor( serviceConfig: ConfigService, serviceEvenement: EvenementService, serviceLieu: LieuService,
               serviceLivre: LivreService, servicePersonne: PersonneService, router: Router )
  {
    this.serviceConfig = serviceConfig ;
    this.serviceEvenement = serviceEvenement ;
    this.serviceLieu = serviceLieu ;
    this.serviceLivre = serviceLivre ;
    this.servicePersonne = servicePersonne ;
    this.router = router ;
    addIcons( { closeCircle } ) ;
  }

  // Sans mot de passe on retourne sur la page principale de config
  ionViewWillEnter()
  {
    if( !this.serviceConfig.connecte() )
    {
      this.router.navigateByUrl( "/config" ) ;
      return ;
    }

    this.chargeEvenements() ;
    this.serviceLieu.getTousLesLieux().subscribe( lieux => this.lieux.set( lieux ) ) ;
    this.serviceEvenement.getThemesEvenements().subscribe( types => this.types.set( types ) ) ;
    this.serviceLivre.getTitresLivres().subscribe( livres => this.livres.set( livres ) ) ;
    this.servicePersonne.getToutesLesPersonnes().subscribe( personnes => this.personnes.set( personnes ) ) ;
  }

  chargeEvenements()
  {
    this.serviceEvenement.getEvenementsConfig().subscribe( evenements => this.evenements.set( evenements ) ) ;
  }

  onNouveau()
  {
    let evenement = new Evenement() ;
    evenement.debut = "2026-11-21T10:00:00" ;
    evenement.fin = "2026-11-21T11:00:00" ;
    this.ouvre( evenement, [] ) ;
  }

  onModifier( evenement: Evenement )
  {
    // copie pour ne pas modifier la liste si on annule
    let copie = Object.assign( new Evenement(), evenement ) ;
    copie.debut = this.dateIonic( evenement.debut ) ;
    copie.fin = this.dateIonic( evenement.fin ) || copie.debut ;
    copie.idAnimateur = evenement.idAnimateur ?? -1 ;

    this.serviceEvenement.getLivresEvenement( evenement.id ).subscribe( idLivres => this.ouvre( copie, idLivres ) ) ;
  }

  private ouvre( evenement: Evenement, idLivres: Array<number> )
  {
    this.erreur.set( "" ) ;
    this.idLivres.set( idLivres ) ;
    this.evenement.set( evenement ) ;
  }

  onAnnuler()
  {
    this.evenement.set( null ) ;
  }

  onEnregistrer()
  {
    let evenement = this.evenement() ;
    if( !evenement ) return ;
    this.erreur.set( "" ) ;

    if( evenement.titre.trim() == "" || evenement.debut == "" || evenement.numLieu < 0 )
    {
      this.erreur.set( "Le titre, la date de début et le lieu sont obligatoires" ) ;
      return ;
    }

    if( evenement.fin < evenement.debut )
    {
      this.erreur.set( "La fin doit être après le début" ) ;
      return ;
    }

    this.serviceEvenement.majEvenement( this.serviceConfig.mdp, evenement, this.idLivres() ).subscribe( {
      next: () =>
      {
        this.message.set( "Evénement enregistré" ) ;
        this.evenement.set( null ) ;
        this.chargeEvenements() ;
      },
      error: erreur => this.erreurServeur( erreur )
    }) ;
  }

  onSupprimer()
  {
    let evenement = this.evenement() ;
    if( !evenement ) return ;

    this.serviceEvenement.supprimeEvenement( this.serviceConfig.mdp, evenement.id ).subscribe( {
      next: () =>
      {
        this.message.set( "Evénement supprimé" ) ;
        this.evenement.set( null ) ;
        this.chargeEvenements() ;
      },
      error: erreur => this.erreurServeur( erreur )
    }) ;
  }

  private erreurServeur( erreur: any )
  {
    // 403 : mot de passe refusé par le serveur
    if( erreur.status == 403 )
    {
      this.serviceConfig.deconnexion() ;
      this.router.navigateByUrl( "/config" ) ;
    }
    this.erreur.set( erreur.error?.erreur ?? "Erreur lors de l'enregistrement" ) ;
  }

  // Livres présentés

  ouvreChoix( modal: "livres" | "animateur" )
  {
    this.recherche.set( "" ) ;
    if( modal == "livres" ) this.modalLivres.set( true ) ;
    else this.modalAnimateur.set( true ) ;
  }

  estChoisi( livre: Livre ): boolean
  {
    return this.idLivres().includes( livre.id ) ;
  }

  onCocheLivre( livre: Livre, coche: boolean )
  {
    if( coche ) this.idLivres.set( [...this.idLivres(), livre.id] ) ;
    else this.retireLivre( livre.id ) ;
  }

  retireLivre( id: number )
  {
    this.idLivres.set( this.idLivres().filter( i => i != id ) ) ;
  }

  titreLivre( id: number ): string
  {
    return this.livres().find( l => l.id == id )?.titre ?? "Livre " + id ;
  }

  // Animateur

  onChoisirAnimateur( id: number )
  {
    let evenement = this.evenement() ;
    if( evenement ) evenement.idAnimateur = id ;
    this.modalAnimateur.set( false ) ;
  }

  nomPersonne( personne: Personne | undefined ): string
  {
    if( !personne ) return "" ;
    return ( ( personne.prenom ?? "" ) + " " + ( personne.nom ?? "" ) ).trim() ;
  }

  nomAnimateur( id: number ): string
  {
    if( id == null || id < 0 ) return "Aucun" ;
    return this.nomPersonne( this.personnes().find( p => p.id == id ) ) || "Personne " + id ;
  }

  // Affichage

  nomLieu( num: number ): string
  {
    let lieu = this.lieux().find( l => l.num == num ) ;
    if( !lieu ) return "" ;
    if( lieu.type == "stand" ) return "Stand " + lieu.num ;
    return lieu.nom ;
  }

  // ex : Samedi 21 novembre à 14h30
  dateAffichee( date: string ): string
  {
    if( !date ) return "" ;
    let jour = new Date( date.replace( " ", "T" ) ).toLocaleDateString( "fr-FR", { weekday: "long", day: "numeric", month: "long" } ) ;
    return jour.charAt( 0 ).toUpperCase() + jour.substring( 1 ) + " à " + date.substring( 11, 13 ) + "h" + date.substring( 14, 16 ) ;
  }

  // "2026-11-21 14:30:00" (BD) => "2026-11-21T14:30:00" (ion-datetime)
  private dateIonic( date: string | null ): string
  {
    if( !date ) return "" ;
    return date.replace( " ", "T" ).substring( 0, 19 ) ;
  }
}
