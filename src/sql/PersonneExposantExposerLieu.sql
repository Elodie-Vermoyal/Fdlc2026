

create or replace view fdlc_PersonneExposantExposerLieu as
select 
    ser.idPersonne,
    p.prenom,
    p.nom,
    p.specialite,
    ser.idExposant,
    ex.nom as nomExposant,
    ser.samedi_am,
    ser.samedi_pm,
    ser.dimanche_am,
    ser.dimanche_pm,
    ex.numLieu,
    l.nom as nomLieu
from fdlc_exposer as ser 
    inner join fdlc_personne as p on ser.idPersonne = p.id
    inner join fdlc_exposant as ex on ser.idExposant = ex.id
    inner join fdlc_lieu as l on ex.numLieu = l.num ;
    
create or replace view PersonneExposantExposerLieu as
select 
    ser.idPersonne,
    p.prenom,
    p.nom,
    p.specialite,
    ser.idExposant,
    ex.nom as nomExposant,
    ser.samedi_am,
    ser.samedi_pm,
    ser.dimanche_am,
    ser.dimanche_pm,
    ex.numLieu,
    l.nom as nomLieu
from exposer as ser 
    inner join personne as p on ser.idPersonne = p.id
    inner join exposant as ex on ser.idExposant = ex.id
    inner join lieu as l on ex.numLieu = l.num ;
