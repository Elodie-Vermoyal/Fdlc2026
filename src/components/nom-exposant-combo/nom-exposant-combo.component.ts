import { Component, OnInit, input, output, signal } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { ExposantService } from '../../servcies/exopsant.service';
import { Exposant } from '../../modeles/Exposant';
import { 
  IonInput,
  IonList,
  IonItem,
  IonCard,
  IonCardContent,
} from '@ionic/angular';

@Component({
  selector: 'app-nom-exposant-combo',
  templateUrl: './nom-exposant-combo.component.html',
  styleUrls: ['./nom-exposant-combo.component.scss'],
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
export class NomExposantComboComponent implements OnInit 
{
  protected listeExposants: Observable<Array<Exposant>> | null = null ;
  protected serviceExposant: ExposantService ;

  protected nom: string = "" ;
  protected showList = signal(false) ;

  public label = input("Exposant") ;
  public onExposantSelected = output<string>() ;

  constructor( serviceExposant: ExposantService ) 
  { 
    this.serviceExposant = serviceExposant ;
  }

  ngOnInit() 
  {
    this.listeExposants = this.serviceExposant.getTousLesExposants( this.nom ) ;
  }

  onNomChanged( event: any ) 
  {
    this.listeExposants = this.serviceExposant.getTousLesExposants( this.nom ) ;
    this.showList.set( true ) ;
    this.onExposantSelected.emit( this.nom ) ;
  }

  onClickExposantSelected( nom: string ) 
  {
    this.showList.set( false ) ;
    this.nom = nom ;
    this.onExposantSelected.emit( this.nom ) ;
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
    this.nom = "" ;
    this.showList.set( false ) ;
  }
}
