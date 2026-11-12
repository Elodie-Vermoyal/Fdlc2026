import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonList, IonItem } from '@ionic/angular';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EvenementService } from '../../services/evenement.service';
import { Evenement } from '../../modeles/Evenement';

@Component({
  selector: 'app-liste-evenements',
  templateUrl: './liste-evenements.component.html',
  styleUrls: ['./liste-evenements.component.scss'],
  standalone: true,
  imports: [CommonModule, IonList, IonItem, RouterLink]
})
export class ListeEvenementsComponent implements OnInit, OnChanges {
  @Input() titrePartie: string = '';
  @Input() debut: string = '';
  @Input() nomAnimateurPartie: string = '';
  @Input() titreLivrePartie: string = '';
  @Input() lienPage: string = '/detail-evenement';

  listeEvenements!: Observable<Evenement[]>;
  evenementsFiltres$!: Observable<any[]>;

  constructor(private evenementService: EvenementService) {}

  ngOnInit() {
    this.chargerEvenements();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.chargerEvenements();
  }

  chargerEvenements() {
    this.listeEvenements = this.evenementService.getTousLesEvenements(
      this.titrePartie,
      this.debut,
      this.nomAnimateurPartie,
      this.titreLivrePartie
    );

    this.evenementsFiltres$ = this.listeEvenements.pipe(
      map((evenements: any[]) =>
        evenements.filter(e => {
          if (!e.debut || e.debut.trim() === '' || e.jour === 'Tout le temps') {
            return true;
          }
          return e.jour === 'Samedi' || e.jour === 'Dimanche';
        })
      )
    );
  }
}