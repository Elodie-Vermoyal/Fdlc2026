<?php

require_once "../Connexion.php" ;

try
{
    $bd = Connexion::getInstance() ;

    $sql = "select distinct genre from " . Connexion::$tables["genre"] . " order by genre" ;

    $cursor = $bd->prepare( $sql ) ;
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
