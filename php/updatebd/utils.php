<?php

require_once( "../Connexion.php" ) ;

function getMaxId( $db, $table, $field="id" )
{
    try
    {
        $sqlMaxId = "select max(" . $field . ") as maxid from " . Connexion::$tables[$table] ;
        $cursorMaxId = $db->prepare( $sqlMaxId ) ;
        $cursorMaxId->execute() ;
        return intval($cursorMaxId->fetch()["maxid"]) ;
    }
    catch( PDOException $error )
    {
        echo "Erreur à la recherche du max id dans la table " . $table . " : " . $error ;
        return -1 ;
    }
}   

function findByField( $db, $table, $where, $bind, $value )
{
    try
    {
        $sql = "select * from " . Connexion::$tables[$table] . " where " . $where ;
        $cursor = $db->prepare( $sql ) ;
        $cursor->bindValue( $bind, $value ) ;
        $cursor->execute() ;
        return $cursor->fetch() ;
    }
    catch( PDOException $error )
    {
        echo "Erreur à la recherche dans la table " . $table . " : " . $error ;
        return null ;
    }   
}

function cherchePersonne( $db, $prenom, $nom )
{
    try
    {
        $sql = "select * from " . Connexion::$tables["personne"] . " where prenom = :prenom and upper(nom) = :nom " ;
        $cursor = $db->prepare( $sql ) ;
        $cursor->bindValue( ":prenom", $prenom ) ;
        $cursor->bindValue( ":nom", strtoupper($nom) ) ;
        $cursor->execute() ;
        return $cursor->fetch() ;
    }
    catch( PDOException $error )
    {
        echo "Erreur à la recherche de la personne " . $prenom . " " . $nom . " : " . $error ;
    }
}

function insertPersonne( $db, $prenom, $nom, $specialite="auteur" )
{
    try
    {
        $sqlInsert = "insert into " . Connexion::$tables["personne"] . "(id, prenom, nom, specialite) values( :id, :prenom, :nom, :specialite )" ;
        $cursorInsert = $db->prepare( $sqlInsert ) ;
        $idPersonne = getMaxId( $db, "personne" ) + 1 ;
        $cursorInsert->bindValue( ":id", $idPersonne ) ;
        $cursorInsert->bindValue( ":prenom", $prenom ) ;
        $cursorInsert->bindValue( ":nom", $nom ) ;
        $cursorInsert->bindValue( ":specialite", $specialite ) ;
        $cursorInsert->execute() ;
        return $idPersonne ;
    }
    catch( PDOException $error )
    {
        echo "Erreur à l'insertion de la personne " . $prenom . " " . $nom . " : " . $error ;
    }
}

function updatePersonnePhoto( $db, $fichier, $dossier )
{
    try
    {
        $fichier1 = strtoupper( $fichier ) ;
        $liste = str_replace( " ", ",", $fichier1 ) ;
        $liste = explode( ".", $liste ) ;
        $values = explode( ",", $liste[0] ) ;

        $sql = "update " . Connexion::$tables["personne"] . " set photo=:photo where upper(nom) = :value0 or upper(nom) = :value1" ;
        $cursor = $db->prepare( $sql ) ;
        $cursor->bindValue( ":value0", $values[0] ) ;
        $cursor->bindValue( ":value1", $values[1] ) ;
        $cursor->bindValue( ":photo", $dossier . "/" . $fichier ) ;
        $r = $cursor->execute() ;
        return $r ;
    }
    catch( PDOException $error )
    {
        echo "Erreur à la mise à jour de la personne " . $prenom . " " . $nom . " avec la photo " . $fichier . " : " . $error ;
    }
}

function insertEditeur( $db, $nom )
{
    try
    {
        $sqlInsert = "insert into " . Connexion::$tables["editeur"] . "(id, nom) values( :id, :nom )" ;
        $cursorInsert = $db->prepare( $sqlInsert ) ;
        $idEditeur = getMaxId( $db, "editeur" ) + 1 ;
        $cursorInsert->bindValue( ":id", $idEditeur ) ;
        $cursorInsert->bindValue( ":nom", $nom ) ;
        $cursorInsert->execute() ;
        return $idEditeur ;
    }
    catch( PDOException $error )
    {
        echo "Erreur à l'insertion de l'éditeur " . " " . $nom . " : " . $error ;
    }
}

function insertLivre( $db, $titre, $idEditeur=-1 )
{
    try
    {
        $sqlInsert = "insert into " . Connexion::$tables["livre"] . "(id, titre, idediteur) values( :id, :titre, :idediteur )" ;
        $cursorInsert = $db->prepare( $sqlInsert ) ;
        $idLivre = getMaxId( $db, "livre" ) + 1 ;
        $cursorInsert->bindValue( ":id", $idLivre, PDO::PARAM_INT ) ;
        $cursorInsert->bindValue( ":titre", $titre ) ;
        if( $idEditeur >= 0 )
            $cursorInsert->bindValue( ":idediteur", $idEditeur, PDO::PARAM_INT ) ;
        else
            $cursorInsert->bindValue( ":idediteur", "NULL", PDO::PARAM_INT ) ;
        $cursorInsert->execute() ;
        return $idLivre ;
    }
    catch( PDOException $error )
    {
        echo "Erreur à l'insertion de l'éditeur " . " " . $nom . " : " . $error ;
    }
}

function chercheLieu( $db, $nom )
{
    try
    {
        $sql = "select * from " . Connexion::$tables["lieu"] . " where nom = :nom " ;
        $cursor = $db->prepare( $sql ) ;
        $cursor->bindValue( ":nom", $nom ) ;
        $cursor->execute() ;
        return $cursor->fetch() ;
    }
    catch( PDOException $error )
    {
        echo "Erreur à la recherche du lieu " . $nom . " : " . $error ;
    }
}

function insertLieu( $db, $nom, $hall, $type, $num=-1 )
{
    try
    {
        $sqlInsert = "insert into " . Connexion::$tables["lieu"] . "(num, nom, type, hall) values( :num, :nom, :type, :hall )" ;
        $cursorInsert = $db->prepare( $sqlInsert ) ;
        if( $num < 0 ) $num = getMaxId( $db, "lieu", "num" ) + 1 ;
        $cursorInsert->bindValue( ":num", $num, PDO::PARAM_INT ) ;
        $cursorInsert->bindValue( ":nom", $nom ) ;
        $cursorInsert->bindValue( ":type", $type ) ;
        $cursorInsert->bindValue( ":hall", $hall, PDO::PARAM_INT ) ;
        $cursorInsert->execute() ;
        return $num ;
    }
    catch( PDOException $error )
    {
        echo "Erreur à l'insertion du lieu " . $num . " " . $nom . " : " . $error ;
    }
}

function insertTypeevenement( $db, $type )
{
    try
    {
        $sqlInsert = "insert into " . Connexion::$tables["typeevenement"] . "(type) values( :type )" ;
        $cursorInsert = $db->prepare( $sqlInsert ) ;
        $cursorInsert->bindValue( ":type", $type ) ;
        $cursorInsert->execute() ;
        return $type ;
    }
    catch( PDOException $error )
    {
        echo "Erreur à l'insertion du typeevenement " . $type . " " . $error ;
    }
}

function insertEvenement( $db, $debut, $typeEvenement, $titreEvenement, $numLieu, $commentaire, $idAnimateur ) 
{
    try
    {
        $sqlInsert = "insert into " . Connexion::$tables["evenement"] . "(id, type, titre, commentaire, numlieu, idanimateur) values( :id, :type, :titre, :commentaire, :numLieu, :idAnimateur )" ;
        $cursorInsert = $db->prepare( $sqlInsert ) ;
        $idEvenement = getMaxId( $db, "evenement" ) + 1 ;
        $cursorInsert->bindValue( ":id", $idEvenement, PDO::PARAM_INT ) ;
        $cursorInsert->bindValue( ":type", $typeEvenement ) ;
        $cursorInsert->bindValue( ":titre", $titreEvenement ) ;
        $cursorInsert->bindValue( ":commentaire", $commentaire ) ;
        $cursorInsert->bindValue( ":numLieu", $numLieu, PDO::PARAM_INT ) ;
        $cursorInsert->bindValue( ":idAnimateur", $idAnimateur, PDO::PARAM_INT ) ;
        $cursorInsert->execute() ;
        return $idEvenement ;
    }
    catch( PDOException $error )
    {
        echo "Erreur à l'insertion de l'événement " . " " . $titreEvenement . " : " . $error ;
    }

}

function insertExposer( $db, $idEvenement, $idLivre ) 
{
    try
    {
        $sqlInsert = "insert into " . Connexion::$tables["exposer"] . "(idevenement, idlivre) values( :idEvenement, :idLivre )" ;
        $cursorInsert = $db->prepare( $sqlInsert ) ;
        $cursorInsert->bindValue( ":idEvenement", $idEvenement, PDO::PARAM_INT ) ;
        $cursorInsert->bindValue( ":idLivre", $idLivre, PDO::PARAM_INT ) ;
        $cursorInsert->execute() ;
    }
    catch( PDOException $error )
    {
        echo "Erreur à l'insertion de l'exposition de l'événement " . " " . $idEvenement . " et du livre " . $idLivre . " : " . $error ;
    }
}

?>
