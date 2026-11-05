<?php

require_once "../Connexion.php" ;

try
{
    $bd = Connexion::getInstance() ;

    if( isset($_GET["id"]) )
    {
        $id = $_GET["id"] ;

        $sql = "select id, typeevenement, titre, idAnimateur, numLieu, debut, fin from evenement WHERE id = ?" ;

        $cursor = $bd->prepare( $sql ) ;
        $cursor->bindValue( 1, $id, PDO::PARAM_INT ) ;
        $cursor->execute() ;

        $data = $cursor->fetchAll( PDO::FETCH_ASSOC ) ;

        echo json_encode( $data ) ;
    }
    else
    {
      echo json_encode( [] ) ;  
    } 


}
catch( PDOException $erreur )
{
    $message = $erreur->getMessage() ;
    echo "Probleme d'acces à la BD " . $message ;
}

?>