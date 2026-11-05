import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Evenement } from "../modeles/Evenement";


@Injectable( {
    providedIn: "root"
})
export class EvenementService {
  private http: HttpClient;

  constructor(http: HttpClient) {
    this.http = http;
  }

  getThemesEvenements(theme: string = ""): Observable<string[]> {
    let params = new HttpParams();

    if (theme !== "") params = params.set("theme", theme);

    return this.http.get<string[]>("php/evenement/themes-evenements.php", { params });
  }

  getTousLesEvenements(
    titre: string = "",
    debut: string = "",
    nomAnimateur: string = "",
    titreLivre: string = ""
  ): Observable<Evenement[]> {
    let first = true;
    let url = "php/evenement/tous-les-evenements.php";

    if (titre !== "") {
      url += first ? "?" : "&";
      first = false;
      url += "titre=" + titre;
    }

    if (debut !== "") {
      url += first ? "?" : "&";
      first = false;
      url += "debut=" + debut;
    }

    if (nomAnimateur !== "") {
      url += first ? "?" : "&";
      first = false;
      url += "nomAnimateur=" + nomAnimateur;
    }

    if (titreLivre !== "") {
      url += first ? "?" : "&";
      first = false;
      url += "titreLivre=" + titreLivre;
    }

    return this.http.get<Evenement[]>(url);
  }

  getEvenementById(id: number = -1): Observable<Evenement[]> {
    let first = true;
    let url = "php/evenement/evenement-by-id.php";

    if (id !== -1) {
      url += first ? "?" : "&";
      first = false;
      url += "id=" + id;
    }

    return this.http.get<Evenement[]>(url);
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
