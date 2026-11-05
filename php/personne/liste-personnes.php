<?php

require_once "../Connexion.php" ;

try
{
    $bd = Connexion::getInstance() ;

    // Les critères renseignés s'ajoutent avec l'opérateur AND.
    // Les critères portant sur les tables liées utilisent "exists" pour ne pas dupliquer les personnes.
    $sql = "select p.id, p.civilite, p.prenom, p.nom, p.specialite, p.biographie, p.photo from " . Connexion::$tables["personne"] . " as p where 1 " ;

    if( isset($_GET["id"])) $sql .= " and p.id = :id " ;

    if( isset($_GET["specialite"])) $sql .= " and p.specialite like :specialite " ;

    if( isset($_GET["nom"])) $sql .= " and p.nom like :nom " ;

    // Personne présente chez l'exposant donné
    if( isset($_GET["idExposant"]))
    {
        $sql .= " and exists ( select 1 from " . Connexion::$tables["exposer"] . " as ser"
              . " where ser.idPersonne = p.id and ser.idExposant = :idExposant ) " ;
    }

    // Personne présente chez un exposant dont le nom contient la valeur
    if( isset($_GET["nomExposant"]))
    {
        $sql .= " and exists ( select 1 from " . Connexion::$tables["exposer"] . " as ser"
              . " inner join " . Connexion::$tables["exposant"] . " as ex on ser.idExposant = ex.id"
              . " where ser.idPersonne = p.id and ex.nom like :nomExposant ) " ;
    }

    // Personne présente chez un exposant situé sur le lieu donné
    if( isset($_GET["numLieu"]))
    {
        $sql .= " and exists ( select 1 from " . Connexion::$tables["exposer"] . " as ser"
              . " inner join " . Connexion::$tables["exposant"] . " as ex on ser.idExposant = ex.id"
              . " where ser.idPersonne = p.id and ex.numLieu = :numLieu ) " ;
    }

    // Personne ayant écrit un livre dont le titre contient la valeur
    if( isset($_GET["titreLivre"]))
    {
        $sql .= " and exists ( select 1 from " . Connexion::$tables["ecrire"] . " as ec"
              . " inner join " . Connexion::$tables["livre"] . " as li on ec.idLivre = li.id"
              . " where ec.idPersonne = p.id and li.titre like :titreLivre ) " ;
    }

    // Personne animant un événement dont le titre contient la valeur
    if( isset($_GET["titreEvenement"]))
    {
        $sql .= " and exists ( select 1 from " . Connexion::$tables["evenement"] . " as ev"
              . " where ev.idAnimateur = p.id and ev.titre like :titreEvenement ) " ;
    }

    $sql .= " order by p.nom, p.prenom" ;

    $cursor = $bd->prepare( $sql ) ;

    if( isset($_GET["id"])) $cursor->bindValue( ":id", $_GET["id"], PDO::PARAM_INT ) ;
    if( isset($_GET["specialite"])) $cursor->bindValue( ":specialite", "%" . $_GET["specialite"] . "%", PDO::PARAM_STR ) ;
    if( isset($_GET["nom"])) $cursor->bindValue( ":nom", "%" . $_GET["nom"] . "%", PDO::PARAM_STR ) ;
    if( isset($_GET["idExposant"])) $cursor->bindValue( ":idExposant", $_GET["idExposant"], PDO::PARAM_INT ) ;
    if( isset($_GET["nomExposant"])) $cursor->bindValue( ":nomExposant", "%" . $_GET["nomExposant"] . "%", PDO::PARAM_STR ) ;
    if( isset($_GET["numLieu"])) $cursor->bindValue( ":numLieu", $_GET["numLieu"], PDO::PARAM_INT ) ;
    if( isset($_GET["titreLivre"])) $cursor->bindValue( ":titreLivre", "%" . $_GET["titreLivre"] . "%", PDO::PARAM_STR ) ;
    if( isset($_GET["titreEvenement"])) $cursor->bindValue( ":titreEvenement", "%" . $_GET["titreEvenement"] . "%", PDO::PARAM_STR ) ;

    $cursor->execute() ;

    $data = $cursor->fetchAll( PDO::FETCH_ASSOC ) ;

    echo json_encode( $data ) ;

}
catch( PDOException $erreur )
{
    echo "Probleme d'acces à la BD " . $erreur->getMessage() ;
}

?>
