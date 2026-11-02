
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { Personne } from '../../modeles/personne';
import { PersonneService } from '../../servcies/personne.service';

import {IonContent, IonHeader, IonTitle, IonToolbar} from '@ionic/angular';

@Component({
  selector: 'app-page-personne',
  templateUrl: './page-personne.page.html',
  styleUrls: ['./page-personne.page.scss'],
  imports: [ IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class PagePersonnePage implements OnInit {

  // Identifiant de la personne à afficher
  protected idPersonne: number = 0;

  // Informations récupérées depuis le service
  protected personne: Observable<Personne> | null = null;

  constructor(
    private route: ActivatedRoute,
    private personneService: PersonneService
  ) {}

  ngOnInit() {

    // Récupérer l'identifiant dans l'URL
    const id = this.route.snapshot.paramMap.get('id');

    // Convertir l'identifiant en nombre
    this.idPersonne = Number(id);

    console.log('Identifiant de la personne :', this.idPersonne);

    // Récupérer les informations de la personne
    if (this.idPersonne > 0) {
      this.personne = this.personneService.getPersonne(this.idPersonne);
    }
  }
}
