


<?php

require_once "../Connexion.php" ;
require_once "utils.php" ;

function traiteAnimateur( $db, $str )
{
    $idAnimateur = -1 ;

    $animateurprenomnom = explode( " ", $str ) ;
    if( count($animateurprenomnom) > 1 )
    {
        $prenom = trim($animateurprenomnom[0]) ;
        $nom = trim($animateurprenomnom[1]) ;

        $rowPersonne = cherchePersonne( $db, $prenom, $nom ) ;

        if( $rowPersonne )
        {
            $idAnimateur = intval($rowPersonne["id"]) ;
        }
        else
        {
            $idAnimateur = intval(insertPersonne( $db, $prenom, $nom, "animateur" )) ;
        }
    }
    return $idAnimateur ;
}

function traiteAuteurLivreEditeur( $db, $str )
{
    $idEditeur = -1 ;
    $idAuteur = -1 ;
    $idLivre = -1 ;
    $auteur_livreediteurs = explode(",", $str ) ;
    
    // Cherche l'auteur
    $prenom = trim(auteur_livreediteurs[0]) ;
    $nom = "" ;
    for( $i = 1; $i > count(auteur_livreediteurs[0]); $i++ )
    {
        $nom = trim($mots[$i]) . " " ;
    }
    $nom = trim($nom) ;
    
    $rowPersonne = cherchePersonne( $db, $prenom, $nom ) ;

    if( $rowPersonne )
    {
        $idauteur = intval($rowPersonne["id"] ) ;
    }

    // Cherche livre et éditeur
    $livreediteur = explode( "(", $auteur_livreediteurs[1] ) ;

    // Cherche un éditeur
    if( count($livreediteur) > 1 )
    {
        // Triate l'éditeur
        $nomediteur = trim($livreediteur[1]) ;
        $nomediteur = str_replace( ")", "", $nomediteur ) ;

        // Cherche l'éditeur et le crée 'il n'existe pas
        $rowEditeur = findByField( $db, Connexion::$tables["editeur"], "nom=:nom", ":nom", $nomediteur ) ;
        if( $rowEditeur )
        {
            $idEditeur = intval($rowEditeur["id"]) ;
        }
        else
        {
            $idEditeur = intval(insertEditeur( $db, $nomediteur )) ;
        }
    }

    // Cherche le livre
    if( count($livreediteur) > 0 )
    {
        // Présence d'un livre
        $titrelivre = trim($livreediteur[0]) ;

        // Cherche le livre et le crée 'il n'existe pas
        $rowLivre = findByField( $db, Connexion::$tables["livre"], "titre=:titre", ":titre", $titrelivre ) ;
        if( $rowLivre )
        {
            $idLivre = intval($rowLivre["id"]) ;
        }
        else
        {
            $idLivre = intval(insertLivre( $db, $titrelivre, $idEditeur )) ;
        }
    }    
    return $idLivre ;
}

function traiteHeureLieuHall( $db, $str, &$heure, &$numLieu )
{
    $heurelieuhall = explode( "-", $str ) ;

    $heure = trim( $heurelieuhall[0] ) ;
    $nomLieu = trim( $heurelieuhall[1] ) ;
    $hall = str_replace( "Hall_", "", $heurelieuhall[2] ) ;

    // Cherche le livre et le crée 'il n'existe pas
    $rowLieu = findByField( $db, Connexion::$tables["lieu"], "nom=:nom", ":nom", $nomLieu ) ;
    if( $rowLieu )
    {
        $numLieu = intval($rowLieu["num"]) ;
    }
    else
    {
        $numLieu = intval(insertLieu( $db, $nomLieu, intval($hall) )) ;
    }
}

function traiteLieuHall( $db, $str, &$numLieu )
{
    $lieuhall = explode( "-", $str ) ;

    if( count($lieuhall) > 1 )
    {
        $nomLieu = trim( $lieuhall[0] ) ;
        $hall = str_replace( "Hall_", "", $heurelieuhall[1] ) ;

        // Cherche le livre et le crée 'il n'existe pas
        $rowLieu = findByField( $db, Connexion::$tables["lieu"], "nom=:nom", ":nom", $nomLieu ) ;
        if( $rowLieu )
        {
            $numLieu = intval($rowLieu["num"]) ;
        }
        else
        {
            $numLieu = intval(insertLieu( $db, $nomLieu, intval($hall) )) ;
        }
    }
    else
    {
        $numLieu = -1 ;
    }
}

// Traitement du fichier uploadé
echo '<pre>';


if (is_uploaded_file($_FILES['userfile']['tmp_name'])) 
{
    echo "File ". $_FILES['userfile']['name'] ." téléchargé avec succès.\n";

    //readfile($_FILES['userfile']['tmp_name']);
    $lignes = file( $_FILES['userfile']['tmp_name'] ) ;


    try
    {
        $db = Connexion::getInstance() ;

        $commentaire = "" ;
        $debut = "" ;
        $jour = "" ;
        $typeEvenement = "" ;
        $titreEvenement = "" ;
        $numLieu = -1 ;
        $idAnimateur = -1 ;
        $idEvenement = -1 ;
        $idLivres = [] ;

        foreach( $lignes as $ligne )
        {
            if( $ligne == "--------")
            {
                echo "Commentaire : " . $commentaire . "<br>" ;
                echo "Debut : " . $debut . "<br>" ;
                echo "Type : " . $typeEvenement . "<br>" ;
                echo "Titre : " . $titreEvenement . "<br>" ;
                echo "NumLieu : " . $numLieu . "<br>" ;

                // Insert un événement
                if( $typeEvenement != "" && $titreEvenement != "" && $numLieu != -1 )
                {
                    $idEvenement = insertEvenement( $db, $debut, $typeEvenement, $titreEvenement, $numLieu, $commentaire, $idAnimateur ) ;

                    foreach( $idLivres as $idLivre )
                    {
                        insertExposer( $db, $idEvenement, $idLivre ) ;
                    }
                }

                // Réinitialise les variables
                $commentaire = "" ;
                $debut = "" ;
                $typeEvenement = "" ;
                $titreEvenement = "" ;
                $numLieu = -1 ;
                $idAnimateur = -1 ;
                $idEvenement = -1 ;
                $idLivres = [] ;

                continue ;
            }

            $values = explode( "|", $ligne ) ;

            if( $values[0] == "D" )
            {
                $jour = $values[1] . " " ;
            }
            else if( $values[0] == "C" )
            {
                $commentaire .= $values[1] ;
            }
            else if( $values[0] == "T" )
            {
                $typetitre = explode( "-", $values[1] ) ;
                if( count($typetitre) > 1 )
                {
                    $typeEvenement = trim($typetitre[0]) ;
                    $titreEvenement = trim($typetitre[1]) ;
                }
            }
            else if( $values[0] == "H" )
            {
                traiteHeureLieuHall( $db, $values[1], $debut, $numLieu ) ;
                $debut = $jour . $debut ;
            }
            else if( $values[0] == "L" )
            {
                traiteLieuHall( $db, $values[1], $numLieu ) ;
            }
            else if( $values[0] == "E" )
            {
                $idLivre = traiteAuteurLivreEditeur( $db, $values[1] ) ;
                if( $idLivre != -1 )
                {
                    array_push( $idLivres, $idLivre ) ;
                }
            }
        }
    }
    catch( PDOException $erreur )
    {
        echo "Probleme d'acces à la BD " . $erreur->getMessage() ;
    }
}

echo '</pre>';

?>

<form action="index.php" method="POST">
    <button type="submit" name="mon_bouton" value="valider">Revenir au menu</button>
</form>