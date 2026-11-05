<?php

header( "Content-Type: application/json; charset=utf-8" ) ;

require_once "mot-de-passe.php" ;

$donnees = json_decode( file_get_contents( "php://input" ), true ) ;

$ancien = $donnees["ancien"] ?? "" ;
$nouveau = $donnees["nouveau"] ?? "" ;

if( !motDePasseOk( $ancien ) )
{
    http_response_code( 403 ) ;
    echo json_encode( ["erreur" => "Ancien mot de passe incorrect"] ) ;
    exit ;
}

if( !is_string( $nouveau ) || strlen( $nouveau ) < 6 )
{
    http_response_code( 400 ) ;
    echo json_encode( ["erreur" => "Le nouveau mot de passe doit faire au moins 6 caracteres"] ) ;
    exit ;
}

if( !changeMotDePasse( $nouveau ) )
{
    http_response_code( 500 ) ;
    echo json_encode( ["erreur" => "Impossible d'enregistrer le mot de passe"] ) ;
    exit ;
}

echo json_encode( ["ok" => true] ) ;

?>
