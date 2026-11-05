import { Component, OnInit, input, output, signal } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import {Observable} from "rxjs" ;
import { FormsModule } from '@angular/forms';

import {
  IonInput,
  IonList,
  IonItem,
  IonCard,
  IonCardContent,
 } from '@ionic/angular';

import {EvenementService } from '../../services/evenement.service';

@Component({
  selector: 'app-theme-evenement-combo',
  templateUrl: './theme-evenement-combo.component.html',
  styleUrls: ['./theme-evenement-combo.component.scss'],
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
export class ThemeEvenementComboComponent  implements OnInit
{
  // Signal car la liste est modifiée dans le setTimeout
  protected listeThemes = signal<Observable<Array<string>> | null>( null ) ;
  protected serviceEvenement: EvenementService ;

  protected saisie: string = "" ;

  // Timer pour ne pas envoyer une requete a chaque touche
  private timer: any = null ;

  // Gestion de l'affichage de la liste
  protected showList = signal(false) ;

  // Communication avec le web component parent
  public    label = input("Thème") ;
  public    childHtml = input("$theme") ;
  public    theme = input("") ;
  public    onThemeSelected = output<string>() ;

  constructor( serviceEvenement: EvenementService )
  {
    this.serviceEvenement = serviceEvenement ;
  }

  ngOnInit()
  {
    this.saisie = this.theme() ;
    this.listeThemes.set( this.serviceEvenement.getThemesEvenements( this.saisie ) ) ;
  }

  // Exécuté quand l'utilisateur modifie le theme dans l'ion-input
  onThemeChanged( event: any )
  {
    // On attend 300ms apres la derniere touche avant de rafraichir la liste
    clearTimeout( this.timer ) ;
    this.timer = setTimeout( () => {
      this.listeThemes.set( this.serviceEvenement.getThemesEvenements( this.saisie.trim() ) ) ;
    }, 300 ) ;

    this.showList.set( true ) ;
    this.onThemeSelected.emit( this.saisie.trim() ) ;
  }

  // Exécuté quand l'utilisateur clique sur une ligne de la liste
  onClickThemeSelected( theme: string )
  {
    this.showList.set( false ) ;
    this.saisie = theme ;
    this.onThemeSelected.emit( this.saisie ) ;
  }

  // Exécuté quand l'utilisateur clique sur l'ion-input
  onInputClick( event: MouseEvent )
  {
    this.showList.set( !this.showList() ) ;
  }

  // Texte affiché dans chaque ligne
  itemText( theme: string ) : string
  {
    return this.childHtml().replace( "$theme", theme ) ;
  }

  // Masque la liste
  masqueListe()
  {
    this.showList.set( false ) ;
  }
}
