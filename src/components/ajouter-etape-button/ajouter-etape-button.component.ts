import { Component, OnInit, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import { calendarOutline, checkmarkCircleOutline } from 'ionicons/icons';

import {
  IonButton,
  IonIcon,
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonContent,
  IonDatetime,
  IonToast,
 } from '@ionic/angular';

import { Etape } from '../../modeles/Etape';

@Component({
  selector: 'app-ajouter-etape-button',
  templateUrl: './ajouter-etape-button.component.html',
  styleUrls: ['./ajouter-etape-button.component.scss'],
  imports: [
    IonButton,
    IonIcon,
    IonModal,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonContent,
    IonDatetime,
    IonToast,
    FormsModule
  ],
})
export class AjouterEtapeButtonComponent implements OnInit
{
  // Element à ajouter au planning (un seul des id est renseigné)
  public    nom = input.required<string>() ;
  public    numLieu = input<number>( -1 ) ;
  public    idEvenement = input<number>( -1 ) ;
  public    idExposant = input<number>( -1 ) ;
  public    idPersonne = input<number>( -1 ) ;

  // Pour un evenement l'heure est connue, sinon l'utilisateur la choisit
  public    debut = input<string>( "" ) ;

  public    label = input( "Plannifier" ) ;
  public    onEtapeAjoutee = output<Etape>() ;

  protected readonly debutFestival = Etape.debutFestival ;
  protected readonly finFestival = Etape.finFestival ;

  protected heureChoisie: string = "2026-11-21T10:00:00" ;

  protected modalOuvert = signal(false) ;
  protected dejaPlannifie = signal(false) ;
  protected message = signal("") ;

  constructor()
  {
    addIcons( { calendarOutline, checkmarkCircleOutline } ) ;
  }

  ngOnInit()
  {
    this.majEtat() ;
  }

  onClick()
  {
    if( this.debut() != "" )
    {
      this.ajoute( this.debut() ) ;
    }
    else
    {
      this.modalOuvert.set( true ) ;
    }
  }

  // Bouton Ajouter de la fenetre
  onValideHeure()
  {
    this.modalOuvert.set( false ) ;
    this.ajoute( this.heureChoisie ) ;
  }

  private ajoute( debut: string )
  {
    let etape = Etape.ajouteEtape( debut, this.nom(), this.numLieu(),
                                   this.idEvenement(), this.idExposant(), this.idPersonne() ) ;

    if( etape )
    {
      this.message.set( "Ajouté à votre planning : " + etape.getJour().toLowerCase() + " à " + etape.getHeure() ) ;
      this.onEtapeAjoutee.emit( etape ) ;
    }
    else
    {
      this.message.set( "Déjà dans votre planning à cette heure-là" ) ;
    }

    this.majEtat() ;
  }

  private majEtat()
  {
    this.dejaPlannifie.set( Etape.estPlannifie( this.numLieu(), this.idEvenement(), this.idExposant(), this.idPersonne() ) ) ;
  }
}
