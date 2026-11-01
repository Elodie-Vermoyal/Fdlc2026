
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

    getTousLesLieux( nom: string="", type: string = "", num: string = "" ): Observable<Lieu[]>
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

        if( num != "" )
        {
            url += (first)? "?" : "&" ;
            url += "num=" + num ;
            first = false ;
        }

        return this.http.get<Lieu[]>( url ) ;
    }
}