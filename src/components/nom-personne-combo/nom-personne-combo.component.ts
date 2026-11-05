import { Component, OnInit, input, output, signal } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import {Observable} from "rxjs" ;
import { FormsModule } from '@angular/forms';

import { 
  IonInput,
  IonList,
  IonItem,
  IonCard,
  IonCardContent,
 } from '@ionic/angular';

import {PersonneService } from '../../services/personne.service';
import {Personne} from "../../modeles/Personne" ;


@Component({
  selector: 'app-nom-personne-combo',
  templateUrl: './nom-personne-combo.component.html',
  styleUrls: ['./nom-personne-combo.component.scss'],
  imports: [
    IonInput,
    IonList,
    IonItem,
    IonCard,
    IonCardContent,
    AsyncPipe,    
    FormsModule
  ],
})
export class NomPersonneComboComponent  implements OnInit 
{

  protected listePersonnes: Observable<Array<Personne>> | null = null ;
  protected servicePersonne: PersonneService ;

  protected nom: string = "" ;

  // Gestion de l'affichage de la liste, utilise un signal pour provoquer
  // l'actualisation de l'affichage quand la valeur de l'attribut est modifée
  protected showList = signal(false) ;

  // Comunication avec le web component parent
  public    label = input("Personne") ;
  public    onPersonneSelected = output<string>() ;

  constructor( servicePersonne: PersonneService ) 
  { 
    this.servicePersonne = servicePersonne ;
  }

  ngOnInit() 
  {
    this.listePersonnes = this.servicePersonne.getToutesLesPersonnes() ;
  }

  // Exécuté quand l'utilisateur modifie le nom dans l'ion-input
  onNomChanged( event: any )
  {
    // Rafraichie la liste des personnes à chaque frappe de touche
    this.listePersonnes = this.servicePersonne.getToutesLesPersonnes( this.nom ) ;
    this.showList.set( true ) ;

    // Déclenche l'événement onPersonneSelected dans le web component parent
    this.onPersonneSelected.emit( this.nom ) ;
  }

  // Exécuté quand l'itulisateur clique sur une ligne de la liste
  onClickPersonneSelected( nom: string, prenom: string )
  {
    this.showList.set( false ) ;
    this.nom = nom ;

    // Déclenche l'événement onPersonneSelected dans le web component parent
    this.onPersonneSelected.emit( this.nom ) ;
  }

  // Exécuté quand l'utilisateur clique sur l'ion-input
  onInputClick( event: MouseEvent )
  {
    // Switch le mode d'affichage de la liste
    this.showList.set( !this.showList() ) ;
  }

  // Masque la liste
  masqueListe()
  {
    this.showList.set( false ) ;
  }
}
