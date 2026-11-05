import { Component, OnInit, OnChanges, input } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { LivreService } from '../../services/livre.service';
import { Livre } from '../../modeles/Livre';
import { 
  IonList,
  IonItem,
} from '@ionic/angular';

@Component({
  selector: 'app-liste-livres',
  templateUrl: './liste-livres.component.html',
  styleUrls: ['./liste-livres.component.scss'],
  imports: [
    IonList,
    IonItem,
    AsyncPipe,
    RouterLink
  ],
})
export class ListeLivresComponent implements OnInit, OnChanges 
{
  // Format de chaque ligne affichée
  childHtml = input<string>( "<strong>$titre</strong> ($genre) - $prenom $nom, Éd. $editeur" ) ;

  // Route de la page à appeler quand on clique sur une ligne de la liste
  lienPage = input<string>( "/page-livre" ) ;

  // Critères de filtration
  idLivre = input<number>( -1 ) ;
  titreLivre = input<string>( "" ) ;
  nomAuteur = input<string>( "" ) ;
  genre = input<string>( "" ) ;
  nomExposant = input<string>( "" ) ;
  titreEvenement = input<string>( "" ) ;

  protected listeLivres: Observable<Array<Livre>> | null = null ;
  protected serviceLivre: LivreService ;

  constructor( serviceLivre: LivreService ) 
  { 
    this.serviceLivre = serviceLivre ;
  }

  ngOnInit() 
  {
    this.rafraichirListe() ;
  }

  // Rafraîchit la liste quand les paramètres d'input sont modifiés 
  ngOnChanges() 
  {
    this.rafraichirListe() ;
  }

  rafraichirListe() 
  {
    this.listeLivres = this.serviceLivre.getTousLesLivres(
      this.titreLivre(),
      this.nomAuteur(),
      this.genre(),
      this.nomExposant(),
      this.titreEvenement()
    ) ;
  }

  // Met en forme le texte affiché dans chaque ligne de la liste
  itemText( livre: Livre ): string 
  {
    let childHtml = this.childHtml() ;
    childHtml = childHtml.replace( "$id", livre.id.toString() ) ;
    childHtml = childHtml.replace( "$titre", livre.titre ) ;
    childHtml = childHtml.replace( "$editeur", livre.editeur ) ;
    childHtml = childHtml.replace( "$genre", livre.genre ) ;
    childHtml = childHtml.replace( "$nom", livre.nom ) ;
    childHtml = childHtml.replace( "$prenom", livre.prenom ) ;
    childHtml = childHtml.replace( "$resume", livre.resume ) ;
    childHtml = childHtml.replace( "$nomExposant", livre.nomExposant ) ;
    return childHtml ;
  }
}
