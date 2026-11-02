
create or replace view fdlc_PersonneExposantExposer as
select 
    ser.idPersonne,
    au.prenom,
    au.nom,
    au.specialite,
    ser.idExposant,
    ex.nom as nomExposant,
    ser.samedi_am,
    ser.samedi_pm,
    ser.dimanche_am,
    ser.dimanche_pm
from fdlc_exposer as ser 
    inner join fdlc_personne as au on ser.idPersonne = au.id
    inner join fdlc_exposant as ex on ser.idExposant = ex.id

create or replace view PersonneExposantExposer as
select 
    ser.idPersonne,
    au.prenom,
    au.nom,
    au.specialite,
    ser.idExposant,
    ex.nom as nomExposant,
    ser.samedi_am,
    ser.samedi_pm,
    ser.dimanche_am,
    ser.dimanche_pm
from exposer as ser 
    inner join personne as au on ser.idPersonne = au.id
    inner join exposant as ex on ser.idExposant = ex.id
