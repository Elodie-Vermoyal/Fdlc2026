import { Component, OnChanges, OnInit, input } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { IonList, IonItem } from '@ionic/angular';
import { EvenementService } from '../../services/evenement.service';
import { Evenement } from '../../modeles/Evenement'; // Ajustez si le fichier s'appelle Evenements.ts

@Component({
  selector: 'app-liste-evenements',
  templateUrl: './liste-evenements.component.html',
  styleUrls: ['./liste-evenements.component.scss'],
  imports: [IonList, IonItem, AsyncPipe, RouterLink],
})
export class ListeEvenementsComponent implements OnInit, OnChanges {
  childHtml = input<string>("$titre <strong>$stitre</strong>");
  lienPage = input<string>("/page-evenement");
  nom = input<string>("");
  protected listeEvenements: Observable<Evenement[]> | null = null;

  constructor(private serviceEvenement: EvenementService) {}

  ngOnInit() { 
    this.actualiserListe(); 
  }
  
  ngOnChanges() { 
    this.actualiserListe(); 
  }

  private actualiserListe() {
    this.listeEvenements = this.serviceEvenement.getTousLesEvenements(this.nom());
  }

  itemText(evenement: Evenement): string {
    return this.childHtml()
      .replace("$titre", String(evenement.titre ?? ''))
      .replace("$civilite", evenement.stitre ?? '');
  }
}