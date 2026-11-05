import { Injectable } from "@angular/core" ;
import { HttpClient } from "@angular/common/http" ;
import { Observable } from "rxjs" ;
import { Livre } from "../modeles/Livre" ;

@Injectable({
    providedIn: "root"
})
export class LivreService
{
    private http: HttpClient ;

    constructor( http: HttpClient )
    {
        this.http = http ;
    }

    getTousLesLivres(
        titre: string = "",
        nomAuteur: string = "",
        genre: string = "",
        nomExposant: string = "",
        titreEvenement: string = ""
    ): Observable<Livre[]>
    {
        let first = true ;
        let url = "php/livre/tous-les-livres.php" ;

        if( titre !== "" )
        {
            url += (first) ? "?" : "&" ;
            url += "titre=" + encodeURIComponent( titre ) ;
            first = false ;
        }

        if( nomAuteur !== "" )
        {
            url += (first) ? "?" : "&" ;
            url += "nomAuteur=" + encodeURIComponent( nomAuteur ) ;
            first = false ;
        }

        if( genre !== "" )
        {
            url += (first) ? "?" : "&" ;
            url += "genre=" + encodeURIComponent( genre ) ;
            first = false ;
        }

        if( nomExposant !== "" )
        {
            url += (first) ? "?" : "&" ;
            url += "nomExposant=" + encodeURIComponent( nomExposant ) ;
            first = false ;
        }

        if( titreEvenement !== "" )
        {
            url += (first) ? "?" : "&" ;
            url += "titreEvenement=" + encodeURIComponent( titreEvenement ) ;
            first = false ;
        }

        return this.http.get<Livre[]>( url ) ;
    }

    getLivreById( id: number ): Observable<Livre>
    {
        return this.http.get<Livre>( "php/livre/livre-by-id.php?id=" + id ) ;
    }

    getGenres(): Observable<Array<{ genre: string }>>
    {
        return this.http.get<Array<{ genre: string }>>( "php/livre/tous-les-genres.php" ) ;
    }
/*
  getTousLesLivres(titre: string = "", nomAuteur: string = "", genre: string = "", nomExposant: string = ""): Observable<Livre[]> {
    let params = new URLSearchParams();
    if (titre.trim() !== "") params.set("titre", titre);
    if (nomAuteur.trim() !== "") params.set("nomAuteur", nomAuteur);
    if (genre.trim() !== "") params.set("genre", genre);
    if (nomExposant.trim() !== "") params.set("nomExposant", nomExposant);
    const query = params.toString();
    return this.http.get<Livre[]>("php/livre/tous-les-livres.php" + (query ? "?" + query : ""));
  }*/

  // Titre et auteurs de tous les livres
  getTitresLivres(): Observable<Livre[]> 
  {
    return this.http.get<Livre[]>("php/livre/titres-livres.php");
  }

}
