export class Etape
{
    // Cle du planning dans le LocalStorage
    private static cle: string = "fdlc2026-planning" ;

    // Dates du festival
    public static debutFestival: string = "2026-11-21T09:00:00" ;
    public static finFestival: string = "2026-11-22T19:00:00" ;

    // Toutes les etapes de l'utilisateur triees par heure
    public static lesEtapes: Array<Etape> = Etape.charge() ;

    public id: number = -1 ;
    public debut: string = "" ;
    public nom: string = "" ;
    public numLieu: number = -1 ;
    public idEvenement: number = -1 ;
    public idExposant: number = -1 ;
    public idPersonne: number = -1 ;

    constructor(
        id: number = -1,
        debut: string = "",
        nom: string = "",
        numLieu: number = -1,
        idEvenement: number = -1,
        idExposant: number = -1,
        idPersonne: number = -1 )
    {
        this.id = id ;
        this.debut = debut ;
        this.nom = nom ;
        this.numLieu = numLieu ;
        this.idEvenement = idEvenement ;
        this.idExposant = idExposant ;
        this.idPersonne = idPersonne ;
    }

    // Ajoute une etape dans lesEtapes, renvoie null si elle existe deja a la meme heure
    public static ajouteEtape(
        debut: string,
        nom: string,
        numLieu: number = -1,
        idEvenement: number = -1,
        idExposant: number = -1,
        idPersonne: number = -1 ): Etape | null
    {
        // meme format pour toutes les dates : "2026-11-21T14:30:00"
        debut = ( debut.replace( " ", "T" ) + ":00" ).substring( 0, 19 ) ;

        let etape = new Etape( -1, debut, nom.trim(), numLieu, idEvenement, idExposant, idPersonne ) ;

        for( let e of Etape.lesEtapes )
        {
            if( e.debut == etape.debut && e.estLeMeme( etape ) ) return null ;
        }

        let max = 0 ;
        for( let e of Etape.lesEtapes )
        {
            if( e.id > max ) max = e.id ;
        }
        etape.id = max + 1 ;

        Etape.lesEtapes.push( etape ) ;
        Etape.lesEtapes.sort( (a, b) => a.debut.localeCompare( b.debut ) ) ;
        Etape.sauve() ;

        return etape ;
    }

    public static supprimeEtape( id: number )
    {
        Etape.lesEtapes = Etape.lesEtapes.filter( e => e.id != id ) ;
        Etape.sauve() ;
    }

    public static videPlanning()
    {
        Etape.lesEtapes = [] ;
        Etape.sauve() ;
    }

    // Vrai si l'exposant, la personne, l'evenement ou le lieu est deja dans le planning
    public static estPlanifie( numLieu: number, idEvenement: number, idExposant: number, idPersonne: number ): boolean
    {
        return Etape.trouveEtape( numLieu, idEvenement, idExposant, idPersonne ) != undefined ;
    }

    // Etape du planning pour cet exposant, cette personne, cet evenement ou ce lieu
    public static trouveEtape( numLieu: number, idEvenement: number, idExposant: number, idPersonne: number ): Etape | undefined
    {
        let etape = new Etape( -1, "", "", numLieu, idEvenement, idExposant, idPersonne ) ;
        return Etape.lesEtapes.find( e => e.estLeMeme( etape ) ) ;
    }

    // Change l'heure d'une etape, le planning reste trie par heure
    public static changeHeure( id: number, debut: string )
    {
        let etape = Etape.lesEtapes.find( e => e.id == id ) ;
        if( !etape ) return ;

        etape.debut = ( debut.replace( " ", "T" ) + ":00" ).substring( 0, 19 ) ;
        Etape.lesEtapes.sort( (a, b) => a.debut.localeCompare( b.debut ) ) ;
        Etape.sauve() ;
    }

    // evenement, exposant, personne ou lieu suivant l'id renseigne
    public getType(): string
    {
        if( this.idEvenement > 0 ) return "evenement" ;
        if( this.idExposant > 0 ) return "exposant" ;
        if( this.idPersonne > 0 ) return "personne" ;
        return "lieu" ;
    }

    // Construit le titre à afficher en fonction des attributs renseignés
    public getTitre(): string
    {
        let titre = this.nom ;

        if( this.getType() == "exposant" ) titre = "Passer chez " + this.nom ;
        if( this.getType() == "personne" ) titre = "Rencontrer " + this.nom ;
        if( this.getType() == "lieu" ) titre = "Aller à " + this.nom ;

        if( this.numLieu > 0 && this.getType() != "lieu" ) titre += " (stand " + this.numLieu + ")" ;

        return titre ;
    }

    // ex : 14h30
    public getHeure(): string
    {
        return this.debut.substring( 11, 13 ) + "h" + this.debut.substring( 14, 16 ) ;
    }

    // ex : Samedi 21 novembre
    public getJour(): string
    {
        let jour = new Date( this.debut ).toLocaleDateString( "fr-FR", { weekday: "long", day: "numeric", month: "long" } ) ;
        return jour.charAt( 0 ).toUpperCase() + jour.substring( 1 ) ;
    }

    // Les deux etapes concernent le meme evenement / exposant / personne / lieu
    private estLeMeme( etape: Etape ): boolean
    {
        if( this.getType() != etape.getType() ) return false ;

        if( this.getType() == "evenement" ) return this.idEvenement == etape.idEvenement ;
        if( this.getType() == "exposant" ) return this.idExposant == etape.idExposant ;
        if( this.getType() == "personne" ) return this.idPersonne == etape.idPersonne ;
        return this.numLieu == etape.numLieu ;
    }

    private static sauve()
    {
        localStorage.setItem( Etape.cle, JSON.stringify( Etape.lesEtapes ) ) ;
    }

    private static charge(): Array<Etape>
    {
        let etapes: Array<Etape> = [] ;
        let json = localStorage.getItem( Etape.cle ) ;

        if( json )
        {
            // on recree des objets Etape pour avoir les methodes
            for( let e of JSON.parse( json ) )
            {
                etapes.push( new Etape( e.id, e.debut, e.nom, e.numLieu, e.idEvenement, e.idExposant, e.idPersonne ) ) ;
            }
        }
        return etapes ;
    }
}
