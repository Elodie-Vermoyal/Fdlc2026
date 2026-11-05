<?php

require_once "../Connexion.php" ;

try
{
    $bd = Connexion::getInstance() ;

    if( isset( $_GET["id"] ) )
    {
        $sql = "select l.id, l.titre, l.resume, l.genre, e.nom as editeur "
             . "from " . Connexion::$tables["livre"] . " l "
             . "left join " . Connexion::$tables["editeur"] . " e on e.id = l.idEditeur "
             . "where l.id = :id" ;

        $cursor = $bd->prepare( $sql ) ;
        $cursor->execute( [ "id" => $_GET["id"] ] ) ;

        $data = $cursor->fetchAll( PDO::FETCH_ASSOC ) ;
    }
    else
    {
        $data = [] ;
    }

    echo json_encode( $data ) ;
}
catch( PDOException $erreur )
{
    echo "Probleme d'acces à la BD " . $erreur->getMessage() ;
}

?>