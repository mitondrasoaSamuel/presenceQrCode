const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const pasteurController = require('../controllers/pasteurController');
const { authMiddleware } = require('../middlewares/auth');
const { validate } = require('../middlewares/validation');

router.use(authMiddleware);

router.get('/', pasteurController.getAll);

router.get('/search/:matricule', pasteurController.getByMatricule);

router.get('/:id', pasteurController.getById);

router.get('/:matricule/qrcode', pasteurController.generateQRCode);

router.post(
  '/',
  [
    body('matricule').notEmpty().withMessage('Le matricule est requis'),
    body('nom').notEmpty().withMessage('Le nom est requis'),
    body('prenom').notEmpty().withMessage('Le prénom est requis'),
    validate
  ],
  pasteurController.create
);

router.put('/:id', pasteurController.update);

router.delete('/:id', pasteurController.delete);

module.exports = router;

