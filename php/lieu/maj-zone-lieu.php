<?php

require_once "../Connexion.php" ;
require_once "../config/mot-de-passe.php" ;

header( "Content-Type: application/json; charset=utf-8" ) ;

$donnees = json_decode( file_get_contents( "php://input" ), true ) ;

// seule la page de configuration des plans peut modifier les zones
if( !motDePasseOk( $donnees["mdp"] ?? "" ) )
{
    http_response_code( 403 ) ;
    echo json_encode( ["erreur" => "Mot de passe incorrect"] ) ;
    exit ;
}

try
{
    $bd = Connexion::getInstance() ;

    $sql = "update " . Connexion::$tables["lieu"]
         . " set hall = :hall, x1 = :x1, y1 = :y1, x2 = :x2, y2 = :y2 where num = :num" ;

    $cursor = $bd->prepare( $sql ) ;
    $cursor->bindValue( ":num", (int)$donnees["num"], PDO::PARAM_INT ) ;
    $cursor->bindValue( ":hall", (int)$donnees["hall"], PDO::PARAM_INT ) ;

    // x1 = null pour supprimer la zone du stand
    foreach( ["x1", "y1", "x2", "y2"] as $champ )
    {
        if( isset( $donnees[$champ] ) )
            $cursor->bindValue( ":" . $champ, (int)$donnees[$champ], PDO::PARAM_INT ) ;
        else
            $cursor->bindValue( ":" . $champ, null, PDO::PARAM_NULL ) ;
    }

    $cursor->execute() ;

    echo json_encode( ["ok" => true] ) ;
}
catch( Exception $erreur )
{
    http_response_code( 500 ) ;
    echo json_encode( ["erreur" => "Probleme d'acces à la BD " . $erreur->getMessage()], JSON_UNESCAPED_UNICODE ) ;
}

?>
