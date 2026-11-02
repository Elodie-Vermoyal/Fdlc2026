import { Component, OnInit, OnChanges, input } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';


import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonBackButton,
 } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Exposant } from '../../modeles/Exposant';
import { ExposantService } from '../../servcies/exopsant.service';

@Component({
  selector: 'app-page-exposant',
  templateUrl: './page-exposant.page.html',
  styleUrls: ['./page-exposant.page.scss'],
  imports: [
    IonContent, 
    IonHeader, 
    IonTitle, 
    IonToolbar, 
    IonButtons,
    IonMenuButton,
    IonBackButton,
    CommonModule, 
    FormsModule]
})
export class PageExposantPage implements OnInit 
{
  public id = input<number>( -1 ) ;

  protected exposants: Observable<Array<Exposant>> | null = null ;
  protected serviceExposant: ExposantService ;

  constructor( serviceExposant: ExposantService ) 
  { 
    this.serviceExposant = serviceExposant ;
  }
  
  ngOnInit() 
  {
    this.exposants = this.serviceExposant.getExposantById( this.id() ) ;
  }
}
