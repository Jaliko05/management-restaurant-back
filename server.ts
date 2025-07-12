import dotenv from 'dotenv';
import app from './src/app';
import { PORT } from './config/app.config';
import { connectDatabase } from './config/database';
import logger from './utils/logger';

dotenv.config();

const startServer = async (): Promise<void> => {
    try {
        // Conectar a la base de datos
        await connectDatabase();

        const server = app.listen(PORT, () => {
            logger.info(`🚀 Servidor corriendo en puerto ${PORT}`);
            logger.info(`🌍 Ambiente: ${process.env.NODE_ENV}`);
        });

        // Manejo graceful shutdown
        process.on('SIGTERM', () => {
            logger.info('👋 SIGTERM recibido');
            server.close(() => {
                logger.info('💀 Proceso terminado');
                process.exit(0);
            });
        });

        process.on('SIGINT', () => {
            logger.info('👋 SIGINT recibido');
            server.close(() => {
                logger.info('💀 Proceso terminado');
                process.exit(0);
            });
        });
    } catch (error) {
        logger.error('Error iniciando servidor:', error);
        process.exit(1);
    }
};

startServer();