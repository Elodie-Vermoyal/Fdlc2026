
import {Injectable, signal} from "@angular/core" ;
import {HttpClient} from "@angular/common/http" ;
import {Router} from "@angular/router" ;
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
    private router: Router ;

    public mdp: string = "" ;
    public connecte = signal(false) ;

    // Deconnexion automatique apres 15 minutes sans rien faire
    private readonly dureeInactivite = 15 * 60 * 1000 ;
    private minuteur: any = null ;
    public deconnecteParInactivite = signal(false) ;

    // evenements qui comptent comme une activite de l'utilisateur
    private readonly evenementsActivite = [ "click", "keydown", "pointermove", "touchstart", "scroll" ] ;
    private onActivite = () => this.relanceMinuteur() ;

    constructor( http: HttpClient, router: Router )
    {
        this.http = http ;
        this.router = router ;
    }

    verifieMotDePasse( mdp: string ): Observable<{ ok: boolean, bloque: boolean }>
    {
        return this.http.post<{ ok: boolean, bloque: boolean }>( "php/config/verif-mot-de-passe.php", { mdp: mdp } ) ;
    }

    changeMotDePasse( ancien: string, nouveau: string ): Observable<any>
    {
        return this.http.post( "php/config/change-mot-de-passe.php", { ancien: ancien, nouveau: nouveau } ) ;
    }

    connexion( mdp: string )
    {
        this.mdp = mdp ;
        this.connecte.set( true ) ;
        this.deconnecteParInactivite.set( false ) ;

        for( let evenement of this.evenementsActivite )
        {
            document.addEventListener( evenement, this.onActivite, { passive: true, capture: true } ) ;
        }
        this.relanceMinuteur() ;
    }

    deconnexion()
    {
        this.mdp = "" ;
        this.connecte.set( false ) ;

        clearTimeout( this.minuteur ) ;
        for( let evenement of this.evenementsActivite )
        {
            document.removeEventListener( evenement, this.onActivite, { capture: true } ) ;
        }
    }

    private relanceMinuteur()
    {
        clearTimeout( this.minuteur ) ;
        this.minuteur = setTimeout( () =>
        {
            this.deconnexion() ;
            this.deconnecteParInactivite.set( true ) ;

            // si on est sur une page de config on revient a la connexion
            if( this.router.url.startsWith( "/config" ) ) this.router.navigateByUrl( "/config" ) ;
        }, this.dureeInactivite ) ;
    }
}
