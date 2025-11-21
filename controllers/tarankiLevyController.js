const TarankiLevy = require('../models/TarankiLevy');
const Pasteur = require('../models/Pasteur');
const QRCode = require('qrcode');

exports.getAll = async (req, res) => {
  try {
    const { limit = 100, offset = 0, search = '' } = req.query;
    const taranki = await TarankiLevy.findAll(limit, offset, search);
    const total = await TarankiLevy.count(search);

    res.json({
      success: true,
      taranki_levy: taranki,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset),
      },
    });
  } catch (error) {
    console.error('Erreur getAll taranki_levy:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des Tarank\'i Levy',
    });
  }
};

exports.getById = async (req, res) => {
  try {
    const tl = await TarankiLevy.findById(req.params.id);

    if (!tl) {
      return res.status(404).json({
        success: false,
        message: 'Tarank\'i Levy non trouvé',
      });
    }

    res.json({
      success: true,
      taranki_levy: tl,
    });
  } catch (error) {
    console.error('Erreur getById taranki_levy:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération',
    });
  }
};

exports.getByMatricule = async (req, res) => {
  try {
    const tl = await TarankiLevy.findByMatricule(req.params.matricule);

    if (!tl) {
      return res.status(404).json({
        success: false,
        message: 'Tarank\'i Levy non trouvé',
      });
    }

    res.json({
      success: true,
      taranki_levy: tl,
    });
  } catch (error) {
    console.error('Erreur getByMatricule taranki_levy:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération',
    });
  }
};

exports.create = async (req, res) => {
  try {
    const { matricule_pst, ...data } = req.body;

    if (matricule_pst) {
      const pasteur = await Pasteur.findByMatricule(matricule_pst);
      if (pasteur) {
        data.pasteur_id = pasteur.id;
        data.matricule_pst = matricule_pst;
      } else {
        return res.status(404).json({
          success: false,
          message: `Pasteur avec matricule ${matricule_pst} non trouvé`,
        });
      }
    }

    const tlId = await TarankiLevy.create(data);
    const tl = await TarankiLevy.findById(tlId);

    res.status(201).json({
      success: true,
      message: 'Tarank\'i Levy créé avec succès',
      taranki_levy: tl,
    });
  } catch (error) {
    console.error('Erreur create taranki_levy:', error);

    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        success: false,
        message: 'Ce matricule TL existe déjà',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création',
    });
  }
};

exports.update = async (req, res) => {
  try {
    const { matricule_pst, ...data } = req.body;

    if (matricule_pst) {
      const pasteur = await Pasteur.findByMatricule(matricule_pst);
      if (pasteur) {
        data.pasteur_id = pasteur.id;
        data.matricule_pst = matricule_pst;
      } else {
        return res.status(404).json({
          success: false,
          message: `Pasteur avec matricule ${matricule_pst} non trouvé`,
        });
      }
    }

    const updated = await TarankiLevy.update(req.params.id, data);

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Tarank\'i Levy non trouvé',
      });
    }

    const tl = await TarankiLevy.findById(req.params.id);

    res.json({
      success: true,
      message: 'Tarank\'i Levy modifié avec succès',
      taranki_levy: tl,
    });
  } catch (error) {
    console.error('Erreur update taranki_levy:', error);

    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        success: false,
        message: 'Ce matricule TL existe déjà',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erreur lors de la modification',
    });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await TarankiLevy.delete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Tarank\'i Levy non trouvé',
      });
    }

    res.json({
      success: true,
      message: 'Tarank\'i Levy supprimé avec succès',
    });
  } catch (error) {
    console.error('Erreur delete taranki_levy:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression',
    });
  }
};

exports.getByPasteurId = async (req, res) => {
  try {
    const taranki = await TarankiLevy.findByPasteurId(req.params.pasteur_id);

    res.json({
      success: true,
      taranki_levy: taranki,
      count: taranki.length,
    });
  } catch (error) {
    console.error('Erreur getByPasteurId:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération',
    });
  }
};

exports.generateQRCode = async (req, res) => {
  try {
    const { matricule } = req.params;

    const tl = await TarankiLevy.findByMatricule(matricule);
    if (!tl) {
      return res.status(404).json({
        success: false,
        message: 'Tarank\'i Levy non trouvé',
      });
    }

    const qrCodeData = await QRCode.toDataURL(matricule, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    });

    res.json({
      success: true,
      qrCode: qrCodeData,
      taranki_levy: {
        id: tl.id,
        matricule_tl: tl.matricule_tl,
        nom: tl.nom,
        prenom: tl.prenom,
      },
    });
  } catch (error) {
    console.error('Erreur generateQRCode:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la génération du QR code',
    });
  }
};
