create or replace view LivreEditeurPersonneExposant as
select 
    l.id as id,
    l.titre as titre,
    l.resume as resume,
    l.genre as genre,
    e.id as idEditeur,
    e.nom as editeur,
    p.id as idPersonne,
    p.nom as nom,
    p.prenom as prenom,
    p.civilite as civilite,
    ex.id as idExposant,
    ex.nom as nomExposant,
    ev.id as idEvenement,
    ev.titre as titreEvenement,
    ev.debut as debut,
    ev.type as typeEvenement
from livre as l
    left join editeur as e on l.idEditeur = e.id
    left join ecrire as ec on l.id = ec.idLivre
    left join personne as p on ec.idPersonne = p.id
    left join exposer as exp on p.id = exp.idPersonne
    left join exposant as ex on exp.idExposant = ex.id
    left join presenter as pr on l.id = pr.idLivre
    left join evenement as ev on pr.idEvenement = ev.id;
