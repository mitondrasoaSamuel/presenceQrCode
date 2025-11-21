const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const tarankiLevyController = require('../controllers/tarankiLevyController');
const { authMiddleware } = require('../middlewares/auth');
const { validate } = require('../middlewares/validation');

router.use(authMiddleware);

router.get('/', tarankiLevyController.getAll);

router.get('/:id', tarankiLevyController.getById);

router.get('/search/:matricule', tarankiLevyController.getByMatricule);

router.get('/pasteur/:pasteur_id', tarankiLevyController.getByPasteurId);

router.get('/:matricule/qrcode', tarankiLevyController.generateQRCode);

router.post(
  '/',
  [
    body('matricule_tl').notEmpty().withMessage('Le matricule TL est requis'),
    body('nom').notEmpty().withMessage('Le nom est requis'),
    body('prenom').notEmpty().withMessage('Le prénom est requis'),
    body('genre')
      .optional()
      .isIn(['LEHILAHY', 'VEHIVAVY', 'NON_SPECIFIE'])
      .withMessage('Genre invalide'),
    body('matricule_pst').optional(),
    validate,
  ],
  tarankiLevyController.create
);

router.put(
  '/:id',
  [
    body('matricule_tl').optional().notEmpty(),
    body('nom').optional().notEmpty(),
    body('prenom').optional().notEmpty(),
    body('genre')
      .optional()
      .isIn(['LEHILAHY', 'VEHIVAVY', 'NON_SPECIFIE'])
      .withMessage('Genre invalide'),
    validate,
  ],
  tarankiLevyController.update
);

router.delete('/:id', tarankiLevyController.delete);

module.exports = router;
