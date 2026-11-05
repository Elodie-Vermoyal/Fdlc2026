import { Component, OnInit, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { addIcons } from 'ionicons';
import { calendarOutline, createOutline, eyeOutline, trashOutline } from 'ionicons/icons';

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
  IonAlert,
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
    IonAlert,
    FormsModule,
    RouterLink
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

  public    label = input( "Planifier" ) ;
  public    onEtapeAjoutee = output<Etape>() ;

  protected readonly debutFestival = Etape.debutFestival ;
  protected readonly finFestival = Etape.finFestival ;

  protected heureChoisie: string = "2026-11-21T10:00:00" ;

  protected modalOuvert = signal(false) ;
  protected message = signal("") ;

  // Etape du planning si l'element est deja planifie
  protected etape = signal<Etape | undefined>( undefined ) ;

  protected alerteRetirer = signal(false) ;
  protected readonly boutonsRetirer = [
    { text: "Annuler", role: "cancel" },
    { text: "Retirer", role: "destructive", handler: () => this.retire() }
  ] ;

  constructor()
  {
    addIcons( { calendarOutline, createOutline, eyeOutline, trashOutline } ) ;
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

  // Bouton Modifier le rappel : on repart de l'heure deja choisie
  onModifier()
  {
    let etape = this.etape() ;
    if( etape ) this.heureChoisie = etape.debut ;
    this.modalOuvert.set( true ) ;
  }

  // Bouton Ajouter ou Modifier de la fenetre
  onValideHeure()
  {
    this.modalOuvert.set( false ) ;

    let etape = this.etape() ;
    if( etape )
    {
      Etape.changeHeure( etape.id, this.heureChoisie ) ;
      this.message.set( "Rappel déplacé : " + etape.getJour().toLowerCase() + " à " + etape.getHeure() ) ;
      this.majEtat() ;
    }
    else
    {
      this.ajoute( this.heureChoisie ) ;
    }
  }

  private retire()
  {
    let etape = this.etape() ;
    if( !etape ) return ;

    Etape.supprimeEtape( etape.id ) ;
    this.message.set( "Retiré de votre planning" ) ;
    this.majEtat() ;
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
    this.etape.set( Etape.trouveEtape( this.numLieu(), this.idEvenement(), this.idExposant(), this.idPersonne() ) ) ;
  }
}
