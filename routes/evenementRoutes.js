const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const evenementController = require('../controllers/evenementController');
const { authMiddleware } = require('../middlewares/auth');
const { validate } = require('../middlewares/validation');

router.use(authMiddleware);

router.get('/', evenementController.getAll);

router.get('/disponibles', evenementController.getDisponibles);

router.get('/:id', evenementController.getById);

router.post(
  '/',
  [
    body('titre').notEmpty().withMessage('Le titre est requis'),
    body('date_evenement').isISO8601().withMessage('Date invalide'),
    validate
  ],
  evenementController.create
);

router.put('/:id', evenementController.update);

router.put('/:id/statut', evenementController.updateStatut);

router.delete('/:id', evenementController.delete);

module.exports = router;

