import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonList,
  IonListHeader,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonNote,
  IonToast,
  IonModal,
} from '@ionic/angular';

import { ConfigService } from '../../services/config.service';

// Page principale de configuration (pas dans le menu) : on se connecte une fois
// avec le mot de passe puis on accède aux autres pages de config
@Component({
  selector: 'app-page-config',
  templateUrl: './page-config.page.html',
  styleUrls: ['./page-config.page.scss'],
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonList,
    IonListHeader,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonNote,
    IonToast,
    IonModal,
    FormsModule,
    RouterLink
  ]
})
export class PageConfigPage
{
  protected serviceConfig: ConfigService ;

  protected mdp: string = "" ;
  protected erreurMdp = signal(false) ;

  // Changement du mot de passe
  protected modalMdp = signal(false) ;
  protected ancienMdp: string = "" ;
  protected nouveauMdp: string = "" ;
  protected confirmationMdp: string = "" ;
  protected erreurChangement = signal("") ;

  protected message = signal("") ;

  constructor( serviceConfig: ConfigService )
  {
    this.serviceConfig = serviceConfig ;
  }

  onConnexion()
  {
    this.serviceConfig.verifieMotDePasse( this.mdp ).subscribe( reponse =>
    {
      this.erreurMdp.set( !reponse.ok ) ;
      if( reponse.ok ) this.serviceConfig.connexion( this.mdp ) ;
      this.mdp = "" ;
    }) ;
  }

  onDeconnexion()
  {
    this.serviceConfig.deconnexion() ;
  }

  ouvreChangementMdp()
  {
    this.ancienMdp = this.nouveauMdp = this.confirmationMdp = "" ;
    this.erreurChangement.set( "" ) ;
    this.modalMdp.set( true ) ;
  }

  onChangerMdp()
  {
    if( this.nouveauMdp != this.confirmationMdp )
    {
      this.erreurChangement.set( "Les deux nouveaux mots de passe sont différents" ) ;
      return ;
    }

    this.serviceConfig.changeMotDePasse( this.ancienMdp, this.nouveauMdp ).subscribe( {
      next: () =>
      {
        // le nouveau mot de passe sert pour les prochains enregistrements
        this.serviceConfig.connexion( this.nouveauMdp ) ;
        this.modalMdp.set( false ) ;
        this.message.set( "Mot de passe modifié" ) ;
      },
      error: erreur => this.erreurChangement.set( erreur.error?.erreur ?? "Erreur lors du changement" )
    }) ;
  }
}
