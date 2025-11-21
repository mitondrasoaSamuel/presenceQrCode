const Presence = require('../models/Presence');
const Pasteur = require('../models/Pasteur');
const TarankiLevy = require('../models/TarankiLevy');
const Evenement = require('../models/Evenement');

exports.scanQRCodePresence = async (req, res) => {
  try {
    const { evenement_id } = req.params;
    const { matricule_scanne } = req.body;

    console.log('🔍 Scan QR - Événement ID:', evenement_id);
    console.log('🔍 Scan QR - Matricule:', matricule_scanne);
    console.log('🔍 Scan QR - Body complet:', req.body);

    if (!matricule_scanne || matricule_scanne.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Le matricule est requis'
      });
    }

    const evenement = await Evenement.findById(evenement_id);
    if (!evenement) {
      return res.status(404).json({
        success: false,
        message: 'Événement non trouvé'
      });
    }

    if (evenement.statut === 'termine' || evenement.statut === 'annule') {
      return res.status(400).json({
        success: false,
        message: `Impossible de scanner : événement ${evenement.statut}`
      });
    }

    let personne;
    let type_personne;
    let pasteur_id = null;
    let taranki_levy_id = null;

    const matricule_str = String(matricule_scanne);
    if (matricule_str.startsWith('4')) {
      personne = await TarankiLevy.findByMatricule(matricule_scanne);
      type_personne = 'taranki_levy';
      if (personne) {
        taranki_levy_id = personne.id;
      }
    } else {
      personne = await Pasteur.findByMatricule(matricule_scanne);
      type_personne = 'pasteur';
      if (personne) {
        pasteur_id = personne.id;
      }
    }

    if (!personne) {
      return res.status(404).json({
        success: false,
        message: `${type_personne === 'taranki_levy' ? 'Tarank\'i Levy' : 'Pasteur'} non trouvé avec ce matricule`,
        matricule: matricule_scanne
      });
    }

    const dejaPresent = await Presence.checkIfPresent(pasteur_id, taranki_levy_id, evenement_id, type_personne);
    if (dejaPresent) {
      return res.status(409).json({
        success: false,
        message: 'Présence déjà enregistrée',
        personne: {
          type: type_personne,
          matricule: matricule_scanne,
          nom: personne.nom,
          prenom: personne.prenom,
          photo: personne.photo_url || null,
          lieu_affectation: personne.lieu_affectation || personne.pasteur_lieu || null
        },
        heure_arrivee: dejaPresent.heure_arrivee
      });
    }

    const now = new Date();
    const presence = await Presence.create({
      pasteur_id,
      taranki_levy_id,
      type_personne,
      evenement_id: evenement_id,
      matricule_scanne: matricule_scanne,
      date_presence: now,
      heure_arrivee: now.toTimeString().split(' ')[0],
      enregistre_par: req.user.id,
      methode_enregistrement: 'qr_scan'
    });

    res.status(201).json({
      success: true,
      message: 'Présence enregistrée avec succès',
      presence: {
        id: presence.id,
        heure_arrivee: presence.heure_arrivee,
        date_presence: presence.date_presence,
        type_personne
      },
      personne: {
        id: personne.id,
        matricule: matricule_scanne,
        nom: personne.nom,
        prenom: personne.prenom,
        type: type_personne,
        photo: personne.photo_url || null,
        lieu_affectation: personne.lieu_affectation || personne.pasteur_lieu || null,
        telephone: personne.telephone || personne.num_tel || null
      },
      evenement: {
        id: evenement.id,
        titre: evenement.titre,
        lieu: evenement.lieu,
        date_evenement: evenement.date_evenement
      }
    });
  } catch (error) {
    console.error('Erreur scanQRCodePresence:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'enregistrement de la présence'
    });
  }
};

exports.addManualPresence = async (req, res) => {
  try {
    const { evenement_id } = req.params;
    const { pasteur_id } = req.body;

    const evenement = await Evenement.findById(evenement_id);
    if (!evenement) {
      return res.status(404).json({
        success: false,
        message: 'Événement non trouvé'
      });
    }

    const pasteur = await Pasteur.findById(pasteur_id);
    if (!pasteur) {
      return res.status(404).json({
        success: false,
        message: 'Pasteur non trouvé'
      });
    }

    const dejaPresent = await Presence.checkIfPresent(pasteur_id, evenement_id);
    if (dejaPresent) {
      return res.status(409).json({
        success: false,
        message: 'Présence déjà enregistrée'
      });
    }

    const now = new Date();
    const presence = await Presence.create({
      pasteur_id: pasteur_id,
      evenement_id: evenement_id,
      matricule_scanne: pasteur.matricule,
      date_presence: now,
      heure_arrivee: now.toTimeString().split(' ')[0],
      enregistre_par: req.user.id,
      methode_enregistrement: 'manuel'
    });

    res.status(201).json({
      success: true,
      message: 'Présence enregistrée manuellement',
      presence
    });
  } catch (error) {
    console.error('Erreur addManualPresence:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'enregistrement manuel'
    });
  }
};

exports.getPresencesByEvent = async (req, res) => {
  try {
    const presences = await Presence.getByEvent(req.params.id);

    res.json({
      success: true,
      count: presences.length,
      presences
    });
  } catch (error) {
    console.error('Erreur getPresencesByEvent:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des présences'
    });
  }
};

exports.getEventStats = async (req, res) => {
  try {
    const evenement = await Evenement.findById(req.params.id);
    if (!evenement) {
      return res.status(404).json({
        success: false,
        message: 'Événement non trouvé'
      });
    }

    const stats = await Presence.getStats(req.params.id);

    res.json({
      success: true,
      evenement: {
        id: evenement.id,
        titre: evenement.titre,
        lieu: evenement.lieu,
        date_evenement: evenement.date_evenement
      },
      stats
    });
  } catch (error) {
    console.error('Erreur getEventStats:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques'
    });
  }
};

exports.getPasteurHistory = async (req, res) => {
  try {
    const presences = await Presence.getByPasteur(req.params.id);

    res.json({
      success: true,
      count: presences.length,
      presences
    });
  } catch (error) {
    console.error('Erreur getPasteurHistory:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de l\'historique'
    });
  }
};

exports.getAbsents = async (req, res) => {
  try {
    const absents = await Presence.getAbsents(req.params.id);

    res.json({
      success: true,
      count: absents.length,
      absents
    });
  } catch (error) {
    console.error('Erreur getAbsents:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des absents'
    });
  }
};

exports.getAll = async (req, res) => {
  try {
    const presences = await Presence.getAll();
    res.json({
      success: true,
      presences
    });
  } catch (error) {
    console.error('Erreur getAll presences:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des présences'
    });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await Presence.delete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Présence non trouvée'
      });
    }

    res.json({
      success: true,
      message: 'Présence supprimée avec succès'
    });
  } catch (error) {
    console.error('Erreur delete presence:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de la présence'
    });
  }
};

