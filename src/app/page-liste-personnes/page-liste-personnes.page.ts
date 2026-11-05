import { Component, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonMenuButton, IonBackButton, IonAccordion, IonAccordionGroup, IonItem, IonLabel, IonInput, IonButton, IonList } from '@ionic/angular';
import { ListePersonnesComponent } from '../../components/liste-personnes/liste-personnes.component';

@Component({
  selector: 'app-page-liste-personnes',
  templateUrl: './page-liste-personnes.page.html',
  styleUrls: ['./page-liste-personnes.page.scss'],
  imports: [CommonModule, FormsModule, IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonMenuButton, IonBackButton, IonAccordion, IonAccordionGroup, IonItem, IonLabel, IonInput, IonButton, IonList, ListePersonnesComponent],
})
export class PageListePersonnesPage {
  protected listePersonnes = viewChild(ListePersonnesComponent);
  public saisieNom = "";
  public nom = "";

  onFiltrer() { this.nom = this.saisieNom.trim(); }
  reinitialiser() { this.saisieNom = ""; this.nom = ""; }
}
