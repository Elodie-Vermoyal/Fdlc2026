
import { Component, OnInit, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { Personne } from '../../modeles/Personne';
import { PersonneService } from '../../services/personne.service';

import {IonContent, IonHeader, IonTitle, IonToolbar, IonImg} from '@ionic/angular';

@Component({
  selector: 'app-page-personne',
  templateUrl: './page-personne.page.html',
  styleUrls: ['./page-personne.page.scss'],
  imports: [ IonContent, IonHeader, IonTitle, IonImg, IonToolbar, CommonModule, FormsModule]
})
export class PagePersonnePage implements OnInit {

  // Identifiant de la personne à afficher
  protected id= input<number>( -1 ) ;

  // Informations récupérées depuis le service
  protected personne: Observable<Personne> | null = null;

  constructor(
    private route: ActivatedRoute,
    private personneService: PersonneService
  ) {}

  ngOnInit() 
  {
    console.log('Identifiant de la personne :', this.id());

    // Récupérer les informations de la personne
    if (this.id() > -1) 
    {
      this.personne = this.personneService.getPersonneById(this.id() );
    }
  }
}
