import fs from 'fs';
import path from 'path';

interface LogMeta {
    [key: string]: any;
}

class Logger {
    private logDir: string;

    constructor() {
        this.logDir = path.join(__dirname, '../../logs');
        this.ensureLogDirectory();
    }

    private ensureLogDirectory(): void {
        if (!fs.existsSync(this.logDir)) {
            fs.mkdirSync(this.logDir, { recursive: true });
        }
    }

    private formatMessage(level: string, message: string, meta: LogMeta = {}): string {
        return JSON.stringify({
            timestamp: new Date().toISOString(),
            level,
            message,
            ...meta,
        });
    }

    private writeLog(level: string, message: string, meta: LogMeta = {}): void {
        const logMessage = this.formatMessage(level, message, meta);

        // Escribir a archivo
        const logFile = path.join(this.logDir, `${level}.log`);
        fs.appendFileSync(logFile, logMessage + '\n');

        // También mostrar en consola en desarrollo
        if (process.env.NODE_ENV === 'development') {
            console.log(logMessage);
        }
    }

    public info(message: string, meta: LogMeta = {}): void {
        this.writeLog('info', message, meta);
    }

    public error(message: string, meta: LogMeta = {}): void {
        this.writeLog('error', message, meta);
    }

    public warn(message: string, meta: LogMeta = {}): void {
        this.writeLog('warn', message, meta);
    }

    public debug(message: string, meta: LogMeta = {}): void {
        if (process.env.NODE_ENV === 'development') {
            this.writeLog('debug', message, meta);
        }
    }
}

export default new Logger();