import { createLogger, format, transports } from "winston";

const isDevelopment = process.env.NODE_ENV === "development";

const logger = createLogger({
  level: isDevelopment ? "info" : "warn",
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.json(),
  ),
  transports: [
    new transports.Console(),
    new transports.File({
      filename: 'logs/app-%DATE%.log',
      level: 'error',
      handleExceptions: true,
    }),
  ],
});

export default logger;