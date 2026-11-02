
import {Injectable} from "@angular/core" ;
import {HttpClient} from "@angular/common/http" ;
import {Observable} from "rxjs" ;
import {Exposant} from "../modeles/Exposant" ;

@Injectable( {
    providedIn: "root" 
})
export class ExposantService
{
    private http: HttpClient ;

    constructor( http: HttpClient )
    {
        this.http = http ;
    }

    getTousLesExposants( nom: string = "", nomLieu: string = "" ): Observable<Exposant[]>
    {
        let first = true ;
        let url = "php/exposant/tous-les-exposants.php" ;

        if( nom != "" ) 
        {
            url += (first)? "?" : "&"  
            url += "nom=" + nom ;
        }

        if( nomLieu != "" ) 
        {
            url += (first)? "?" : "&"  
            url += "nomLieu=" + nomLieu ;
        }

        return this.http.get<Exposant[]>( url ) ;
    }

    getExposantById( id: number = -1 ): Observable<Exposant[]>
    {
        let first = true ;
        let url = "php/exposant/exposant-id.php" ;

        if( id != -1 ) 
        {
            url += (first)? "?" : "&"  
            url += "id=" + id ;
        }

        return this.http.get<Exposant[]>( url ) ;
    }
}