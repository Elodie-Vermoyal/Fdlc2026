<?php

require_once "../Connexion.php" ;

try
{
    $num = filter_input( INPUT_GET, "num", FILTER_VALIDATE_INT ) ;

    if( $num === false || $num === null )
    {
        http_response_code( 400 ) ;
        echo json_encode( ["erreur" => "Numéro invalide"] ) ;
        exit ;
    }

    $bd = Connexion::getInstance() ;

    $sql = "select num, nom, type, x1, y1, x2, y2 from " . Connexion::$tables["lieu"] . " where num = :num" ;

    $cursor = $bd->prepare( $sql ) ;
    $cursor->execute( [":num" => $num] ) ;

    $lieu = $cursor->fetch( PDO::FETCH_ASSOC ) ;

    if( $lieu === false )
    {
        http_response_code( 404 ) ;
        echo json_encode( ["erreur" => "Lieu introuvable"] ) ;
        exit ;
    }

    echo json_encode( $lieu ) ;
}
catch( PDOException $erreur )
{
    http_response_code( 500 ) ;
    echo json_encode( ["erreur" => "Erreur d'accès à la base de données"] ) ;
}

?>