import { Component, OnInit, input, output, signal } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import {Observable} from "rxjs" ;
import { FormsModule } from '@angular/forms';

import {LieuService } from '../../services/lieu.service';
import {Lieu} from "../../modeles/Lieu" ;

import { 
  IonInput,
  IonList,
  IonItem,
  IonCard,
  IonCardContent,
 } from '@ionic/angular';

@Component({
  selector: 'app-nom-lieu-combo',
  templateUrl: './nom-lieu-combo.component.html',
  styleUrls: ['./nom-lieu-combo.component.scss'],
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
export class NomLieuComboComponent  implements OnInit 
{
  protected listeLieux: Observable<Array<Lieu>> | null = null ;
  protected serviceLieu: LieuService ;
  
  protected nom: string = "" ;
  protected type: string = "" ;

  // Gestion de l'affichage de la liste, utilise un signal pour provoquer
  // l'actualisation de l'affichage quand la valeur de l'attribut est modifée
  protected showList = signal(false) ;

  // Communication avec Web component parent
  public    label = input("Lieu") ;
  public    typeLieu = input("") ;
  public    onLieuSelected = output<string>() ;

  constructor( serviceLieu: LieuService ) 
  { 
    this.serviceLieu = serviceLieu ;
  }

  ngOnInit() 
  {
    this.listeLieux = this.serviceLieu.getTousLesLieux( "", this.typeLieu() ) ;
  }

  // Exécuté quand l'utilisateur modifie le nom dans l'ion-input
  onNomChanged( event: any )
  {
    // Raffraichit la liste à chaque frappe d'une touche
    this.listeLieux = this.serviceLieu.getTousLesLieux( this.nom, this.typeLieu() ) ;
    this.showList.set( true ) ;
    // Envoie l'événement onLieuSelected au web component parent 
    this.onLieuSelected.emit( this.nom ) ;
  }

  // Exécuté quand on clique sur une ligne de la liste
  onClickLieuSelected( nom: string )
  {
    this.showList.set( false ) ;
    this.nom = nom ;
    // Envoie l'événement onLieuSelected au web component parent 
    this.onLieuSelected.emit( this.nom ) ;
  }

  // Affiche ou masque la liste quand on clique sur le champ de recherche
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
