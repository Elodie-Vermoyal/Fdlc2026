import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { LieuService } from '../../servcies/lieu.service';
import { Lieu } from '../../modeles/Lieu';

import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonList,
  IonItem,
  IonLabel,
} from '@ionic/angular';

@Component({
  selector: 'app-page-plan-hall',
  templateUrl: './page-plan-hall.page.html',
  styleUrls: ['./page-plan-hall.page.scss'],
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonList,
    IonItem,
    IonLabel,
    CommonModule
  ]
})
export class PagePlanHallPage implements OnInit
{
  // Entrées de la page : hall à afficher et lieu à repérer sur le plan
  protected numHall: number = 0;
  protected numLieu: number = 0;

  protected listeLieux: Observable<Array<Lieu>> | null = null;

  constructor(
    private route: ActivatedRoute,
    private serviceLieu: LieuService
  ) {}

  ngOnInit()
  {
    this.numHall = Number( this.route.snapshot.paramMap.get('numHall') );
    this.numLieu = Number( this.route.snapshot.queryParamMap.get('numLieu') );

    this.listeLieux = this.serviceLieu.getTousLesLieux();
  }

  // À brancher sur page-lieu quand la page sera disponible
  onClickLieu( num: number )
  {
    console.log( 'Afficher la page du lieu', num );
  }
}