<?php

require_once "../Connexion.php" ;

require_once "Importation.php" ;

class ImportExposer extends Importation
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

            $sql = "SELECT `COL 1` as prenom, `COL 2` as nom, `COL 3` as exposant, `COL 5` as sam, `COL 6` as spm, `COL 7` as dam, `COL 8` as dpm from " . Connexion::$tables["import"] ;

            $cursor = $bd->prepare( $sql ) ;
            $cursor->execute() ;

            $sqlPersonne = "select id from " . Connexion::$tables["personne"] . " where prenom = :prenom and nom = :nom and specialite='auteur'";
            $cursorPersonne = $bd->prepare( $sqlPersonne ) ;

            $sqlExposant = "select id from " . Connexion::$tables["exposant"] . " where nom = :exposant";
            $cursorExposant = $bd->prepare( $sqlExposant ) ;

            $sqlInsert = "INSERT INTO " . $this->nomTable . "(idExposant, idPersonne, samedi_am, samedi_pm, dimanche_am, dimanche_pm) values(:idExposant, :idPersonne, :samedi_am, :samedi_pm, :dimanche_am, :dimanche_pm )" ;
            $cursorInsert = $bd->prepare( $sqlInsert ) ;

            while( $row = $cursor->fetch(PDO::FETCH_ASSOC, PDO::FETCH_ORI_NEXT)) 
            {
                $idPersonne = -1 ;
                try
                {
                    $cursorPersonne->bindValue( ":prenom", $row["prenom"], PDO::PARAM_STR ) ;
                    $cursorPersonne->bindValue( ":nom", $row["nom"], PDO::PARAM_STR ) ;
                    $cursorPersonne->execute() ;
                    $rowsPersonne = $cursorPersonne->fetchAll( PDO::FETCH_ASSOC ) ;
                    $idPersonne = $rowsPersonne[0]["id"] ; 
                }
                catch( PDOException $erreur )
                {
                    $this->afficheErreurDb( $row["prenom"] . " " . $row["nom"], $erreur ) ;
                }

                $exposants = explode( "|", $row["exposant"] ) ;
                for( $i=0 ; $i < count($exposants) ; $i++ )
                {
                    $samedi_am = 0 ;
                    $samedi_pm = 0 ;
                    $dimanche_am = 0 ;
                    $dimanche_pm = 0 ;

                    $idExposant = -1 ;
                    try
                    {
                        $cursorExposant->bindValue( ":exposant", $exposants[$i], PDO::PARAM_STR ) ;
                        $cursorExposant->execute() ;
                        $rowsExposant = $cursorExposant->fetchAll( PDO::FETCH_ASSOC ) ;
                        $idExposant = $rowsExposant[0]["id"] ; 
                    }
                    catch( PDOException $erreur )
                    {
                        $this->afficheErreurDb( $exposants[$i], $erreur ) ;
                    }

                    $cursorInsert->bindValue( ":idExposant", $idExposant, PDO::PARAM_INT ) ;
                    $cursorInsert->bindValue( ":idPersonne", $idPersonne, PDO::PARAM_INT ) ;

                    if( $row["sam"][0] == "X" ) $samedi_am = 1 ;
                    if( $row["spm"][0] == "X" ) $samedi_pm = 1 ;
                    if( $row["dam"][0] == "X" ) $dimanche_am = 1 ;
                    if( $row["dpm"][0] == "X" ) $dimanche_pm = 1 ;

                    $cursorInsert->bindValue( ":samedi_am", $samedi_am, PDO::PARAM_INT ) ;
                    $cursorInsert->bindValue( ":samedi_pm", $samedi_pm, PDO::PARAM_INT ) ;
                    $cursorInsert->bindValue( ":dimanche_am", $dimanche_am, PDO::PARAM_INT ) ;
                    $cursorInsert->bindValue( ":dimanche_pm", $dimanche_pm, PDO::PARAM_INT ) ;

                    try
                    {
                        $cursorInsert->execute() ;
                        $this->incrementeInsertCompteur() ;
                    }
                    catch( PDOException $erreur )
                    {
                        $this->afficheErreurDb( $idExposant . " " . $idExposant , $erreur ) ;
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

            $sqlCherche = "SELECT * from " . Connexion::$tables["import"] ;
            $sqlCherche .= " where `COL 1` = :prenom" ;
            $sqlCherche .= " and `COL 2` = :nom" ;
            $sqlCherche .= " and `COL 3` like :nomExposant" ;
            $sqlCherche .= " and `COL 5` = :samedi_am" ;
            $sqlCherche .= " and `COL 6` = :samedi_pm" ;
            $sqlCherche .= " and `COL 7` = :dimanche_am" ;
            $sqlCherche .= " and `COL 8` = :dimanche_pm" ;
            $cursorCherche = $bd->prepare( $sqlCherche ) ;

            $sqlDelete = "DELETE FROM " . $this->nomTable . " WHERE idExposant = :idExposant and idPersonne = :idPersonne" ;
            $cursorDelete = $bd->prepare( $sqlDelete ) ;

            $sql = "SELECT * from " . Connexion::$tables["PersonneExposantExposer"] . " where specialite = 'auteur'" ;
            $cursor = $bd->prepare( $sql ) ;
            $cursor->execute() ;
            
            while( $row = $cursor->fetch(PDO::FETCH_ASSOC, PDO::FETCH_ORI_NEXT)) 
            {
                $samedi_am = "X" ;
                $samedi_pm = "X" ;
                $dimanche_am = "X" ;
                $dimanche_pm = "X" ;

                try
                {
                    if( !$row["samedi_am"] ) $samedi_am = " " ;
                    if( !$row["samedi_pm"] ) $samedi_pm = " " ;
                    if( !$row["dimanche_am"] ) $dimanche_am = " " ;
                    if( !$row["dimanche_am"] ) $dimanche_pm = " " ;

                    $cursorCherche->bindValue( ":prenom", $row["prenom"], PDO::PARAM_STR ) ;
                    $cursorCherche->bindValue( ":nom", $row["nom"], PDO::PARAM_STR ) ;
                    $cursorCherche->bindValue( ":nomExposant", "%" . $row["nomExposant"] . "%", PDO::PARAM_STR ) ;
                    $cursorCherche->bindValue( ":samedi_am", $samedi_am, PDO::PARAM_STR ) ;
                    $cursorCherche->bindValue( ":samedi_pm", $samedi_pm, PDO::PARAM_STR ) ;
                    $cursorCherche->bindValue( ":dimanche_am", $dimanche_am, PDO::PARAM_STR ) ;
                    $cursorCherche->bindValue( ":dimanche_pm", $dimanche_pm, PDO::PARAM_STR ) ;
                    $cursorCherche->execute() ;

                    if( !$cursorCherche->fetch(PDO::FETCH_ASSOC, PDO::FETCH_ORI_NEXT) )
                    {
                        // Supprime le stand
                        $cursorDelete->bindValue( ":idPersonne", $row["idPersonne"], PDO::PARAM_INT ) ;
                        $cursorDelete->bindValue( ":idExposant", $row["idExposant"], PDO::PARAM_INT ) ;
                        $cursorDelete->execute() ;
                        $this->incrementeDeleteCompteur() ;
                    }    
                }
                catch( PDOException $erreur )
                {
                    $this->afficheErreurDb( "idExposant: " . $row["idExposant"] . " idPersonne: " . $row["idPersonne"], $erreur ) ;
                }
            }
            $this->afficheSuppressionFin() ;
        }
        catch( PDOException $erreur )
        {
            $this->afficheErreurConnexionDb( $erreur ) ;
        }
    }

    public function modifieDonnees()
    {
        /*
        try
        {
            $bd = Connexion::getInstance() ;

            $this->afficheModificationDebut() ;

            $this->resetNbUpdate() ;

            $sqlUpdate = "UPDATE " . $this->nomTable . " set numStand = :numStand WHERE nom = :nom" ;
            $cursorUpdate = $bd->prepare( $sqlUpdate ) ;

            $sqlCherche = "SELECT nom, numStand from " . $this->nomTable . " where nom = :nom and numStand = :numStand" ;
            $cursorCherche = $bd->prepare( $sqlCherche ) ;

            $sql = "SELECT `COL 3` as nom, `COL 4` as numStand from " . Connexion::$tables["import"] ;
            $cursor = $bd->prepare( $sql ) ;
            $cursor->execute() ;
            
            while( $row = $cursor->fetch(PDO::FETCH_ASSOC, PDO::FETCH_ORI_NEXT)) 
            {
                try
                {
                    $cursorCherche->bindValue( ":nom", $row["nom"], PDO::PARAM_STR ) ;
                    $cursorCherche->bindValue( ":numStand", $row["numStand"], PDO::PARAM_INT ) ;
                    $cursorCherche->execute() ;

                    if( !$rowCherche = $cursorCherche->fetch(PDO::FETCH_ASSOC, PDO::FETCH_ORI_NEXT) )
                    {
                        // Supprime le stand
                        $cursorUpdate->bindValue( ":nom", $row["nom"], PDO::PARAM_STR ) ;
                        $cursorUpdate->bindValue( ":numStand", $row["numStand"], PDO::PARAM_INT ) ;
                        $cursorUpdate->execute() ;
                        $this->incrementeUpdateCompteur() ;
                    }    
                }
                catch( PDOException $erreur )
                {
                    $this->afficheErreurDb( $row["nom"], $erreur ) ;
                }
            }
            $this->afficheModificationFin() ;
        }
        catch( PDOException $erreur )
        {
            $this->afficheErreurConnexionDb( $erreur ) ;
        }*/
    }

}

?>