import pino from 'pino';
// TODO: use different loglevel for production and staging environments
export const logger = pino({ level: 'debug' });
