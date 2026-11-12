
export class Evenement
{
    public id: number = -1 ;
    public jour: string = "" ;
    public typeevenement: string = "" ;   // type événement
    public titre: string = "" ;
    public stitre: string = "" ;          // sous-titre
    public public: string = "" ;          // public visé
    public commentaire: string = "" ;
    public debut: string = "" ;           // date et heure de début ("AAAA-MM-JJ HH:MM:SS")
    public fin: string = "" ;             // date et heure de fin
    public idAnimateur: number = -1 ;     // id personne qui anime
    public numLieu: number = -1 ;         // num du lieu où se déroule l'événement

    constructor( 
        id: number = -1, 
        typeevenement: string = "", 
        titre: string = "",
        stitre: string = "",
        pub: string = "",
        commentaire: string = "",
        debut: string = "",
        fin: string = "",
        idAnimateur: number = -1,
        numLieu: number = -1 )
    {
        this.id = id ;
        this.typeevenement = typeevenement ;
        this.titre = titre ;
        this.stitre = stitre ;
        this.public = pub ;
        this.commentaire = commentaire ;
        this.debut = debut ;
        this.fin = fin ;
        this.idAnimateur = idAnimateur ;
        this.numLieu = numLieu ;
    }
}