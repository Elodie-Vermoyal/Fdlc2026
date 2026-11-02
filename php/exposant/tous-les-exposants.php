<?php

header("Access-Control-Allow-Origin: http://localhost:8101");
header("Content-Type: application/json; charset=UTF-8");

require_once "../Connexion.php" ;

try
{
    $bd = Connexion::getInstance() ;

    $sql = "select distinct idexposant as id, nomexposant as nom, nomlieu from " . Connexion::$tables["PersonneExposantExposerLieu"] . " where 1 " ;

    if( isset($_GET["nom"])) 
    {
        $sql .= " and nom = :nom " ;
    }

    if( isset($_GET["nomLieu"])) 
    {
        $sql .= " and nomLieu like :nomLieu " ;
    }

    $sql .= " order by nomexposant" ;

    $cursor = $bd->prepare( $sql ) ;

    if( isset($_GET["nom"]))
    {
        $cursor->bindValue( ":nom", $_GET["nom"], PDO::PARAM_STR ) ;
    }

    if( isset($_GET["nomLieu"]))
    {
        $cursor->bindValue( ":nomLieu", $_GET["nomLieu"] . "%", PDO::PARAM_STR ) ;
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