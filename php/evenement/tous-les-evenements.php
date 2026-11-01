<?php
/**
 * GET /php/evenement/tous-les-evenements.php
 * Renvoie tous les événements au format JSON (tableau, y compris si vide).
 * Colonnes compatibles avec le modèle Evenement : id, titre, type,
 * debut, fin, commentaire, idLieu, idAnimateur, lieu, animateur.
 */
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    header('Allow: GET');
    http_response_code(405);
    echo json_encode(['erreur' => 'Méthode non autorisée'], JSON_UNESCAPED_UNICODE);
    exit;
}

// Le projet utilise Connexion.php après configuration du serveur.
// Dans le ZIP master, seul Connexion_local.php est présent.
$fichierConnexion = __DIR__ . '/../Connexion.php';
if (!is_file($fichierConnexion)) {
    $fichierConnexion = __DIR__ . '/../Connexion_local.php';
}
require_once $fichierConnexion;

try {
    $bd = Connexion::getInstance();
    $bd->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // SQL basé sur les noms réels de colonnes de fdlc.sql (pas sur une vue
    // encore attribuée à un autre membre du groupe).
    $sql = 'SELECT e.id, e.titre, e.stitre, e.typeevenement AS type,
                   e.typeevenement, e.public, e.debut, e.fin,
                   e.commentaire, e.numLieu AS idLieu, e.numLieu,
                   e.idAnimateur, l.nom AS lieu,
                   TRIM(CONCAT_WS(" ", p.prenom, p.nom)) AS animateur
            FROM evenement AS e
            LEFT JOIN lieu AS l ON l.num = e.numLieu
            LEFT JOIN personne AS p ON p.id = e.idAnimateur
            ORDER BY e.debut ASC, e.titre ASC, e.id ASC';

    $requete = $bd->prepare($sql);
    $requete->execute();
    echo json_encode($requete->fetchAll(PDO::FETCH_ASSOC), JSON_UNESCAPED_UNICODE | JSON_INVALID_UTF8_SUBSTITUTE);
} catch (Throwable $erreur) {
    // Ne pas divulguer les identifiants SQL ni les détails du serveur aux utilisateurs.
    error_log('tous-les-evenements.php : ' . $erreur->getMessage());
    http_response_code(500);
    echo json_encode(['erreur' => 'Impossible de charger les événements'], JSON_UNESCAPED_UNICODE);
}
