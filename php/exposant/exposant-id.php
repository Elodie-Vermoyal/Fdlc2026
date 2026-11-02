
<?php

header("Access-Control-Allow-Origin: http://localhost:8101");
header("Content-Type: application/json; charset=UTF-8");

require_once "../Connexion.php";

try
{
    $bd = Connexion::getInstance();

    $id = filter_input(INPUT_GET, "id", FILTER_VALIDATE_INT);

    if ($id === null || $id === false || $id <= 0)
    {
        http_response_code(400);
        echo json_encode([]);
        exit;
    }

    $sql = "select id, nom, numLieu as numStand from "
         . Connexion::$tables["exposant"]
         . " where id = :id";

    $cursor = $bd->prepare($sql);
    $cursor->bindValue(":id", $id, PDO::PARAM_INT);
    $cursor->execute();

    $data = $cursor->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($data);
}
catch (PDOException $erreur)
{
    http_response_code(500);
    echo json_encode(["erreur" => "Problème d'accès à la base de données"]);
}
