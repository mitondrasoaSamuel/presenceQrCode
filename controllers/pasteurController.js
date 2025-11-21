const Pasteur = require('../models/Pasteur');
const QRCode = require('qrcode');

exports.getAll = async (req, res) => {
  try {
    const { limit = 100, offset = 0, search } = req.query;

    let pasteurs;
    if (search) {
      pasteurs = await Pasteur.search(search);
    } else {
      pasteurs = await Pasteur.findAll(parseInt(limit), parseInt(offset));
    }

    const total = await Pasteur.count();

    res.json({
      success: true,
      total,
      count: pasteurs.length,
      pasteurs
    });
  } catch (error) {
    console.error('Erreur getAll pasteurs:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des pasteurs'
    });
  }
};

exports.getById = async (req, res) => {
  try {
    const pasteur = await Pasteur.findById(req.params.id);

    if (!pasteur) {
      return res.status(404).json({
        success: false,
        message: 'Pasteur non trouvé'
      });
    }

    res.json({
      success: true,
      pasteur
    });
  } catch (error) {
    console.error('Erreur getById pasteur:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du pasteur'
    });
  }
};

exports.getByMatricule = async (req, res) => {
  try {
    const pasteur = await Pasteur.findByMatricule(req.params.matricule);

    if (!pasteur) {
      return res.status(404).json({
        success: false,
        message: 'Pasteur non trouvé avec ce matricule'
      });
    }

    res.json({
      success: true,
      pasteur
    });
  } catch (error) {
    console.error('Erreur getByMatricule:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du pasteur'
    });
  }
};

exports.create = async (req, res) => {
  try {
    const pasteurId = await Pasteur.create(req.body);
    const pasteur = await Pasteur.findById(pasteurId);

    res.status(201).json({
      success: true,
      message: 'Pasteur créé avec succès',
      pasteur
    });
  } catch (error) {
    console.error('Erreur create pasteur:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        success: false,
        message: 'Matricule ou CIN déjà existant'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création du pasteur'
    });
  }
};

exports.update = async (req, res) => {
  try {
    const updated = await Pasteur.update(req.params.id, req.body);

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Pasteur non trouvé'
      });
    }

    const pasteur = await Pasteur.findById(req.params.id);

    res.json({
      success: true,
      message: 'Pasteur modifié avec succès',
      pasteur
    });
  } catch (error) {
    console.error('Erreur update pasteur:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la modification du pasteur'
    });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await Pasteur.delete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Pasteur non trouvé'
      });
    }

    res.json({
      success: true,
      message: 'Pasteur supprimé avec succès'
    });
  } catch (error) {
    console.error('Erreur delete pasteur:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression du pasteur'
    });
  }
};

exports.generateQRCode = async (req, res) => {
  try {
    const pasteur = await Pasteur.findByMatricule(req.params.matricule);

    if (!pasteur) {
      return res.status(404).json({
        success: false,
        message: 'Pasteur non trouvé'
      });
    }

    const qrData = {
      matricule: pasteur.matricule,
      type: 'pasteur'
    };

    const qrCodeImage = await QRCode.toDataURL(JSON.stringify(qrData));

    res.json({
      success: true,
      pasteur: {
        matricule: pasteur.matricule,
        nom: pasteur.nom,
        prenom: pasteur.prenom
      },
      qrcode: qrCodeImage
    });
  } catch (error) {
    console.error('Erreur generateQRCode:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la génération du QR code'
    });
  }
};

