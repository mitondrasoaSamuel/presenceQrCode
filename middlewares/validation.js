const { validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error('❌ Erreur de validation:', errors.array());
    const errorMessages = errors.array().map(err => err.msg).join(', ');
    return res.status(400).json({
      success: false,
      message: `Erreur de validation: ${errorMessages}`,
      errors: errors.array()
    });
  }
  next();
};

module.exports = { validate };

