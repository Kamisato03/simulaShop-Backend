import { body, validationResult } from 'express-validator';

export const validateStore = [
  body('name')
    .isString()
    .withMessage('El nombre debe ser una cadena de caracteres.')
    .notEmpty()
    .withMessage('El nombre es requerido.'),
  body('cycleType')
    .isString()
    .withMessage('El tipo de ciclo debe ser una cadena de caracteres.')
    .notEmpty()
    .withMessage('El tipo de ciclo es requerido.'),
  body('numberOfCycles')
    .isInt({ min: 0 })
    .withMessage('El número de ciclos debe ser un entero no negativo.')
    .notEmpty()
    .withMessage('El número de ciclos es requerido.'),
  body('initialBenefits')
    .isFloat({ min: 0 })
    .withMessage('Los beneficios iniciales deben ser un número no negativo.')
    .notEmpty()
    .withMessage('Los beneficios iniciales son requeridos.'),
  body('lastBenefits')
    .isFloat({ min: 0 })
    .withMessage('Los últimos beneficios deben ser un número no negativo.')
    .notEmpty()
    .withMessage('Los últimos beneficios son requeridos.'),
  body('totalEarnings')
    .isFloat({ min: 0 })
    .withMessage('Las ganancias totales deben ser un número no negativo.')
    .notEmpty()
    .withMessage('Las ganancias totales son requeridas.'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
