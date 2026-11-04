<?php

// Mot de passe de la page de configuration des plans (stocke hashé)
// pour le changer : php -r "echo password_hash('nouveau', PASSWORD_DEFAULT);"
$hashMotDePassePlan = '$2y$10$TeU61z314J7aeOz9nvUVKubTurNyDkHQqm6oSpzc5rwzJHG0GP9eC' ;

function motDePasseOk( $mdp )
{
    global $hashMotDePassePlan ;
    return is_string( $mdp ) && password_verify( $mdp, $hashMotDePassePlan ) ;
}

?>
