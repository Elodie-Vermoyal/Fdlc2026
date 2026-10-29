import { Component, OnInit, input, output, signal } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { LivreService } from '../../servcies/livre.service';
import { Livre } from '../../modeles/Livre';
import { 
  IonInput,
  IonList,
  IonItem,
  IonCard,
  IonCardContent,
} from '@ionic/angular';

@Component({
  selector: 'app-titre-livre-combo',
  templateUrl: './titre-livre-combo.component.html',
  styleUrls: ['./titre-livre-combo.component.scss'],
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
export class TitreLivreComboComponent implements OnInit 
{
  protected listeLivres: Observable<Array<Livre>> | null = null ;
  protected serviceLivre: LivreService ;

  protected titre: string = "" ;

  // Gestion de l'affichage de la liste avec un signal
  protected showList = signal(false) ;

  // Communication avec Web component parent
  public label = input("Titre du livre") ;
  public onTitreSelected = output<string>() ;

  constructor( serviceLivre: LivreService ) 
  { 
    this.serviceLivre = serviceLivre ;
  }

  ngOnInit() 
  {
    this.listeLivres = this.serviceLivre.getTousLesLivres( "" ) ;
  }

  // Exécuté quand l'utilisateur modifie le titre dans l'ion-input
  onTitreChanged( event: any ) 
  {
    this.listeLivres = this.serviceLivre.getTousLesLivres( this.titre ) ;
    this.showList.set( true ) ;
    this.onTitreSelected.emit( this.titre ) ;
  }

  // Exécuté quand on clique sur une ligne de la liste
  onClickTitreSelected( titre: string ) 
  {
    this.showList.set( false ) ;
    this.titre = titre ;
    this.onTitreSelected.emit( this.titre ) ;
  }

  // Affiche ou masque la liste quand on clique sur le champ de recherche
  onInputClick( event: MouseEvent ) 
  {
    this.showList.set( !this.showList() ) ;
  }

  // Masque la liste
  masqueListe() 
  {
    this.showList.set( false ) ;
  }

  // Réinitialise la saisie
  reset()
  {
    this.titre = "" ;
    this.showList.set( false ) ;
  }
}
