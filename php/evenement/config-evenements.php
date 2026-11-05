<?php

require_once "../Connexion.php" ;

header( "Content-Type: application/json; charset=utf-8" ) ;

// Tous les evenements pour la page de configuration, tries par date
try
{
    $bd = Connexion::getInstance() ;

    $sql = "select id, typeevenement, titre, stitre, public, commentaire, debut, fin, idAnimateur, numLieu from "
         . Connexion::$tables["evenement"] . " order by debut, titre" ;

    $cursor = $bd->prepare( $sql ) ;
    $cursor->execute() ;

    echo json_encode( $cursor->fetchAll( PDO::FETCH_ASSOC ), JSON_UNESCAPED_UNICODE ) ;
}
catch( Exception $erreur )
{
    http_response_code( 500 ) ;
    echo json_encode( ["erreur" => "Probleme d'acces à la BD " . $erreur->getMessage()], JSON_UNESCAPED_UNICODE ) ;
}

?>
