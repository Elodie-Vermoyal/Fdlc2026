<?php

require_once "../Connexion.php" ;

header( "Content-Type: application/json; charset=utf-8" ) ;

// Id des livres presentes pendant un evenement (table presenter)
try
{
    $bd = Connexion::getInstance() ;

    $id = filter_input( INPUT_GET, "id", FILTER_VALIDATE_INT ) ;

    if( !$id )
    {
        http_response_code( 400 ) ;
        echo json_encode( [] ) ;
        exit ;
    }

    $sql = "select idLivre from " . Connexion::$tables["presenter"] . " where idEvenement = :id" ;

    $cursor = $bd->prepare( $sql ) ;
    $cursor->bindValue( ":id", $id, PDO::PARAM_INT ) ;
    $cursor->execute() ;

    echo json_encode( $cursor->fetchAll( PDO::FETCH_COLUMN ) ) ;
}
catch( Exception $erreur )
{
    http_response_code( 500 ) ;
    echo json_encode( ["erreur" => "Probleme d'acces à la BD " . $erreur->getMessage()], JSON_UNESCAPED_UNICODE ) ;
}

?>
