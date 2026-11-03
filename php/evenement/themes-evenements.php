<?php

require_once "../Connexion.php" ;

header( "Content-Type: application/json; charset=utf-8" ) ;

try
{
    $bd = Connexion::getInstance() ;

    // le theme d'un evenement correspond a son typeevenement
    $sql = "select type from " . Connexion::$tables["typeevenement"] . " where type <> '' " ;

    $theme = trim( $_GET["theme"] ?? "" ) ;

    if( $theme != "" )
    {
        $sql .= " and type like :theme " ;
    }

    $sql .= " order by type" ;

    $cursor = $bd->prepare( $sql ) ;

    if( $theme != "" )
    {
        // on echappe % et _ pour le like
        $cursor->bindValue( ":theme", addcslashes( $theme, "\\%_" ) . "%", PDO::PARAM_STR ) ;
    }

    $cursor->execute() ;

    $data = $cursor->fetchAll( PDO::FETCH_COLUMN ) ;

    echo json_encode( $data, JSON_UNESCAPED_UNICODE ) ;
}
catch( Exception $erreur )
{
    http_response_code( 500 ) ;
    echo json_encode( ["erreur" => "Probleme d'acces à la BD " . $erreur->getMessage()], JSON_UNESCAPED_UNICODE ) ;
}

?>
