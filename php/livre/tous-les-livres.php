<?php

require_once "../Connexion.php" ;

try
{
    $bd = Connexion::getInstance() ;

    $sql = "select distinct id, titre, resume, genre, editeur, nom, prenom, nomExposant from " . Connexion::$tables["LivreEditeurPersonneExposant"] . " where 1 " ;

    if( isset($_GET["id"]) && $_GET["id"] !== "" && $_GET["id"] !== "-1" ) 
    {
        $sql .= " and id = :id " ;
    }

    if( isset($_GET["titre"]) && $_GET["titre"] !== "" ) 
    {
        $sql .= " and titre like :titre " ;
    }

    if( isset($_GET["nomAuteur"]) && $_GET["nomAuteur"] !== "" ) 
    {
        $sql .= " and (nom like :nomAuteur or prenom like :nomAuteur) " ;
    }

    if( isset($_GET["genre"]) && $_GET["genre"] !== "" ) 
    {
        $sql .= " and genre = :genre " ;
    }

    if( isset($_GET["nomExposant"]) && $_GET["nomExposant"] !== "" ) 
    {
        $sql .= " and nomExposant like :nomExposant " ;
    }

    if( isset($_GET["titreEvenement"]) && $_GET["titreEvenement"] !== "" ) 
    {
        $sql .= " and titreEvenement like :titreEvenement " ;
    }

    $sql .= " order by titre" ;

    $cursor = $bd->prepare( $sql ) ;

    if( isset($_GET["id"]) && $_GET["id"] !== "" && $_GET["id"] !== "-1" )
    {
        $cursor->bindValue( ":id", intval($_GET["id"]), PDO::PARAM_INT ) ;
    }

    if( isset($_GET["titre"]) && $_GET["titre"] !== "" )
    {
        $cursor->bindValue( ":titre", "%" . $_GET["titre"] . "%", PDO::PARAM_STR ) ;
    }

    if( isset($_GET["nomAuteur"]) && $_GET["nomAuteur"] !== "" )
    {
        $cursor->bindValue( ":nomAuteur", "%" . $_GET["nomAuteur"] . "%", PDO::PARAM_STR ) ;
    }

    if( isset($_GET["genre"]) && $_GET["genre"] !== "" )
    {
        $cursor->bindValue( ":genre", $_GET["genre"], PDO::PARAM_STR ) ;
    }

    if( isset($_GET["nomExposant"]) && $_GET["nomExposant"] !== "" )
    {
        $cursor->bindValue( ":nomExposant", "%" . $_GET["nomExposant"] . "%", PDO::PARAM_STR ) ;
    }

    if( isset($_GET["titreEvenement"]) && $_GET["titreEvenement"] !== "" )
    {
        $cursor->bindValue( ":titreEvenement", "%" . $_GET["titreEvenement"] . "%", PDO::PARAM_STR ) ;
    }

    $cursor->execute() ;

    $data = $cursor->fetchAll( PDO::FETCH_ASSOC ) ;

    header('Content-Type: application/json; charset=utf-8');
    echo json_encode( $data ) ;

}
catch( PDOException $erreur )
{
    echo "Probleme d'acces a la BD " . $erreur->getMessage() ;
}

?>
