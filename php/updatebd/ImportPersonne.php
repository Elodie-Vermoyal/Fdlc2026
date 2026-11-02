<?php

require_once "../Connexion.php" ;

require_once "Importation.php" ;

class ImportPersonne extends Importation
{
    public function __construct( string $nomTable, bool $afficheErreurBd = false )
    {
        parent::__construct( $nomTable, $afficheErreurBd ) ;
    }

    public function ajouteDonnees()
    {
        try
        {
            $bd = Connexion::getInstance() ;

            $this->afficheAjoutDebut() ;

            $this->resetNbInsert() ;

            $sql = "SELECT distinct `COL 1`,`COL 2` from " . Connexion::$tables["import"] ;

            $cursor = $bd->prepare( $sql ) ;
            $cursor->execute() ;

            $sqlId = "select max(id) as nid from " . $this->nomTable ;
            $cursorId = $bd->prepare( $sqlId ) ;
            $cursorId->execute() ;
            $id = $cursorId->fetchAll(PDO::FETCH_ASSOC)[0]["nid"] ;
            $id++ ;

            $sqlInsert = "INSERT INTO " . $this->nomTable . "(id, prenom, nom, specialite) values(:id, :prenom, :nom, 'auteur' )" ;
            $cursorInsert = $bd->prepare( $sqlInsert ) ;

            while( $row = $cursor->fetch(PDO::FETCH_ASSOC, PDO::FETCH_ORI_NEXT)) 
            {
                if( $row["COL 2"] != "")
                {
                    $cursorInsert->bindValue( ":id", $id++, PDO::PARAM_INT ) ;
                    $cursorInsert->bindValue( ":nom", $row["COL 2"], PDO::PARAM_STR ) ;
                    $cursorInsert->bindValue( ":prenom", $row["COL 1"], PDO::PARAM_STR ) ;

                    try
                    {
                        $cursorInsert->execute() ;
                        $this->incrementeInsertCompteur() ;
                    }
                    catch( PDOException $erreur )
                    {
                        $this->afficheErreurDb( $row["COL 1"] . " " . $row["COL 2"], $erreur ) ;
                    }
                }
            }
            $this->afficheAjoutFin() ;
        }
        catch( PDOException $erreur )
        {
            $this->afficheErreurConnexionDb( $erreur ) ;
        }
    }

    public function supprimeDonnees()
    {
        try
        {
            $bd = Connexion::getInstance() ;

            $this->afficheSuppressionDebut() ;

            $this->resetNbDelete() ;

            $sqlCherche = "SELECT * from " . Connexion::$tables["import"] . " where `COL 1` = :prenom and `COL 2` = :nom" ;
            $cursorCherche = $bd->prepare( $sqlCherche ) ;

            $sqlDelete = "DELETE FROM " . $this->nomTable . " WHERE nom = :nom and prenom = :prenom and specialite='auteur'" ;
            $cursorDelete = $bd->prepare( $sqlDelete ) ;

            $sql = "SELECT prenom, nom from " . $this->nomTable . " where specialite='auteur'" ;
            $cursor = $bd->prepare( $sql ) ;
            $cursor->execute() ;
            
            while( $row = $cursor->fetch(PDO::FETCH_ASSOC, PDO::FETCH_ORI_NEXT)) 
            {
                try
                {
                    $cursorCherche->bindValue( ":prenom", $row["prenom"] ) ;
                    $cursorCherche->bindValue( ":nom", $row["nom"] ) ;
                    $cursorCherche->execute() ;

                    if( !$cursorCherche->fetch(PDO::FETCH_ASSOC, PDO::FETCH_ORI_NEXT) )
                    {
                        // Supprime le stand
                        $cursorDelete->bindValue( ":prenom", $row["prenom"], PDO::PARAM_STR ) ;
                        $cursorDelete->bindValue( ":nom", $row["nom"], PDO::PARAM_STR ) ;
                        $cursorDelete->execute() ;
                        $this->incrementeDeleteCompteur() ;
                    }    
                }
                catch( PDOException $erreur )
                {
                    $this->afficheErreurDb( $row["nom"] . " " . $row["nom"], $erreur ) ;
                }
            }
            $this->afficheSuppressionFin() ;
        }
        catch( PDOException $erreur )
        {
            $this->afficheErreurConnexionDb( $erreur ) ;
        }
    }
}

?>