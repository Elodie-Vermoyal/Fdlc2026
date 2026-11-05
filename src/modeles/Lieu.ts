export class Lieu
{
    public num: number = -1 ;
    public nom: string = "" ;
    public type: string = "" ;
    public hall: number = 0 ;
    public x1: number = 0 ;
    public y1: number = 0 ;
    public x2: number = 0 ;
    public y2: number = 0 ;

    constructor( 
        num: number = -1, 
        nom: string = "",
        type: string = "",
        x1: number,
        y1: number,
        x2: number,
        y2: number,
        hall: number = 0 )
    {
        this.num = num ;
        this.nom = nom ;
        this.type = type ;
        this.x1 = x1 ;
        this.y1 = y1 ;
        this.x2 = x2 ;
        this.y2 = y2 ;
        this.hall = hall ;
    }
}