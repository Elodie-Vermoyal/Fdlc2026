-- Insertions d'éditeurs
INSERT INTO `editeur` (`id`, `nom`) VALUES
(1, 'Éditions du Tourneciel'),
(2, 'La Nuée Bleue'),
(3, 'Espace Culturel E. Leclerc'),
(4, 'L''Esprit BD'),
(5, 'I.D. l''Édition'),
(6, 'Comité d''Histoire Régionale'),
(7, 'Association des Éditeurs belges'),
(8, 'La Capsule'),
(9, 'Librairie Pleine Page'),
(10, 'Auxilivre'),
(11, 'Librairie RUC'),
(12, 'Médiapop'),
(13, 'Reber Éditions'),
(14, 'Éditions Père Fouettard'),
(15, 'Éditions Albin Michel')
ON DUPLICATE KEY UPDATE `nom` = VALUES(`nom`);

-- Insertions de livres
INSERT INTO `livre` (`id`, `titre`, `resume`, `idEditeur`, `genre`) VALUES
(1, 'L''Ombre du vent d''Alsace', 'Une intrigue policière palpitante au cœur de Strasbourg.', 2, 'policier'),
(2, 'Les Chemins de la liberté', 'Récit historique sur la libération de Colmar et de la région.', 6, 'histoire'),
(3, 'Chroniques Galactiques', 'Une aventure de science-fiction spatiale époustouflante.', 8, 'SF'),
(4, 'Saveurs d''Alsace et du Terroir', 'Recettes traditionnelles et secrètes d''Alsace revisitées.', 5, 'cuisine'),
(5, 'Le Secret des Cathédrales', 'Enquête criminelle et mystères architecturaux millénaires.', 11, 'policier'),
(6, 'Légendes et Mythes Alsatiques', 'Guide complet des contes et légendes d''Alsace d''hier et d''aujourd''hui.', 2, 'alsatique'),
(7, 'Les Bulles de Colmar', 'Bande dessinée humoristique et festive autour du salon.', 4, 'BD'),
(8, 'Dans ma montagne', 'Conte illustré pour la jeunesse au sommet des Vosges sauvages.', 14, 'roman'),
(9, 'Le Pays du grand ciel', 'Un voyage initiatique et poétique à travers le grand nord.', 14, 'roman'),
(10, 'Les Murmures de la Forêt Noire', 'Roman noir envoûtant dans les brumes rhénanes.', 9, 'roman'),
(11, 'Recettes Gourmandes de Fête', 'Plats conviviaux et douceurs raffinées pour les tables de fête.', 1, 'cuisine'),
(12, 'L''Énigme du Manuscrit Médiéval', 'Recherches historiques et découvertes surprenantes à Colmar.', 12, 'histoire'),
(13, 'L''Hiver des Sentinelles', 'Épopée post-apocalyptique dans les forêts enneigées.', 8, 'SF'),
(14, 'Reflets d''un Destin', 'Roman émouvant d''une jeunesse en quête d''identité.', 3, 'roman'),
(15, 'Promenade au bord de l''Ill', 'Découverte poétique de Colmar et de ses cours d''eau.', 5, 'alsatique')
ON DUPLICATE KEY UPDATE `titre` = VALUES(`titre`), `resume` = VALUES(`resume`), `idEditeur` = VALUES(`idEditeur`), `genre` = VALUES(`genre`);

-- Associations livre <-> auteur
INSERT INTO `ecrire` (`idPersonne`, `idLivre`) VALUES
(3, 1),
(7, 2),
(10, 3),
(6, 4),
(14, 5),
(16, 6),
(5, 7),
(316, 8),
(313, 9),
(11, 10),
(2, 11),
(15, 12),
(10, 13),
(4, 14),
(6, 15)
ON DUPLICATE KEY UPDATE `idLivre` = VALUES(`idLivre`);
