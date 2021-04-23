import winston from 'winston';

const { combine, printf, label, timestamp } = winston.format;

const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

const logger = winston.createLogger({
  level: 'info',
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: './logs/log.log' }),
  ],
  format: combine(label({ label: 'my-bank-api' }), timestamp(), myFormat),
});

// logger.error('error log');
// logger.warn('warn log');
// logger.info('info log');
// logger.verbose('verbose log');
// logger.debug('debug log');
// logger.silly('silly log');
// logger.log('info', 'Hello with parameter!');

export default logger;
