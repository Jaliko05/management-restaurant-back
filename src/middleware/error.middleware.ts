import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../utils/response';
import logger from '../utils/logger';
import { HttpStatus } from '../types/common.types';

// Clase para errores personalizados
export class AppError extends Error {
    public statusCode: number;
    public isOperational: boolean;
    public status: string;

    constructor(message: string, statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR, isOperational: boolean = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';

        Error.captureStackTrace(this, this.constructor);
    }
}

// Middleware para rutas no encontradas
export const notFound = (req: Request, res: Response, next: NextFunction): void => {
    const error = new AppError(`Ruta ${req.originalUrl} no encontrada`, HttpStatus.NOT_FOUND);
    next(error);
};

// Middleware principal de manejo de errores
export const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    let error = { ...err };
    error.message = err.message;

    // Log del error
    logger.error('Error:', {
        message: err.message,
        stack: err.stack,
        url: req.originalUrl,
        method: req.method,
        ip: req.ip,
    });

    // Error de validación de Prisma
    if (err.code === 'P2002') {
        const message = 'Recurso duplicado';
        error = new AppError(message, HttpStatus.BAD_REQUEST);
    }

    // Error de registro no encontrado en Prisma
    if (err.code === 'P2025') {
        const message = 'Registro no encontrado';
        error = new AppError(message, HttpStatus.NOT_FOUND);
    }

    // Error de validación
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map((val: any) => val.message).join(', ');
        error = new AppError(message, HttpStatus.BAD_REQUEST);
    }

    // Error JWT
    if (err.name === 'JsonWebTokenError') {
        const message = 'Token inválido';
        error = new AppError(message, HttpStatus.UNAUTHORIZED);
    }

    // Error JWT expirado
    if (err.name === 'TokenExpiredError') {
        const message = 'Token expirado';
        error = new AppError(message, HttpStatus.UNAUTHORIZED);
    }

    res.status(error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR).json(
        ApiResponse.error(
            error.message || 'Error interno del servidor',
            error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
            process.env.NODE_ENV === 'development' ? err.stack : undefined
        )
    );
};