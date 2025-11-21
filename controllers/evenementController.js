const Evenement = require('../models/Evenement');

exports.getAll = async (req, res) => {
  try {
    const evenements = await Evenement.findAll();

    res.json({
      success: true,
      count: evenements.length,
      evenements,
    });
  } catch (error) {
    console.error('Erreur getAll evenements:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des événements',
    });
  }
};

exports.getDisponibles = async (req, res) => {
  try {
    const evenements = await Evenement.findDisponibles();

    res.json({
      success: true,
      count: evenements.length,
      evenements,
    });
  } catch (error) {
    console.error('Erreur getDisponibles:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des événements disponibles',
    });
  }
};

exports.getById = async (req, res) => {
  try {
    const evenement = await Evenement.findById(req.params.id);

    if (!evenement) {
      return res.status(404).json({
        success: false,
        message: 'Événement non trouvé',
      });
    }

    res.json({
      success: true,
      evenement,
    });
  } catch (error) {
    console.error('Erreur getById evenement:', error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération de l'événement",
    });
  }
};

exports.create = async (req, res) => {
  try {
    // Convertir la date ISO en format MySQL (YYYY-MM-DD HH:MM:SS)
    const date_evenement = req.body.date_evenement
      ? new Date(req.body.date_evenement)
          .toISOString()
          .slice(0, 19)
          .replace('T', ' ')
      : null;

    const data = {
      ...req.body,
      date_evenement,
      created_by: req.user.id,
    };

    const evenementId = await Evenement.create(data);
    const evenement = await Evenement.findById(evenementId);

    res.status(201).json({
      success: true,
      message: 'Événement créé avec succès',
      evenement,
    });
  } catch (error) {
    console.error('Erreur create evenement:', error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la création de l'événement",
    });
  }
};

exports.update = async (req, res) => {
  try {
    // Convertir la date ISO en format MySQL si présente
    const data = { ...req.body };
    if (data.date_evenement) {
      data.date_evenement = new Date(data.date_evenement)
        .toISOString()
        .slice(0, 19)
        .replace('T', ' ');
    }

    const updated = await Evenement.update(req.params.id, data);

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Événement non trouvé',
      });
    }

    const evenement = await Evenement.findById(req.params.id);

    res.json({
      success: true,
      message: 'Événement modifié avec succès',
      evenement,
    });
  } catch (error) {
    console.error('Erreur update evenement:', error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la modification de l'événement",
    });
  }
};

exports.updateStatut = async (req, res) => {
  try {
    const { statut } = req.body;

    if (!['planifie', 'en_cours', 'termine', 'annule'].includes(statut)) {
      return res.status(400).json({
        success: false,
        message: 'Statut invalide',
      });
    }

    const updated = await Evenement.updateStatut(req.params.id, statut);

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Événement non trouvé',
      });
    }

    const evenement = await Evenement.findById(req.params.id);

    res.json({
      success: true,
      message: 'Statut modifié avec succès',
      evenement,
    });
  } catch (error) {
    console.error('Erreur updateStatut:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la modification du statut',
    });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await Evenement.delete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Événement non trouvé',
      });
    }

    res.json({
      success: true,
      message: 'Événement supprimé avec succès',
    });
  } catch (error) {
    console.error('Erreur delete evenement:', error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la suppression de l'événement",
    });
  }
};
