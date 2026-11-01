<?php
/*
require_once "../Connexion.php" ;

try
{
    $bd = Connexion::getInstance() ;

    $sql = "select distinct num, nom, type, x1, y1, x2, y2 from " . Connexion::$tables["lieu"] . " where 1 " ;

    if( isset($_GET["nom"])) 
    {
        $sql .= " and nom = :nom " ;
    }

    if( isset($_GET["type"])) 
    {
        $sql .= " and type = :type " ;
    }

          $sql .= isset($_GET["num"]) ? " order by num" : " order by nom" ;

    $cursor = $bd->prepare( $sql ) ;

    if( isset($_GET["nom"]))
    {
        $cursor->bindValue( ":nom", $_GET["nom"], PDO::PARAM_STR ) ;
    }

    if( isset($_GET["type"]))
    {
        $cursor->bindValue( ":type", $_GET["type"], PDO::PARAM_STR ) ;
    }

        if( isset($_GET["num"]))
    {
        $cursor->bindValue( ":num", $_GET["num"] . "%", PDO::PARAM_STR ) ;
    }

    $cursor->execute() ;

    $data = $cursor->fetchAll( PDO::FETCH_ASSOC ) ;

    echo json_encode( $data ) ;

}
catch( PDOException $erreur )
{
    echo "Probleme d'acces à la BD " . $erreur->getMessage() ;
}
*/


require_once "../Connexion.php" ;

try
{
    $bd = Connexion::getInstance() ;

    $sql = "select distinct num, nom, type, x1, y1, x2, y2 from " . Connexion::$tables["lieu"] . " where 1 " ;
    $params = array() ;

    if( isset($_GET["nom"]))
    {
        $sql .= " and nom = :nom " ;
        $params[":nom"] = $_GET["nom"] ;
    }

    if( isset($_GET["type"]))
    {
        $sql .= " and type = :type " ;
        $params[":type"] = $_GET["type"] ;
    }

    if( isset($_GET["num"]))
    {
        $sql .= " and cast(num as char) like :num " ;
        $params[":num"] = $_GET["num"] . "%" ;
    }

    $sql .= isset($_GET["num"]) ? " order by num" : " order by nom" ;

    $cursor = $bd->prepare( $sql ) ;
    $cursor->execute( $params ) ;

    echo json_encode( $cursor->fetchAll( PDO::FETCH_ASSOC ) ) ;
}
catch( PDOException $erreur )
{
    echo "Probleme d'acces à la BD " . $erreur->getMessage() ;
}




?>