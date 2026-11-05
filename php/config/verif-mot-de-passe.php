<?php

header( "Content-Type: application/json; charset=utf-8" ) ;

require_once "mot-de-passe.php" ;

// le mot de passe est envoye en POST pour ne pas apparaitre dans l'url
$donnees = json_decode( file_get_contents( "php://input" ), true ) ;

echo json_encode( [ "ok" => motDePasseOk( $donnees["mdp"] ?? "" ) ] ) ;

?>
