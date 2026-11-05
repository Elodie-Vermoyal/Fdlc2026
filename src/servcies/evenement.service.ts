
import {Injectable} from "@angular/core" ;
import {HttpClient, HttpParams} from "@angular/common/http" ;
import {Observable} from "rxjs" ;
import {Evenement} from "../modeles/Evenements" ;

@Injectable( {
    providedIn: "root"
})
export class EvenementService
{
    private http: HttpClient ;

    constructor( http: HttpClient )
    {
        this.http = http ;
    }

    // Liste des themes qui commencent par theme
    getThemesEvenements( theme: string = "" ): Observable<string[]>
    {
        let params = new HttpParams() ;

        if( theme != "" ) params = params.set( "theme", theme ) ;

        return this.http.get<string[]>( "php/evenement/themes-evenements.php", { params } ) ;
    }

    // Tous les evenements pour la page de configuration
    getEvenementsConfig(): Observable<Evenement[]>
    {
        return this.http.get<Evenement[]>( "php/evenement/config-evenements.php" ) ;
    }

    // Id des livres presentes pendant l'evenement
    getLivresEvenement( id: number ): Observable<number[]>
    {
        return this.http.get<number[]>( "php/evenement/livres-evenement.php?id=" + id ) ;
    }

    // Ajoute (id = -1) ou modifie un evenement avec ses livres, renvoie l'id de l'evenement
    majEvenement( mdp: string, evenement: Evenement, idLivres: number[] ): Observable<{ id: number }>
    {
        return this.http.post<{ id: number }>( "php/evenement/maj-evenement.php", {
            mdp: mdp,
            evenement: evenement,
            idLivres: idLivres
        } ) ;
    }

    supprimeEvenement( mdp: string, id: number ): Observable<any>
    {
        return this.http.post( "php/evenement/supprime-evenement.php", { mdp: mdp, id: id } ) ;
    }
}
