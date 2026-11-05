import { Component, OnInit, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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

import { ListeLivresComponent } from '../../components/liste-livres/liste-livres.component';
import { TitreLivreComboComponent } from '../../components/titre-livre-combo/titre-livre-combo.component';
import { NomPersonneComboComponent } from '../../components/nom-personne-combo/nom-personne-combo.component';
import { GenreComboComponent } from '../../components/genre-combo/genre-combo.component';
import { NomExposantComboComponent } from '../../components/nom-exposant-combo/nom-exposant-combo.component';

@Component({
  selector: 'app-liste-livres-page',
  templateUrl: './liste-livres-page.page.html',
  styleUrls: ['./liste-livres-page.page.scss'],
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
    IonAccordionGroup,
    CommonModule,
    FormsModule,
    ListeLivresComponent,
    TitreLivreComboComponent,
    NomPersonneComboComponent,
    // GenreComboComponent, (filtre genre en commentaire dans la page)
    NomExposantComboComponent
  ]
})
export class ListeLivresPagePage implements OnInit 
{
  // Récupère les références des web components fils
  protected listeLivres = viewChild(ListeLivresComponent);
  protected titreLivreCombo = viewChild(TitreLivreComboComponent);
  protected nomPersonneCombo = viewChild(NomPersonneComboComponent);
  protected genreCombo = viewChild(GenreComboComponent);
  protected nomExposantCombo = viewChild(NomExposantComboComponent);

  // Valeurs temporaires sélectionnées dans les combos
  public flt_titre: string = "" ;
  public flt_nomAuteur: string = "" ;
  public flt_genre: string = "" ;
  public flt_nomExposant: string = "" ;

  // Critères appliqués pour la filtration des livres
  public titre: string = "" ;
  public nomAuteur: string = "" ;
  public genre: string = "" ;
  public nomExposant: string = "" ;

  constructor() {}

  ngOnInit() {}

  onTitreSelected( titre: string ) 
  {
    this.flt_titre = titre ;
  }

  onAuteurSelected( nom: string ) 
  {
    this.flt_nomAuteur = nom ;
  }

  onGenreSelected( genre: string ) 
  {
    this.flt_genre = genre ;
  }

  onExposantSelected( exposant: string ) 
  {
    this.flt_nomExposant = exposant ;
  }

  fermeRechercherFiltrer() 
  {
    let accordionGroup = document.getElementById( "liste-livres-page-accordion" ) ;
    if( accordionGroup ) (accordionGroup as HTMLInputElement).value = "" ;
  }

  onFiltrer() 
  {
    this.titre = this.flt_titre ;
    this.nomAuteur = this.flt_nomAuteur ;
    this.genre = this.flt_genre ;
    this.nomExposant = this.flt_nomExposant ;

    // Masque les listes déroulantes de recherche
    this.titreLivreCombo()?.masqueListe() ;
    this.nomPersonneCombo()?.masqueListe() ;
    this.genreCombo()?.masqueListe() ;
    this.nomExposantCombo()?.masqueListe() ;

    this.fermeRechercherFiltrer() ;
  }

  onReinitialiser() 
  {
    this.flt_titre = "" ;
    this.flt_nomAuteur = "" ;
    this.flt_genre = "" ;
    this.flt_nomExposant = "" ;

    this.titre = "" ;
    this.nomAuteur = "" ;
    this.genre = "" ;
    this.nomExposant = "" ;

    this.titreLivreCombo()?.reset() ;
    this.nomPersonneCombo()?.masqueListe() ;
    this.genreCombo()?.reset() ;
    this.nomExposantCombo()?.reset() ;

    this.fermeRechercherFiltrer() ;
  }
}
