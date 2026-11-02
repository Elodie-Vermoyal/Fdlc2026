


<?php

$titre = "" ;
$stitre = "" ;
$public = "" ;
$heures = [] ;
$lieux = [] ;
$auteurs = [] ;
$titres = [] ;
$editeurs = [] ;
$commentaire = "" ;


require_once( "../Connexion.php" ) ;

function getMaxId( $db, $table, $field="id" )
{
    $sqlMaxId = "select max(" . $field . ") as maxid from " . Connexion::$tables[$table] ;
    $cursorMaxId = $db->prepare( $sqlMaxId ) ;
    $cursorMaxId->execute() ;
    return intval($cursorMaxId->fetch()["idmax"]) ;
}

function findByField( $db, $table, $where, $bind, $value )
{
    $sql = "select * from " . Connexion::$tables[$table] . " where " . $where ;
    $cursor = $db->prepare( $sql ) ;
    $cursor->bindValue( $bind, $value ) ;
    $cursor->execute() ;
    return $cursor->fetch() ;
}

echo '<pre>';
if (is_uploaded_file($_FILES['userfile']['tmp_name'])) 
{
  echo "File ". $_FILES['userfile']['name'] ." téléchargé avec succès.\n";

  //readfile($_FILES['userfile']['tmp_name']);
  $lignes = file( $_FILES['userfile']['tmp_name'] ) ;

  try
  {
    $db = Connexion::getInstance() ;

    $nbinsert = 0 ;
    $nblignes = 0 ;

    try
    {
        // Cherche dernier id personne
        $idPersonne = getMaxId( $db, "personne" ) + 1 ;
        
        // Cherche dernier id evenement 
        $idEvenenemt = getMaxId( $db, "evenement" ) + 1 ;

        // Cherche dernier id livre 
        $idLivre = getMaxId( $db, "livre" ) + 1 ;

        // Cherche dernier id editeur 
        $idEditeur = getMaxId( $db, "editeur" ) + 1 ;

        // Cherche dernier num du lieu 
        $lieuNum = getMaxId( $db, "lieu", "num" ) + 1 ;

        // Insert evenement manquant
        $sqlEvenementInsert = "insert into " . Connexion::$tables["evenement"] . "(id, titre, stitre, public, debut, commentaire) values( :id, :titre, :stitre, :public, :debut, :commentaire )" ;
        $cursorEvenementInsert = $db->prepare( $sqlEvenementInsert ) ;

        // Insert livre manquant
        $sqlLivreInsert = "insert into " . Connexion::$tables["livre"] . "(id, titre, idEditeur) values( :id, :titre, :idEditeur )" ;
        $cursorLivreInsert = $db->prepare( $sqlLivreInsert ) ;

        // Insert éditeur manquant
        $sqlEditeurInsert = "insert into " . Connexion::$tables["editeur"] . "(id, nom) values( :id, :nom )" ;
        $cursorEditeurInsert = $db->prepare( $sqlEditeurInsert ) ;

        // Insert lieu manquant
        $sqlLieuInsert = "insert into " . Connexion::$tables["lieu"] . "(num, nom) values( :num, :nom )" ;
        $cursorLieuInsert = $db->prepare( $sqlLieuInsert ) ;

        // Insert auteur manquant
        $sqlAuteurInsert = "insert into " . Connexion::$tables["personne"] . "(id, nom, prenom, specialite) values( :id, :nom, :prenom, 'auteur' )" ;
        $cursorAuteurInsert = $db->prepare( $sqlAuteurInsert ) ;

        // Insert occurence ecrire manquante
        $sqlEcrireInsert = "insert into " . Connexion::$tables["ecrire"] . "(idPersonne, idLivre) values( :idPersonne, :idLivre )" ;
        $cursorEcrireInsert = $db->prepare( $sqlEcrireInsert ) ;

        foreach( $lignes as $ligne )
        {
            $values = explode( "%%", $ligne ) ;
            if( $values[0] == "titre" && $titre != $values[1] )
            {
                if( $titre != "" )
                {
                    // Affiche les données 
                    echo "<br><br>" ;
                    echo $titre . "<br>" ;
                    echo $stitre . "<br>" ;
                    echo $public . "<br>" ;
                    for( $i = 0 ; $i < count($heures); $i++ )
                    {
                        echo $heures[$i] . " " . $lieux[$i] . "<br>" ;              
                    }
                    for( $i = 0 ; $i < count($auteurs); $i++ )
                    {
                        echo $auteurs[$i] . " " . $titres[$i] . " " . $editeurs[$i] . "<br>" ;              
                    }
                    echo $commentaire . "<br>" ;

                    // Effectue les traitements de mise à jour

                    // Cree autant d'evenement que d'heure
                    for( $i = 0 ; $i < count($heures); $i++ )
                    {
                        // Cree l'heure
                        $heure = str_replace( "h", ":", $heures[$i] ) ;
                        $heure = str_replace( "H", ":", $heures[$i] ) ;
                        $debut = "2026-11-22 " . $heure . ":00" ;

                        // Cherche ou crée le lieu
                        $rowLieu = findByField( $db, "lieu", "nom = :nom", ":nom", $lieux[$i] ) ;

                        $currentNumLieu = 0 ;
                        if( $rowLieu )
                        {
                            $currentNumLieu = intval( $rowLieu["num"]) ;
                        }
                        else
                        {
                            // Crée le lieu
                            $cursorLieuInsert->bindValue( ":num", $numLieu, PDO::PARAM_INT ) ;
                            $cursorLieuInsert->bindValue( "!nom", $lieux[$i], PDO:PARAM_STR ) ;
                            $cursorLieuInsert->execute() ; 
                            $currentNumLieu = $numLieu ;
                        }


                        $cursorEvenementInsert->bindValue( ":id", $idEvenement, PDO::PARAM_INT ) ;
                        $cursorEvenementInsert->bindValue( ":titre", $titre, PDO::PARAM_STR ) ;
                        $cursorEvenementInsert->bindValue( ":stitre", $stitre, PDO::PARAM_STR ) ;
                        $cursorEvenementInsert->bindValue( ":public", $public, PDO::PARAM_STR ) ;
                        $cursorEvenementInsert->bindValue( ":commentaire", $commentaire, PDO::PARAM_STR ) ;
                        $cursorEvenementInsert->bindValue( ":debut", $debut, PDO::PARAM_INT ) ;
                        $cursorEvenementInsert->bindValue( ":numLieu", $currentNumLieu, PDO::PARAM_INT ) ;

                        // Insere livres et éditeurs
                        for( $i = 0 ; $i < count($auteurs); $i++ )
                        {
                            // Cherche l'editeur
                            $currentIdEditeur = 0 ;
                            $rowEditeur = findByField( $db, "editeur", "nom = :nom", ":nom", $editeurs[$i] ) )
                            if( $rowEditeur ) $currentIdEditeur = intval( $rowEditeur["id"] ) ;
                            else
                            {
                                // Insere l'éditeur
                                $cursorInsertInsert->bindValue( ":id", $idEditeur ) ;
                                $cursorInsertInsert->bindValue( ":nom", $editeurs[$i] ) ;
                                $cursorInsertInsert->execute() ;
                                $currentIdEditeur = $idEditeur ;
                            }

                            // Cherche le livre
                            $currentIdLivre = 0 ;
                            $rowLivre = findByField( $db, "livre", "titre = :titre", ":titre", $titre[$i] ) ;
                            if( $rowLivre ) $currentIdLivre = intval($rowLivre["id"]) ;
                            else
                            {
                                // Insere le livre
                                $cursorLivreInsert->bindValue( ":id", $idLivre, PDO::PARAM_INT ) ;
                                $cursorLivreInsert->bindValue( ":titre", $titres[$i] ) ;
                                $cursorLivreInsert->bindValue( ":idEditeur", $currentIdEditeur, PDO::PARAM_INT ) ;
                                $cursorLivreInsert->execute() ;
                                $currentIdLivre = $idLivre ;
                            }

                            // Cherche l'auteur
                            $currentIdPersonne = 0 ;
                            $rowPersonne = findByField( $db, "personne", "concat( prenom, ' ', upper(nom)) = :nomprenom", ":nomprenom", $auteurs[$i] ) ;
                            if( $rowPersonne ) $currentIdPersonne = intval($rowPersonne["id"]) ;
                            else
                            {
                                $prenomnom = explode( " ", $auteurs[$i] ) ;
                                $cursorAuteurInsert->bindValue( ":id", $idPersonne, PDO::PARAM_INT ) ;
                                $cursorAuteurInsert->bindValue( ":prenom", $prenomnom[0], PDO::PARAM_STR ) ;
                                $cursorAuteurInsert->bindValue( ":nom", $prenomnom[1], PDO::PARAM_STR ) ;
                                $cursorAuteurInsert->execute() ;
                                $currentIdPersonne = $idPersonne ;
                            }

                            // Creer une occurence d'ecrire
                            try
                            {
                                $cursorEcrireInsert->bindValue( ":idLivre", $currentIdLivre, PDO::PARAM_INT ) ;
                                $cursorEcrireInsert->bindValue( ":idPersonne", $currentIdPersonne, PDO::PARAM_INT ) ;
                                $cursorEcrireInsert->execute() ;
                            }
                            catch( PDOException $error ) {}

                            // Creer une occurence de prensenter
                            try
                            {
                                $cursorEcrireInsert->bindValue( ":idLivre", $currentIdLivre, PDO::PARAM_INT ) ;
                                $cursorEcrireInsert->bindValue( ":idPersonne", $currentIdPersonne, PDO::PARAM_INT ) ;
                                $cursorEcrireInsert->execute() ;
                            }
                            catch( PDOException $error ) {}

                            $idPersonne++ ;
                            $idEditeur++ ;
                            $idLivre++ ;
                            $idEvenement++ ;
                        }
                    }
                }

                $titre = $values[1] ;
                $stitre = "" ;
                $public = "" ;
                $heures = [] ;
                $lieux = [] ;
                $auteurs = [] ;
                $titres = [] ;
                $editeurs = [] ;
                $commentaire = "" ;
            }
            else if( $values[0] == "heure" )
            {
                $heurelieu = explode(" - ", $values[1]) ;
                array_push( $heures, $heurelieu[0] );
                array_push($lieux, $heurelieu[1] ) ;
            }
            else if( $values[0] == "stitre" )
            {
                $stitre = $values[1] ;
            }
            else if( $values[0] == "public" )
            {
                $public = $values[1] ;
            }
            else if( $values[0] == "auteur" )
            {
                $auteurtitre = explode( " (", $values[1] ) ;
                $auteurtitreediteurs = explode( ", et ", $auteurtitre[1] ) ;

                foreach( $auteurtitreediteurs as $auteurtitreediteur )
                {
                $titreediteur = explode( ", ", $auteurtitreediteur ) ;
                array_push( $auteurs, $auteurtitre[0] ) ;
                array_push( $titres, $titreediteur[0]) ;
                $titreediteur[1] = str_replace( ")","", $titreediteur[1] ) ;
                array_push( $editeurs, $titreediteur[1]) ;
                }
            }
            else
            {
                $commentaire .= $values[0] ;
            }
        }
    }
    catch( PDOException $error )
    {
      echo "Erreur à la ligne n° " . $nblignes . " " . $error ;
    }
    echo $nbupdate . " lignes modifiées dans la table " . Connexion::$tables["personne"] . "<br>";
  }
  catch( PDOException $error )
  {
    echo "Erreur à la ligne n° " . $nblignes . " " . $error ;
  }
} 
else 
{
   echo "Attaque possible par téléchargement de fichier : ";
   echo "Nom du fichier : '". $_FILES['userfile']['tmp_name'] . "'.";
}

echo '</pre>';

?>

<form action="index.php" method="POST">
    <button type="submit" name="mon_bouton" value="valider">Revenir au menu</button>
</form>