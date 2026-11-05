<?php

require_once "../Connexion.php" ;

try
{
    $bd = Connexion::getInstance() ;

    $sql = "select distinct id, titre, resume from" . Connexion::$tables["livre"] . " where 1 " ;

    if( isset($_GET["titre"]))
    {
        $sql .= " and titre = :titre" ;
    }

    if( isset($_GET["resume"]))
    {
        $sql .= " and resume like :resume" ;
    }

    $sql .= " order by titre" ;

    $cursor = $bd->prepare ( $sql ) ;

    if (isset($_GET["titre"]))
    {
        $cursor->bindValue( ":titre", $_GET["titre"], PDO::PARAM_STR ) ;
    }

    if (isset($_GET["resume"]))
    {
        $cursor->bindValue( ":resume", "%" . $_GET["resume"] . "%", PDO::PARAM_STR ) ;
    }

    $cursor->execute() ;

    $data = $cursor->fetchAll( PDO::FETCH_ASSOC ) ;

    echo json_encode( $data ) ;
}
catch( PDOException $erreur )
{
    echo "Probleme d'acces à la BD " . $erreur->getMessage() ;
}
