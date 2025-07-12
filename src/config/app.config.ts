export const PORT: number = parseInt(process.env.PORT || '3000', 10);
export const NODE_ENV: string = process.env.NODE_ENV || 'development';
export const JWT_SECRET: string = process.env.JWT_SECRET || 'fallback-secret';
export const JWT_EXPIRE: string = process.env.JWT_EXPIRE || '7d';
export const RATE_LIMIT_WINDOW_MS: number = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10);
export const RATE_LIMIT_MAX: number = parseInt(process.env.RATE_LIMIT_MAX || '100', 10);