import { Request, Response, NextFunction } from 'express';
import { body, param, query, validationResult, ValidationChain } from 'express-validator';
import { AppError } from './error.middleware';
import { HttpStatus } from '../types/common.types';

// Middleware para procesar errores de validación
export const handleValidationErrors = (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => error.msg);
        throw new AppError(errorMessages.join(', '), HttpStatus.BAD_REQUEST);
    }
    next();
};

// Validaciones para usuarios
export const validateCreateUser: ValidationChain[] = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Debe ser un email válido'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('La contraseña debe tener al menos 6 caracteres'),
    body('name')
        .optional()
        .trim()
        .isLength({ min: 2 })
        .withMessage('El nombre debe tener al menos 2 caracteres'),
    body('role')
        .optional()
        .isIn(['USER', 'ADMIN'])
        .withMessage('El rol debe ser USER o ADMIN'),
];

export const validateUpdateUser: ValidationChain[] = [
    param('id')
        .isString()
        .notEmpty()
        .withMessage('ID de usuario requerido'),
    body('email')
        .optional()
        .isEmail()
        .normalizeEmail()
        .withMessage('Debe ser un email válido'),
    body('name')
        .optional()
        .trim()
        .isLength({ min: 2 })
        .withMessage('El nombre debe tener al menos 2 caracteres'),
    body('role')
        .optional()
        .isIn(['USER', 'ADMIN'])
        .withMessage('El rol debe ser USER o ADMIN'),
];

export const validateUserId: ValidationChain[] = [
    param('id')
        .isString()
        .notEmpty()
        .withMessage('ID de usuario requerido'),
];

export const validatePagination: ValidationChain[] = [
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('La página debe ser un número mayor a 0'),
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('El límite debe ser un número entre 1 y 100'),
];