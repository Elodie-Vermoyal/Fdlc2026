
import {Injectable} from "@angular/core" ;
import {HttpClient} from "@angular/common/http" ;
import {Observable} from "rxjs" ;
import {Personne} from "../modeles/Personne" ;

@Injectable( {
    providedIn: "root"
})
export class PersonneService
{
    private http: HttpClient ;

    constructor( http: HttpClient )
    {
        this.http = http ;
    }

    getToutesLesPersonnes( nom: string="" ): Observable<Personne[]>
    {
        let first = true ;
        let url: string = "php/personne/toutes-les-personnes.php" ;

        if( nom != "" )
        {
            url += (first)? "?" : "&" ;
            url += "nom=" + encodeURIComponent( nom ) ;
            first = false ;
        }

        return this.http.get<Personne[]>( url ) ;
    }

    // Renvoie la personne d'id donné (null si elle n'existe pas)
    getPersonneById( id: number ): Observable<Personne | null>
    {
        return this.http.get<Personne | null>( "php/personne/personne-by-id.php?id=" + id ) ;
    }

    // Renvoie les personnes correspondant aux critères renseignés.
    // Les critères vides ("" ou -1) sont ignorés, les autres se cumulent (AND).
    getListePersonnesBy(
        id: number = -1,
        specialite: string = "",
        idExposant: number = -1,
        nom: string = "",
        titreLivre: string = "",
        titreEvenement: string = "",
        nomExposant: string = "",
        numLieu: number = -1 ): Observable<Personne[]>
    {
        let first = true ;
        let url: string = "php/personne/liste-personnes.php" ;

        // Liste des critères à transmettre au script PHP
        let criteres: [string, string | number, boolean][] = [
            [ "id", id, id != -1 ],
            [ "specialite", specialite, specialite != "" ],
            [ "idExposant", idExposant, idExposant != -1 ],
            [ "nom", nom, nom != "" ],
            [ "titreLivre", titreLivre, titreLivre != "" ],
            [ "titreEvenement", titreEvenement, titreEvenement != "" ],
            [ "nomExposant", nomExposant, nomExposant != "" ],
            [ "numLieu", numLieu, numLieu != -1 ]
        ] ;

        for( let [nomCritere, valeur, renseigne] of criteres )
        {
            if( renseigne )
            {
                url += (first)? "?" : "&" ;
                url += nomCritere + "=" + encodeURIComponent( valeur ) ;
                first = false ;
            }
        }

        return this.http.get<Personne[]>( url ) ;
    }
}
