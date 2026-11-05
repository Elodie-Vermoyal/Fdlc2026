
import {Injectable, signal} from "@angular/core" ;
import {HttpClient} from "@angular/common/http" ;
import {Observable} from "rxjs" ;

// Connexion aux pages de configuration (plans, evenements...).
// Le mot de passe est garde en memoire tant que l'appli est ouverte,
// il est renvoye au serveur a chaque enregistrement.
@Injectable( {
    providedIn: "root"
})
export class ConfigService
{
    private http: HttpClient ;

    public mdp: string = "" ;
    public connecte = signal(false) ;

    constructor( http: HttpClient )
    {
        this.http = http ;
    }

    verifieMotDePasse( mdp: string ): Observable<{ ok: boolean }>
    {
        return this.http.post<{ ok: boolean }>( "php/config/verif-mot-de-passe.php", { mdp: mdp } ) ;
    }

    changeMotDePasse( ancien: string, nouveau: string ): Observable<any>
    {
        return this.http.post( "php/config/change-mot-de-passe.php", { ancien: ancien, nouveau: nouveau } ) ;
    }

    connexion( mdp: string )
    {
        this.mdp = mdp ;
        this.connecte.set( true ) ;
    }

    deconnexion()
    {
        this.mdp = "" ;
        this.connecte.set( false ) ;
    }
}
