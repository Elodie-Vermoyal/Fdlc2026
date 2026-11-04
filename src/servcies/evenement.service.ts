import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Evenement } from "../modeles/Evenement";

@Injectable({
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
}