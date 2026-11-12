CREATE OR REPLACE VIEW vue_evenement AS
SELECT 
    id,
    typeevenement,
    titre,
    stitre,
    public,
    commentaire,
    debut,
    fin,
    idAnimateur,
    numLieu,
    type,
    CASE 
        WHEN debut IS NULL THEN 'Tout le temps'
        WHEN DATE(debut) = '2026-11-20' THEN 'Vendredi'
        WHEN DATE(debut) = '2026-11-21' THEN 'Samedi'
        WHEN DATE(debut) = '2026-11-22' THEN 'Dimanche'
        ELSE 'Autre'
    END AS jour
FROM evenement;