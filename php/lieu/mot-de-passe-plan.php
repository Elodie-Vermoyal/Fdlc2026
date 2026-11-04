<?php

// Mot de passe de la page config des plans, on garde seulement le hash.
// Quand on le change, le hash est mis dans mot-de-passe-plan.hash.php
//
// Pour le reset : supprimer mot-de-passe-plan.hash.php (retour a fdlc2026) ou faire
// php -r "file_put_contents('mot-de-passe-plan.hash.php', '<?php return ' . var_export(password_hash('nouveau', PASSWORD_DEFAULT), true) . ';');"

$hashParDefaut = '$2y$10$TeU61z314J7aeOz9nvUVKubTurNyDkHQqm6oSpzc5rwzJHG0GP9eC' ;
$fichierHash = __DIR__ . "/mot-de-passe-plan.hash.php" ;

function hashMotDePasse()
{
    global $hashParDefaut, $fichierHash ;

    if( file_exists( $fichierHash ) ) return include $fichierHash ;
    return $hashParDefaut ;
}

function motDePasseOk( $mdp )
{
    return is_string( $mdp ) && password_verify( $mdp, hashMotDePasse() ) ;
}

function changeMotDePasse( $nouveau )
{
    global $fichierHash ;

    $contenu = "<?php return " . var_export( password_hash( $nouveau, PASSWORD_DEFAULT ), true ) . ";" ;
    return file_put_contents( $fichierHash, $contenu ) !== false ;
}

?>
