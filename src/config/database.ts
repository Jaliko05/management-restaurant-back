import { PrismaClient } from '@prisma/client';
import logger from '../utils/logger';

export const prisma = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
});

// Conectar a la base de datos
export const connectDatabase = async (): Promise<void> => {
    try {
        await prisma.$connect();
        logger.info('✅ Base de datos conectada exitosamente');
    } catch (error) {
        logger.error('❌ Error conectando a la base de datos:', error);
        throw error;
    }
};

// Desconectar de la base de datos
export const disconnectDatabase = async (): Promise<void> => {
    try {
        await prisma.$disconnect();
        logger.info('🔌 Base de datos desconectada');
    } catch (error) {
        logger.error('❌ Error desconectando de la base de datos:', error);
    }
};