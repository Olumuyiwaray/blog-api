import { createLogger, format, transports } from 'winston';
import { Logger } from 'winston';

// Create a custom format for the logger
const customFormat = format.printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

// Create a Winston logger instance
const logger: Logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    customFormat
  ),
  transports: [
    new transports.File({ filename: 'logs/error.log', level: 'error' }), // Log errors to a error file
    new transports.File({ filename: 'logs/info.log', level: 'info' }), // Log other messages to log file
  ],
});

export default logger;
