import { Component, OnInit, OnChanges, input } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import {Observable} from "rxjs" ;
import { ExposantService } from '../../services/exposant.service';
import {Exposant} from "../../modeles/Exposant" ;
import { 
  IonList,
  IonItem,
 } from '@ionic/angular';

@Component({
  selector: 'app-liste-exposant',
  templateUrl: './liste-exposant.component.html',
  styleUrls: ['./liste-exposant.component.scss'],
  imports: [
    IonList,
    IonItem,
    AsyncPipe,
    RouterLink
  ],
})
export class ListeExposantComponent  implements OnInit, OnChanges 
{
  // Format de chaque ligne affiché
  childHtml = input<string>( "$id $nom stand n° $numLieu ") ;

  // Route de la page à appeler quand on clique sur une ligne de la liste
  lienPage = input<string>( "/page-exposant" ) ;

  // Critères de filtration
  nomPersonne = input<string>( "" ) ;
  nomLieu = input<string>( "" ) ;

  protected listeExposants: Observable<Array<Exposant>> | null = null ;
  protected serviceExposant: ExposantService ;

  constructor( serviceExposant: ExposantService ) 
  { 
    this.serviceExposant = serviceExposant ;
  }

  ngOnInit() 
  {
    this.listeExposants = this.serviceExposant.getTousLesExposants( this.nomPersonne(), this.nomLieu() ) ;
  }

  // Rafraichit la liste quand les parametres d'input sont modifiés 
  ngOnChanges()
  {
    this.listeExposants = this.serviceExposant.getTousLesExposants( this.nomPersonne(), this.nomLieu() ) ;
  }

  // Met en forme le texte affiché dans chaque ligne de la liste
  itemText( exposant: Exposant) : string
  {
    let childHtml = this.childHtml() ;
    childHtml = childHtml.replace("$id", exposant.id.toString() ) ;
    childHtml = childHtml.replace("$nom", exposant.nom ) ;
    childHtml = childHtml.replace("$nomLieu", exposant.nomLieu ) ;
    return childHtml ;
  }

}
