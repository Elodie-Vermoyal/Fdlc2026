import { Component, viewChild, signal } from '@angular/core';
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
  IonAccordionGroup,
  IonAccordion,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonFooter,
  IonAlert,
} from '@ionic/angular';

import { ListeEtapesComponent } from '../../components/liste-etapes/liste-etapes.component';
import { Etape } from '../../modeles/Etape';

@Component({
  selector: 'app-page-planning-personnel',
  templateUrl: './page-planning-personnel.page.html',
  styleUrls: ['./page-planning-personnel.page.scss'],
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonBackButton,
    IonAccordionGroup,
    IonAccordion,
    IonList,
    IonItem,
    IonLabel,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonButton,
    IonFooter,
    IonAlert,
    CommonModule,
    FormsModule,
    ListeEtapesComponent
  ]
})
export class PagePlanningPersonnelPage
{
  // Référence du web component affichant les étapes
  protected listeEtapes = viewChild(ListeEtapesComponent) ;

  // Valeurs saisies dans l'accordion de recherche
  public flt_nom: string = "" ;
  public flt_type: string = "" ;
  public flt_jour: string = "" ;
  public flt_debut: string = "" ;

  // Critères transmis à app-liste-etapes quand on clique sur Filtrer
  public nom: string = "" ;
  public type: string = "" ;
  public jour: string = "" ;
  public debut: string = "" ;

  protected readonly heures = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"] ;

  protected nbEtapes = signal( Etape.lesEtapes.length ) ;
  protected alerteVider = signal(false) ;

  protected readonly boutonsVider = [
    { text: "Annuler", role: "cancel" },
    { text: "Vider", role: "destructive", handler: () => this.videPlanning() }
  ] ;

  constructor()
  {
  }

  // Appelé par Ionic a chaque fois qu'on revient sur la page,
  // pour afficher les etapes ajoutees depuis les autres pages
  ionViewWillEnter()
  {
    this.rafraichit() ;
  }

  rafraichit()
  {
    this.listeEtapes()?.rafraichit() ;
    this.nbEtapes.set( Etape.lesEtapes.length ) ;
  }

  onFiltrer()
  {
    this.nom = this.flt_nom ;
    this.type = this.flt_type ;
    this.jour = this.flt_jour ;
    this.debut = this.flt_debut ;
    this.fermeRechercher() ;
  }

  onEffacer()
  {
    this.flt_nom = this.flt_type = this.flt_jour = this.flt_debut = "" ;
    this.onFiltrer() ;
  }

  fermeRechercher()
  {
    // Referme l'accordion group
    let accordionGroup = document.getElementById( "planning-personnel-accordion" ) ;
    if( accordionGroup ) (accordionGroup as HTMLInputElement).value = "" ;
  }

  private videPlanning()
  {
    Etape.videPlanning() ;
    this.rafraichit() ;
  }
}
