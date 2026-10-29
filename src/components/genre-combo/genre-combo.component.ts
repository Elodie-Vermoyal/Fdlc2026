import { Component, OnInit, input, output, signal } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { LivreService } from '../../servcies/livre.service';
import { 
  IonInput,
  IonList,
  IonItem,
  IonCard,
  IonCardContent,
} from '@ionic/angular';

@Component({
  selector: 'app-genre-combo',
  templateUrl: './genre-combo.component.html',
  styleUrls: ['./genre-combo.component.scss'],
  imports: [
    IonInput,
    IonList,
    IonItem,
    IonCard,
    IonCardContent,
    AsyncPipe,
    FormsModule
  ],
})
export class GenreComboComponent implements OnInit 
{
  protected listeGenres: Observable<Array<{ genre: string }>> | null = null ;
  protected serviceLivre: LivreService ;

  protected genre: string = "" ;
  protected showList = signal(false) ;

  public label = input("Genre") ;
  public onGenreSelected = output<string>() ;

  constructor( serviceLivre: LivreService ) 
  { 
    this.serviceLivre = serviceLivre ;
  }

  ngOnInit() 
  {
    this.listeGenres = this.serviceLivre.getGenres() ;
  }

  onGenreChanged( event: any ) 
  {
    this.showList.set( true ) ;
    this.onGenreSelected.emit( this.genre ) ;
  }

  onClickGenreSelected( genre: string ) 
  {
    this.showList.set( false ) ;
    this.genre = genre ;
    this.onGenreSelected.emit( this.genre ) ;
  }

  onInputClick( event: MouseEvent ) 
  {
    this.showList.set( !this.showList() ) ;
  }

  masqueListe() 
  {
    this.showList.set( false ) ;
  }

  reset()
  {
    this.genre = "" ;
    this.showList.set( false ) ;
  }
}
