import { Component, OnInit, viewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {Observable} from "rxjs" ;
import { ExposantService } from '../../services/exposant.service';
import {Exposant} from "../../modeles/Exposant" ;
import {ListeExposantComponent} from "../../components/liste-exposant/liste-exposant.component"
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar, 
  IonButtons, 
  IonMenuButton, 
  IonBackButton, 
  IonAccordion, 
  IonList,
  IonItem, 
  IonLabel, 
  IonButton,
  IonAccordionGroup,
} from '@ionic/angular';

import {NomLieuComboComponent} from "../../components/nom-lieu-combo/nom-lieu-combo.component" ;
import { NomPersonneComboComponent } from '../../components/nom-personne-combo/nom-personne-combo.component';

@Component({
  selector: 'app-liste-exposants-page',
  templateUrl: './liste-exposants-page.page.html',
  styleUrls: ['./liste-exposants-page.page.scss'],
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonBackButton,
    IonAccordion,
    IonList,
    IonItem,
    IonLabel,
    IonButton,
    CommonModule,
    ListeExposantComponent,
    FormsModule,
    IonAccordionGroup,
    NomLieuComboComponent,
    NomPersonneComboComponent
]
})
export class ListeExposantsPagePage implements OnInit 
{
  // Recupère les références de web component fils
  protected listeExposant = viewChild(ListeExposantComponent);
  protected nomLieuCombo = viewChild(NomLieuComboComponent);
  protected nomPersonneCombo = viewChild(NomPersonneComboComponent);

  // Valeurs récupérées des web component de filtration
  public flt_nomAuteur: string = "" ;
  public flt_nomLieu: string = "" ;

  // Critères de rechercher d'un ensemble d'exposant
  public nomAuteur: string = "" ;
  public nomLieu: string = "" ;

  constructor() 
  { 
  }

  ngOnInit() 
  {
  }

  onAuteurSelected( nom: string )
  {
    this.flt_nomAuteur = nom ;
  }

  onLieuSelected( nom: string )
  {
    this.flt_nomLieu = nom ;
  }

  fermeRechercherFiltrer()
  {
    // Referme l'accordion group
    let accordionGroup = document.getElementById( "liste-exposants-page-accordion" ) ;
    if( accordionGroup ) (accordionGroup as HTMLInputElement).value = "" ;
  }

  onFiltrer()
  {
    this.nomAuteur = this.flt_nomAuteur ;
    this.nomLieu = this.flt_nomLieu ;

    // Masque les listes de recherche 
    this.nomLieuCombo()?.masqueListe() ;
    this.nomPersonneCombo()?.masqueListe() ;
  }
}
