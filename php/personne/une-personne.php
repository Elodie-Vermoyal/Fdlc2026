<?php

// Autoriser l'application Ionic locale à accéder aux données
header("Access-Control-Allow-Origin: http://localhost:8100");
header("Content-Type: application/json; charset=utf-8");

// Connexion à la base de données
require_once "../Connexion.php";

try
{
    // Récupérer l'identifiant envoyé dans l'URL
    $id = filter_input(INPUT_GET, "id", FILTER_VALIDATE_INT);

    if ($id === false || $id === null || $id <= 0)
    {
        http_response_code(400);
        echo json_encode(["erreur" => "Identifiant invalide"]);
        exit;
    }

    // Connexion à MySQL
    $bd = Connexion::getInstance();

    // Rechercher la personne correspondant à l'identifiant
    $sql = "SELECT id, civilite, prenom, nom,
               biographie, specialite, photo, type
        FROM personne
        WHERE id = :id";

    $cursor = $bd->prepare($sql);
    $cursor->bindValue(":id", $id, PDO::PARAM_INT);
    $cursor->execute();

    // Récupérer une seule personne
    $personne = $cursor->fetch(PDO::FETCH_ASSOC);

    if ($personne === false)
    {
        http_response_code(404);
        echo json_encode(["erreur" => "Personne introuvable"]);
        exit;
    }

    // Envoyer les informations au format JSON
    echo json_encode($personne);
}
catch (PDOException $erreur)
{
    http_response_code(500);
    echo json_encode(["erreur" => "Erreur d'accès à la base de données"]);
}

?>
