
import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent
} from '@ionic/angular';

import { Exposant } from '../../modeles/Exposant';
import { ExposantService } from '../../servcies/exopsant.service';

@Component({
  selector: 'app-exposant-card',
  templateUrl: './exposant-card.component.html',
  styleUrls: ['./exposant-card.component.scss'],
  imports: [
    CommonModule,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent
  ],
})
export class ExposantCardComponent implements OnInit {

  @Input() id!: number;

  protected exposants: Observable<Exposant[]> | null = null;

  constructor(private serviceExposant: ExposantService) {}

  ngOnInit() {
    this.exposants = this.serviceExposant.getExposantParId(this.id);
  }

}
