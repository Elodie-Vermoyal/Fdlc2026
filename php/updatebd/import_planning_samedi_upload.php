


<?php

$titre = "" ;
$stitre = "" ;
$public = "" ;
$heures = [] ;
$lieux = [] ;
$halls = [] ;
$auteurs = [] ;
$titres = [] ;
$editeurs = [] ;
$commentaire = "" ;



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
        $sql = "select * from " . Connexion::$tables["personne"] . " where prenom = :prenom and nom = :nom " ;
        $cursor = $db->prepare( $sql ) ;
        $cursor->bindValue( ":prenom", $prenom ) ;
        $cursor->bindValue( ":nom", $nom ) ;
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

function traiteLigne( $db, $ligne )
{
    $jour = "2026-11-22 " ;

    $values = explode( ";", $ligne ) ;

    $debut = $jour . trim( $values[0] ) ;
    echo "Début : " . $debut . "<br>" ;

    $values = explode( ";", $ligne ) ;
    foreach( $values as $value )
    {
        //$r = preg_match("animé par", $value) ;
        $expressions = explode( "    ", $value ) ;
        foreach ($expressions as $expression )
        {
            $expression = trim( $expression ) ;
            if( $expression != "" )
            {
                $items = explode( " ", $expression ) ;
                if( count($items) > 1 )
                {
                    if( ($items[0] == "animé" || $items[0] == "Animé") && $items[1] == "par" )
                    {
                        $prenom = $items[2] ;
                        $nom = $items[3] ;
                        $personne = cherchePersonne( $db, $prenom, $nom ) ;
                        if( !$personne )
                        {
                            echo "Insert un animateur : " . $prenom . " " . $nom . "<br>" ;
                            insertPersonne( $db, $prenom, $nom, "animateur" ) ;
                        }
                        else
                        {                                       
                            echo "Animateur trouvée : " . $prenom . " " . $nom . "<br>" ;
                        }
                    }
                    else
                    {
                        $prenom = $items[0] ;
                        $nom = $items[1] ;
                        $personne = cherchePersonne( $db, $prenom, $nom ) ;
                        if( $personne )
                        {
                            echo "Auteur trouvée : " . $prenom . " " . $nom . "<br>" ;
                        }
                        else
                        {
                            $prenom = $items[1] ;
                            $nom = $items[2] ;
                            $personne = cherchePersonne( $db, $prenom, $nom ) ;
                            if( $personne )
                            {
                                echo "Auteur trouvée : " . $prenom . " " . $nom . "<br>" ;
                            }
                            else
                            {
                                if( $expression == "Grand entretien" )
                                {
                                    echo "Type d'événement : " . $expression . "<br>" ;
                                }
                                else
                                {
                                    $n = count($items) ;
                                    $prenom = $items[$n-2] ;
                                    $nom = $items[$n-1] ;
                                    $personne = cherchePersonne( $db, $prenom, $nom ) ;
                                    if( $personne )
                                    {
                                        echo "Auteur trouvée : " . $prenom . " " . $nom . "<br>" ;
                                        $str = "" ;
                                        for( $i=0 ; $i < $n-2 ; $i++ )
                                        {
                                            $str .= $items[$i] . " " ;
                                        }
                                        echo "Titre de livre trouvée : " . $str . "<br>" ;
                                    }
                                    else
                                    {
                                        echo "Titre de livre trouvée : " . $expression . "<br>" ;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        echo "<br><br>" ;
    }
    echo "<br><br><br>" ;
}

function traiteEvenement( $db, $ligne, $heure )
{
    $values = explode( ";", $ligne ) ;
    foreach( $values as $value )
    {
        //$r = preg_match("animé par", $value) ;
        $expressions = explode( "    ", $value ) ;
        foreach ($expressions as $expression )
        {
            $expression = trim( $expression ) ;
            if( $expression != "" )
            {
                $prenomNom = explode( " ", $expression ) ;
                if( count($prenomNom) > 1 )
                {
                    if( ($prenomNom[0] == "animé" || $prenomNom[0] == "Animé") && $prenomNom[1] == "par" )
                    {
                        $prenom = $prenomNom[2] ;
                        $nom = $prenomNom[3] ;
                        $personne = cherchePersonne( $db, $prenom, $nom ) ;
                        if( !$personne )
                        {
                            echo "Insert un animateur : " . $prenom . " " . $nom . "<br>" ;
                            insertPersonne( $db, $prenom, $nom, "animateur" ) ;
                        }
                        else
                        {                                       
                            echo "Animateur trouvée : " . $prenom . " " . $nom . "<br>" ;
                        }
                    }
                    else
                    {
                        $prenom = $prenomNom[0] ;
                        $nom = $prenomNom[1] ;
                        $personne = cherchePersonne( $db, $prenom, $nom ) ;
                        if( $personne )
                        {
                            echo "Auteur trouvée : " . $prenom . " " . $nom . "<br>" ;
                        }
                    }
                }
            }
        }

        echo "Expressions : " . $expressions[0] . "<br>" ;
    }
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


    foreach( $lignes as $ligne )
    {
        $ligneCount = 0 ;
        foreach( $lignes as $ligne )
        {
            $ligneCount++ ;
            if( $ligneCount == 4 )
            {
                $values = explode( ";", $ligne ) ;
                foreach( $values as $value )
                {
                    $lieu_hall = explode("    ", $value ) ;
                    $lieu = $lieu_hall[0] ;
                    $hall = substr( $value, -1 ) ;
                    if( $lieu != "" && $hall != "" )
                    {
                        array_push( $lieux, $lieu ) ;
                        array_push( $halls, $hall ) ;
                    }
                }
            }
            if( $ligneCount > 5 )
            {
                traiteLigne( $db, $ligne ) ;
            }
        }           
    }
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