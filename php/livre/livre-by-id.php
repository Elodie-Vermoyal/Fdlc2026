<?php

require_once "../Connexion.php" ;

try
{
    $bd = Connexion::getInstance() ;

    $id = isset($_GET["id"]) ? intval($_GET["id"]) : 0 ;

    $sql = "select distinct id, titre, resume, genre, editeur, nom, prenom, nomExposant from " . Connexion::$tables["LivreEditeurPersonneExposant"] . " where id = :id limit 1" ;

    $cursor = $bd->prepare( $sql ) ;
    $cursor->bindValue( ":id", $id, PDO::PARAM_INT ) ;
    $cursor->execute() ;

    $data = $cursor->fetch( PDO::FETCH_ASSOC ) ;

    header('Content-Type: application/json; charset=utf-8');
    echo json_encode( $data ) ;

}
catch( PDOException $erreur )
{
    echo "Probleme d'acces a la BD " . $erreur->getMessage() ;
}

?>
