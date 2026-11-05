import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Livre } from "../modeles/Livre";

@Injectable({ providedIn: "root" })
export class LivreService {
  constructor(private http: HttpClient) {}

  getTousLesLivres(titre: string = "", nomAuteur: string = "", genre: string = "", nomExposant: string = ""): Observable<Livre[]> {
    let params = new URLSearchParams();
    if (titre.trim() !== "") params.set("titre", titre);
    if (nomAuteur.trim() !== "") params.set("nomAuteur", nomAuteur);
    if (genre.trim() !== "") params.set("genre", genre);
    if (nomExposant.trim() !== "") params.set("nomExposant", nomExposant);
    const query = params.toString();
    return this.http.get<Livre[]>("php/livre/tous-les-livres.php" + (query ? "?" + query : ""));
  }
}
