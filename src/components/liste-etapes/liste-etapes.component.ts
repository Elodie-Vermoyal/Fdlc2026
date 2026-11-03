import { Component, OnInit, computed, input, output, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { addIcons } from 'ionicons';
import { trashOutline, micOutline, storefrontOutline, personOutline, locationOutline } from 'ionicons/icons';

import {
  IonList,
  IonItem,
  IonItemDivider,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonLabel,
  IonIcon,
  IonButton,
  IonNote,
 } from '@ionic/angular';

import { Etape } from '../../modeles/Etape';

@Component({
  selector: 'app-liste-etapes',
  templateUrl: './liste-etapes.component.html',
  styleUrls: ['./liste-etapes.component.scss'],
  imports: [
    IonList,
    IonItem,
    IonItemDivider,
    IonItemSliding,
    IonItemOptions,
    IonItemOption,
    IonLabel,
    IonIcon,
    IonButton,
    IonNote,
    RouterLink
  ],
})
export class ListeEtapesComponent  implements OnInit
{
  // Format de chaque ligne affichée
  childHtml = input<string>( "<strong>$heure</strong> $titre" ) ;

  // Routes des pages de détail, l'id est ajouté à la fin
  lienEvenement = input<string>( "/page-evenement" ) ;
  lienExposant = input<string>( "/page-exposant" ) ;
  lienPersonne = input<string>( "/page-personne" ) ;
  lienLieu = input<string>( "/page-lieu" ) ;

  // Critères de filtration
  nom = input<string>( "" ) ;
  type = input<string>( "" ) ;
  jour = input<string>( "" ) ;
  debut = input<string>( "" ) ;

  public onEtapeSupprimee = output<Etape>() ;

  // Signal pour mettre a jour l'affichage quand le planning change
  protected etapes = signal<Array<Etape>>( [] ) ;

  // Etapes filtrées et rangées par jour
  protected jours = computed( () =>
  {
    let jours: Array<{ jour: string, etapes: Array<Etape> }> = [] ;
    let nom = this.nom().toLowerCase() ;

    for( let etape of this.etapes() )
    {
      if( nom != "" && !etape.nom.toLowerCase().includes( nom ) ) continue ;
      if( this.type() != "" && etape.getType() != this.type() ) continue ;
      if( this.jour() != "" && !etape.debut.startsWith( this.jour() ) ) continue ;
      if( this.debut() != "" && etape.debut.substring( 11, 16 ) < this.debut() ) continue ;

      // les etapes sont deja triees, donc on change de jour quand il est different du precedent
      let jour = etape.getJour() ;
      if( jours.length == 0 || jours[jours.length - 1].jour != jour )
      {
        jours.push( { jour: jour, etapes: [] } ) ;
      }
      jours[jours.length - 1].etapes.push( etape ) ;
    }
    return jours ;
  }) ;

  constructor()
  {
    addIcons( { trashOutline, micOutline, storefrontOutline, personOutline, locationOutline } ) ;
  }

  ngOnInit()
  {
    this.rafraichit() ;
  }

  // Relit les etapes de la classe Etape
  rafraichit()
  {
    this.etapes.set( [...Etape.lesEtapes] ) ;
  }

  onSupprime( etape: Etape, sliding?: IonItemSliding )
  {
    sliding?.close() ;
    Etape.supprimeEtape( etape.id ) ;
    this.rafraichit() ;
    this.onEtapeSupprimee.emit( etape ) ;
  }

  // Lien vers la page de detail suivant le type de l'etape
  lien( etape: Etape )
  {
    switch( etape.getType() )
    {
      case "evenement": return [this.lienEvenement(), etape.idEvenement] ;
      case "exposant": return [this.lienExposant(), etape.idExposant] ;
      case "personne": return [this.lienPersonne(), etape.idPersonne] ;
      default: return [this.lienLieu(), etape.numLieu] ;
    }
  }

  icone( etape: Etape ): string
  {
    switch( etape.getType() )
    {
      case "evenement": return "mic-outline" ;
      case "exposant": return "storefront-outline" ;
      case "personne": return "person-outline" ;
      default: return "location-outline" ;
    }
  }

  // Met en forme le texte affiché dans chaque ligne de la liste
  itemText( etape: Etape ) : string
  {
    let childHtml = this.childHtml() ;
    childHtml = childHtml.replace( "$heure", etape.getHeure() ) ;
    childHtml = childHtml.replace( "$titre", etape.getTitre() ) ;
    childHtml = childHtml.replace( "$nom", etape.nom ) ;
    childHtml = childHtml.replace( "$numLieu", etape.numLieu.toString() ) ;
    return childHtml ;
  }
}
