import { Component, OnChanges, OnInit, input } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { IonList, IonItem } from '@ionic/angular';
import { PersonneService } from '../../servcies/personne.service';
import { Personne } from '../../modeles/Personne';

@Component({
  selector: 'app-liste-personnes',
  templateUrl: './liste-personnes.component.html',
  styleUrls: ['./liste-personnes.component.scss'],
  imports: [IonList, IonItem, AsyncPipe, RouterLink],
})
export class ListePersonnesComponent implements OnInit, OnChanges {
  childHtml = input<string>("$civilite <strong>$prenom $nom</strong> — $specialite");
  lienPage = input<string>("/page-personne");
  nom = input<string>("");
  protected listePersonnes: Observable<Personne[]> | null = null;

  constructor(private servicePersonne: PersonneService) {}

  ngOnInit() { this.actualiserListe(); }
  ngOnChanges() { this.actualiserListe(); }

  private actualiserListe() {
    this.listePersonnes = this.servicePersonne.getToutesLesPersonnes(this.nom());
  }

  itemText(personne: Personne): string {
    return this.childHtml()
      .replace("$id", String(personne.id))
      .replace("$civilite", personne.civilite ?? "")
      .replace("$prenom", personne.prenom ?? "")
      .replace("$nom", personne.nom ?? "")
      .replace("$specialite", (personne as any).specialite ?? "");
  }
}
