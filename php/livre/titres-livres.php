<?php

require_once "../Connexion.php" ;

header( "Content-Type: application/json; charset=utf-8" ) ;

// Titre de tous les livres avec leurs auteurs (pour choisir les livres d'un evenement)
try
{
    $bd = Connexion::getInstance() ;

    $sql = "select l.id, l.titre, group_concat( concat_ws( ' ', p.prenom, p.nom ) separator ', ' ) as nom"
         . " from " . Connexion::$tables["livre"] . " as l"
         . " left join " . Connexion::$tables["ecrire"] . " as e on e.idLivre = l.id"
         . " left join " . Connexion::$tables["personne"] . " as p on p.id = e.idPersonne"
         . " where l.titre <> ''"
         . " group by l.id, l.titre order by l.titre" ;

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
