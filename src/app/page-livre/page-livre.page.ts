import { Component, OnInit, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LivreService } from '../../servcies/livre.service';
import { Livre } from '../../modeles/Livre';
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonBackButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
} from '@ionic/angular';

@Component({
  selector: 'app-page-livre',
  templateUrl: './page-livre.page.html',
  styleUrls: ['./page-livre.page.scss'],
  imports: [
    IonContent, 
    IonHeader, 
    IonTitle, 
    IonToolbar, 
    IonButtons,
    IonMenuButton,
    IonBackButton,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    CommonModule, 
    FormsModule
  ]
})
export class PageLivrePage implements OnInit 
{
  public id = input<number>( -1 ) ;
  public livre: Livre | null = null ;

  constructor( private serviceLivre: LivreService ) {}

  ngOnInit() 
  {
    const bookId = Number( this.id() ) ;
    if( bookId > 0 )
    {
      this.serviceLivre.getLivreById( bookId ).subscribe({
        next: ( data ) => { this.livre = data ; },
        error: ( err ) => { console.error( err ) ; }
      }) ;
    }
  }
}
