<?php
	/** 
    * Classe d'accès aux données de type singleton
    * qui utilise les services de la classe PDO
    */

   class Connexion{   	
	//Attribut statique
        private static PDO | null $connexion = null ;

        // Liste des alias de tables utilisée
        public static $tables = array(
            "stand" => "stand",
            "exposant" => "exposant",
            "exposer" => "exposer",
            "personne" => "personne",
            "hall" => "hall",
            "import" => "import",
            "ecrire" => "ecrire",
            "editeur" => "editeur",
            "evenement" => "evenement",
            "lieu" => "lieu",
            "livre" => "livre",
            "presenter" => "presenter",
            "specialite" => "specialite",
            "typelieu" => "typelieu",
            "typeevenement" => "typeevenement",
            "PersonneExposantExposer" => "PersonneExposantExposer",
            "PersonneExposantExposerLieu" => "PersonneExposantExposerLieu"
         ) ;

        /**
        * Méthode statique qui renvoie l'unique instance de Connexion
        **/
        public static function getInstance()
        {
            $serveur = 'mysql:host=localhost:3306;';
            $bdd = 'dbname=fdlc2026';   		
            $user = 'root' ; 
            $mdp = 'root' ;

            if(!self::$connexion){
                try {

                    self::$connexion = new PDO($serveur.$bdd, $user, $mdp); 
                    self::$connexion->query("SET CHARACTER SET utf-8");
                } catch (PDOException $e) {
                        echo " Error connexion: " . $serveur . " " . $bdd . " " . $e->getMessage() ;
                        throw new Exception("Erreur à  la connexion \n" . $e->getMessage());
                }
            }
            return self::$connexion;
        }
     }   
?>