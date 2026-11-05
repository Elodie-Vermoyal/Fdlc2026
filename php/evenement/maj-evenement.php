<?php

require_once "../Connexion.php" ;
require_once "../config/mot-de-passe.php" ;

header( "Content-Type: application/json; charset=utf-8" ) ;

$donnees = json_decode( file_get_contents( "php://input" ), true ) ;

if( !motDePasseOk( $donnees["mdp"] ?? "" ) )
{
    http_response_code( 403 ) ;
    echo json_encode( ["erreur" => "Mot de passe incorrect"] ) ;
    exit ;
}

$evenement = $donnees["evenement"] ?? [] ;
$idLivres = $donnees["idLivres"] ?? [] ;

// la date de debut et le lieu sont obligatoires
if( empty( $evenement["titre"] ) || empty( $evenement["debut"] ) || empty( $evenement["numLieu"] ) || $evenement["numLieu"] < 0 )
{
    http_response_code( 400 ) ;
    echo json_encode( ["erreur" => "Le titre, la date de début et le lieu sont obligatoires"], JSON_UNESCAPED_UNICODE ) ;
    exit ;
}

// "" ou -1 venant de l'appli => null dans la BD
function valeur( $valeur )
{
    if( $valeur === "" || $valeur === null || $valeur === -1 ) return null ;
    return $valeur ;
}

// "2026-11-21T14:30:00" => "2026-11-21 14:30:00"
function dateBd( $date )
{
    if( empty( $date ) ) return null ;
    return substr( str_replace( "T", " ", $date ), 0, 19 ) ;
}

try
{
    $bd = Connexion::getInstance() ;
    $bd->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION ) ;
    $bd->beginTransaction() ;

    $tableEvenement = Connexion::$tables["evenement"] ;
    $tablePresenter = Connexion::$tables["presenter"] ;

    $id = (int)( $evenement["id"] ?? -1 ) ;

    if( $id <= 0 )
    {
        // la colonne id n'est pas en auto_increment
        $id = (int)$bd->query( "select coalesce( max( id ), 0 ) + 1 from " . $tableEvenement )->fetchColumn() ;

        $sql = "insert into " . $tableEvenement
             . " ( id, typeevenement, titre, stitre, public, commentaire, debut, fin, idAnimateur, numLieu )"
             . " values ( :id, :type, :titre, :stitre, :public, :commentaire, :debut, :fin, :idAnimateur, :numLieu )" ;
    }
    else
    {
        $sql = "update " . $tableEvenement
             . " set typeevenement = :type, titre = :titre, stitre = :stitre, public = :public, commentaire = :commentaire,"
             . " debut = :debut, fin = :fin, idAnimateur = :idAnimateur, numLieu = :numLieu where id = :id" ;
    }

    $cursor = $bd->prepare( $sql ) ;
    $cursor->bindValue( ":id", $id, PDO::PARAM_INT ) ;
    $cursor->bindValue( ":type", valeur( $evenement["typeevenement"] ?? "" ) ) ;
    $cursor->bindValue( ":titre", trim( $evenement["titre"] ) ) ;
    $cursor->bindValue( ":stitre", valeur( $evenement["stitre"] ?? "" ) ) ;
    $cursor->bindValue( ":public", valeur( $evenement["public"] ?? "" ) ) ;
    $cursor->bindValue( ":commentaire", valeur( $evenement["commentaire"] ?? "" ) ) ;
    $cursor->bindValue( ":debut", dateBd( $evenement["debut"] ) ) ;
    $cursor->bindValue( ":fin", dateBd( $evenement["fin"] ?? "" ) ) ;
    $cursor->bindValue( ":idAnimateur", valeur( $evenement["idAnimateur"] ?? -1 ), PDO::PARAM_INT ) ;
    $cursor->bindValue( ":numLieu", (int)$evenement["numLieu"], PDO::PARAM_INT ) ;
    $cursor->execute() ;

    // on remplace les livres presentes par la nouvelle liste
    $cursor = $bd->prepare( "delete from " . $tablePresenter . " where idEvenement = :id" ) ;
    $cursor->bindValue( ":id", $id, PDO::PARAM_INT ) ;
    $cursor->execute() ;

    $cursor = $bd->prepare( "insert into " . $tablePresenter . " ( idEvenement, idLivre ) values ( :id, :idLivre )" ) ;
    foreach( array_unique( $idLivres ) as $idLivre )
    {
        $cursor->bindValue( ":id", $id, PDO::PARAM_INT ) ;
        $cursor->bindValue( ":idLivre", (int)$idLivre, PDO::PARAM_INT ) ;
        $cursor->execute() ;
    }

    $bd->commit() ;

    echo json_encode( ["id" => $id] ) ;
}
catch( Exception $erreur )
{
    if( isset( $bd ) && $bd->inTransaction() ) $bd->rollBack() ;
    http_response_code( 500 ) ;
    echo json_encode( ["erreur" => "Probleme d'acces à la BD " . $erreur->getMessage()], JSON_UNESCAPED_UNICODE ) ;
}

?>
