<?php

require_once "../Connexion.php" ;

try
{
    $bd = Connexion::getInstance() ;

    $sql = "select * from " . Connexion::$tables["exposant"] . " where id = :id " ;

    $cursor = $bd->prepare( $sql ) ;

    if( isset($_GET["id"]))
    {
        $cursor->bindValue( ":id", $_GET["id"], PDO::PARAM_INT ) ;
    }

    $cursor->execute() ;

    $data = $cursor->fetchAll( PDO::FETCH_ASSOC ) ;

    echo json_encode( $data ) ;

}
catch( PDOException $erreur )
{
    echo "Probleme d'acces à la BD " . $erreur->getMessage() ;
}

?>