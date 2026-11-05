<?php

require_once "../Connexion.php" ;

header( "Content-Type: application/json; charset=utf-8" ) ;

try
{
    $bd = Connexion::getInstance() ;

    $hall = filter_input( INPUT_GET, "hall", FILTER_VALIDATE_INT ) ;

    if( !$hall )
    {
        http_response_code( 400 ) ;
        echo json_encode( [] ) ;
        exit ;
    }

    // les stands n'ont pas toujours leur hall de renseigne,
    // dans ce cas c'est le premier chiffre du numero (207 -> hall 2)
    $sql = "select num, nom, hall, type, x1, y1, x2, y2 from " . Connexion::$tables["lieu"]
         . " where hall = :hall or ( hall is null and num div 100 = :hall2 ) order by num" ;

    $cursor = $bd->prepare( $sql ) ;
    $cursor->bindValue( ":hall", $hall, PDO::PARAM_INT ) ;
    $cursor->bindValue( ":hall2", $hall, PDO::PARAM_INT ) ;
    $cursor->execute() ;

    echo json_encode( $cursor->fetchAll( PDO::FETCH_ASSOC ), JSON_UNESCAPED_UNICODE ) ;
}
catch( Exception $erreur )
{
    http_response_code( 500 ) ;
    echo json_encode( ["erreur" => "Probleme d'acces à la BD " . $erreur->getMessage()], JSON_UNESCAPED_UNICODE ) ;
}

?>
