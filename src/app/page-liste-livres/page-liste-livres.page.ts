import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonAccordionGroup,
  IonAccordion,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
} from '@ionic/angular';

// À décommenter quand les composants des autres branches seront présents dans ton dépôt
// (adapter les chemins : cette page est dans src/app/page-liste-livres/)
// import { ListeLivresComponent } from '../components/liste-livres/liste-livres.component';
// import { TitreLivreComboComponent } from '../components/titre-livre-combo/titre-livre-combo.component';
// import { NomAuteurComboComponent } from '../components/nom-auteur-combo/nom-auteur-combo.component';
// import { NomExposantComboComponent } from '../components/nom-exposant-combo/nom-exposant-combo.component';

@Component({
  selector: 'app-page-liste-livres',
  templateUrl: './page-liste-livres.page.html',
  styleUrls: ['./page-liste-livres.page.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonBackButton,
    IonAccordionGroup,
    IonAccordion,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
  ],
})
export class PageListeLivresPage {
  saisie = { titreLivre: '', nomAuteur: '', genre: '', nomExposant: '' };
  criteres = { titreLivre: '', nomAuteur: '', genre: '', nomExposant: '' };
  lienPage = '/livre';

  appliquer(): void {
    this.criteres = { ...this.saisie };
  }

  reinitialiser(): void {
    this.saisie = { titreLivre: '', nomAuteur: '', genre: '', nomExposant: '' };
    this.criteres = { ...this.saisie };
  }
}
