<?php

// Mot de passe des pages de config (plans, evenements), on garde seulement le hash.
// Quand on le change, le hash est mis dans mot-de-passe.hash.php
//
// Pour le reset : supprimer mot-de-passe.hash.php (retour a fdlc2026) ou faire
// php -r "file_put_contents('mot-de-passe.hash.php', '<?php return ' . var_export(password_hash('nouveau', PASSWORD_DEFAULT), true) . ';');"

$hashParDefaut = '$2y$10$TeU61z314J7aeOz9nvUVKubTurNyDkHQqm6oSpzc5rwzJHG0GP9eC' ;
$fichierHash = __DIR__ . "/mot-de-passe.hash.php" ;

// Contre les essais en boucle : apres 5 erreurs l'adresse IP est bloquee 5 minutes
$fichierEssais = sys_get_temp_dir() . "/fdlc2026-essais-mdp.json" ;
$nbEssaisMax = 5 ;
$dureeBlocage = 300 ;

function hashMotDePasse()
{
    global $hashParDefaut, $fichierHash ;

    if( file_exists( $fichierHash ) ) return include $fichierHash ;
    return $hashParDefaut ;
}

// Essais ratés de chaque adresse IP : [ ip => [ "nb" => ..., "debut" => ... ] ]
function lisEssais()
{
    global $fichierEssais, $dureeBlocage ;

    $essais = [] ;
    if( file_exists( $fichierEssais ) ) $essais = json_decode( file_get_contents( $fichierEssais ), true ) ?? [] ;

    // on oublie les anciens essais
    foreach( $essais as $ip => $essai )
    {
        if( time() - $essai["debut"] >= $dureeBlocage ) unset( $essais[$ip] ) ;
    }
    return $essais ;
}

function estBloque()
{
    global $nbEssaisMax ;

    $essais = lisEssais() ;
    $ip = $_SERVER["REMOTE_ADDR"] ?? "" ;
    return isset( $essais[$ip] ) && $essais[$ip]["nb"] >= $nbEssaisMax ;
}

function motDePasseOk( $mdp )
{
    global $fichierEssais ;

    if( estBloque() ) return false ;

    $ok = is_string( $mdp ) && password_verify( $mdp, hashMotDePasse() ) ;

    $essais = lisEssais() ;
    $ip = $_SERVER["REMOTE_ADDR"] ?? "" ;

    if( $ok ) unset( $essais[$ip] ) ;
    else
    {
        if( !isset( $essais[$ip] ) ) $essais[$ip] = [ "nb" => 0, "debut" => time() ] ;
        $essais[$ip]["nb"]++ ;
    }

    file_put_contents( $fichierEssais, json_encode( $essais ), LOCK_EX ) ;
    return $ok ;
}

function changeMotDePasse( $nouveau )
{
    global $fichierHash ;

    $contenu = "<?php return " . var_export( password_hash( $nouveau, PASSWORD_DEFAULT ), true ) . ";" ;
    return file_put_contents( $fichierHash, $contenu ) !== false ;
}

?>
