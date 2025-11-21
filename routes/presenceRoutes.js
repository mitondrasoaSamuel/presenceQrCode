const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const presenceController = require('../controllers/presenceController');
const { authMiddleware } = require('../middlewares/auth');
const { validate } = require('../middlewares/validation');

router.use(authMiddleware);

router.get('/', presenceController.getAll);

router.post(
  '/:evenement_id/scan',
  [
    body('matricule_scanne').notEmpty().withMessage('Le matricule est requis'),
    validate
  ],
  presenceController.scanQRCodePresence
);

router.post(
  '/:evenement_id/manuel',
  [
    body('pasteur_id').notEmpty().withMessage('Le pasteur_id est requis'),
    validate
  ],
  presenceController.addManualPresence
);

router.get('/evenement/:id', presenceController.getPresencesByEvent);

router.get('/evenement/:id/stats', presenceController.getEventStats);

router.get('/evenement/:id/absents', presenceController.getAbsents);

router.get('/pasteur/:id', presenceController.getPasteurHistory);

router.delete('/:id', presenceController.delete);

module.exports = router;

