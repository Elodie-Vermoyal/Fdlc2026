    import { Component, OnInit, OnChanges, input } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { EvenementService } from '../../services/evenement.service';
import { Evenement } from '../../modeles/Evenement';
import { 
  IonList,
  IonItem,
} from '@ionic/angular';

@Component({
  selector: 'app-liste-evenements',
  templateUrl: './liste-evenements.component.html',
  styleUrls: ['./liste-evenements.component.scss'],
  standalone: true,
  imports: [
    IonList,
    IonItem,
    AsyncPipe,
    RouterLink
  ],
})
export class ListeEvenementsComponent implements OnInit, OnChanges {
  childHtml = input<string>("$titre - Début : $debut ($nomLieu)");
  lienPage = input<string>("/page-evenement");

  titrePartie = input<string>("");
  debut = input<string>("");
  nomAnimateurPartie = input<string>("");
  titreLivrePartie = input<string>("");

  protected listeEvenements: Observable<Array<Evenement>> | null = null;
  protected serviceEvenement: EvenementService;

  constructor(serviceEvenement: EvenementService) {
    this.serviceEvenement = serviceEvenement;
  }

  ngOnInit() {
    this.actualiser();
  }

  ngOnChanges() {
    this.actualiser();
  }

  private actualiser() {
    this.listeEvenements = this.serviceEvenement.getTousLesEvenements(
      this.titrePartie(),
      this.debut(),
      this.nomAnimateurPartie(),
      this.titreLivrePartie()
    );
  }

  itemText(evenement: Evenement): string {
    let html = this.childHtml();
    html = html.replace("$id", evenement.id ? evenement.id.toString() : "");
    html = html.replace("$titre", evenement.titre ?? "");
    html = html.replace("$debut", evenement.debut ? evenement.debut.toString() : "");
    html = html.replace("$nomLieu", evenement.numLieu ? evenement.numLieu.toString() : "Lieu non défini");
    html = html.replace("$nomAnimateur", evenement.idAnimateur ? evenement.idAnimateur.toString() :"");
    return html;
  }
}