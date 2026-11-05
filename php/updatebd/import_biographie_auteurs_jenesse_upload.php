

<?php

require_once( "../Connexion.php" ) ;

$separateur = " - " ;

echo '<pre>';
if (is_uploaded_file($_FILES['userfile']['tmp_name'])) 
{
  echo "File ". $_FILES['userfile']['name'] ." téléchargé avec succès.\n";

  //readfile($_FILES['userfile']['tmp_name']);
  $lignes = file( $_FILES['userfile']['tmp_name'] ) ;

  try
  {
    $db = Connexion::getInstance() ;

    $nbupdate = 0 ;
    $nblignes = 0 ;

    try
    {
      // Cherche les auteurs concernés par la mise à jour
      $sql = "select id, nom, prenom from " . Connexion::$tables["personne"] 
      . " where specialite='auteur' and concat( prenom, ' ', upper(nom)) = :nomprenom" ;
      $cursor = $db->prepare( $sql ) ;

      // Mise à jour de la biographie
      $sqlUpdate = "update " . Connexion::$tables["personne"] . " set biographie = :biographie where id=:id" ;
      $cursorUpdate = $db->prepare( $sqlUpdate ) ;

      foreach( $lignes as $ligne )
      {
        $values = explode( $separateur, $ligne ) ;
        if( count($values) > 1 && $values[0] != "''" )
        {
          $nblignes++ ;
          $cursor->bindValue( ":nomprenom", $values[0] ) ;
          $cursor->execute() ;
          $row = $cursor->fetch() ;
          
          if( $row )
          {
            $cursorUpdate->bindValue( ":biographie", $values[1] ) ;
            $cursorUpdate->bindValue( ":id", $row["id"] ) ;
            $cursorUpdate->execute() ;
            $nbupdate++ ;
          }
          else
          {
            echo "<br>Auteur " . $values[0] . " non trouvé dans la table personne<br>" ; 
          }
        }
      }
      echo $nbupdate . " lignes modifiées dans la table " . Connexion::$tables["personne"] . "<br>";
    }
    catch( PDOException $error )
    {
      echo "Erreur à la ligne n° " . $nblignes . " " . $error ;
    }
  }
  catch( PDOException $error )
  {
    echo "Erreur: " . $error ;
  }
} 
else 
{
   echo "Attaque possible par téléchargement de fichier : ";
   echo "Nom du fichier : '". $_FILES['userfile']['tmp_name'] . "'.";
}

/*
//if (move_uploaded_file($_FILES['userfile']['tmp_name'], $uploadfile)) 
if (move_uploaded_file("/tmp/titi.txt", $uploadfile)) 
{
    echo "Le fichier est valide, et a été téléchargé
           avec succès. Voici plus d'informations :\n";
} 
else 
{
    echo "Attaque potentielle par téléchargement de fichiers.
          Voici plus d'informations :\n";
}

echo 'Voici quelques informations de débogage :';
print_r($_FILES);
*/

echo '</pre>';

?>

<form action="index.php" method="POST">
    <button type="submit" name="mon_bouton" value="valider">Revenir au menu</button>
</form>
