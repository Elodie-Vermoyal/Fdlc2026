export class Livre
{
  public id: number = -1;
  public titre: string = "";
  public editeur: string = "";
  public genre: string = "";
  public datepublication: string = "";
  public resume: string = "";
  public nom: string = "";
  public prenom: string = "";

  constructor(id = -1, titre = "", editeur = "", genre = "", datepublication = "", resume = "", nom = "", prenom = "") {
    this.id = id;
    this.titre = titre;
    this.editeur = editeur;
    this.genre = genre;
    this.datepublication = datepublication;
    this.resume = resume;
    this.nom = nom;
    this.prenom = prenom;
  }
}
