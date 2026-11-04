
import {Injectable} from "@angular/core" ;
import {HttpClient} from "@angular/common/http" ;
import {Observable} from "rxjs" ;
import {Lieu} from "../modeles/Lieu" ;

@Injectable( {
    providedIn: "root" 
})
export class LieuService
{
    private http: HttpClient ;

    constructor( http: HttpClient )
    {
        this.http = http ;
    }

    getTousLesLieux( nom: string="", type: string = "" ): Observable<Lieu[]>
    {
        let first = true ;
        let url: string = "php/lieu/tous-les-lieux.php" ;

        if( nom != "" )
        {
            url += (first)? "?" : "&" ;
            url += "nom=" + nom ;
            first = false ;
        }

        if( type != "" )
        {
            url += (first)? "?" : "&" ;
            url += "type=" + type ;
            first = false ;
        }

        return this.http.get<Lieu[]>( url ) ;
    }

    // Tous les lieux d'un hall avec leur zone sur le plan
    getLieuxDuHall( hall: number ): Observable<Lieu[]>
    {
        return this.http.get<Lieu[]>( "php/lieu/lieux-hall.php?hall=" + hall ) ;
    }

    // Vérifie le mot de passe de la page de configuration des plans
    verifieMotDePasse( mdp: string ): Observable<{ ok: boolean }>
    {
        return this.http.post<{ ok: boolean }>( "php/lieu/verif-mot-de-passe.php", { mdp: mdp } ) ;
    }

    // Enregistre la zone d'un lieu sur le plan, x1 = null pour la supprimer
    majZoneLieu( mdp: string, lieu: Lieu ): Observable<any>
    {
        return this.http.post( "php/lieu/maj-zone-lieu.php", {
            mdp: mdp,
            num: lieu.num,
            hall: lieu.hall,
            x1: lieu.x1,
            y1: lieu.y1,
            x2: lieu.x2,
            y2: lieu.y2
        } ) ;
    }
}