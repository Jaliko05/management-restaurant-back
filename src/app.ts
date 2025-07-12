import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';

import routes from './routes';
import { errorHandler, notFound } from './middleware/error.middleware';
import { RATE_LIMIT_WINDOW_MS, RATE_LIMIT_MAX } from './config/app.config';

const app: Application = express();

// Middlewares de seguridad
app.use(helmet());
app.use(cors());
app.use(compression());

// Rate limiting
const limiter = rateLimit({
    windowMs: RATE_LIMIT_WINDOW_MS,
    max: RATE_LIMIT_MAX,
    message: {
        error: 'Demasiadas peticiones, intenta de nuevo más tarde',
    },
});
app.use('/api/', limiter);

// Middlewares de parseo
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging
app.use(morgan('combined'));

// Health check
app.get('/health', (req: Request, res: Response) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
    });
});

// Rutas
app.use('/api', routes);

// Middleware de errores
app.use(notFound);
app.use(errorHandler);

export default app;