export class Livre
{
    public id: number = -1 ;
    public titre: string = "" ;
    public editeur: string = "" ;
    public genre: string = "" ;
    public datepublication: string = "" ;
    public resume: string = "" ;
    public nom: string = "" ;
    public prenom: string = "" ;
    public nomExposant: string = "" ;

    constructor(
        id: number = -1,
        titre: string = "",
        editeur: string = "",
        genre: string = "",
        datepublication: string = "",
        resume: string = "",
        nom: string = "",
        prenom: string = "",
        nomExposant: string = ""
    )
    {
        this.id = id ;
        this.titre = titre ;
        this.editeur = editeur ;
        this.genre = genre ;
        this.datepublication = datepublication ;
        this.resume = resume ;
        this.nom = nom ;
        this.prenom = prenom ;
        this.nomExposant = nomExposant ;
    }
}
