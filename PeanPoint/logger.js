const winston = require('winston');

// Create a logger instance
const logger = winston.createLogger({
  // Define the levels of logs
  levels: winston.config.npm.levels,
  // Define the format of the log output
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.errors({ stack: true }), // To log the full stack trace
    winston.format.splat(),
    winston.format.json()
  ),
  // Define transports (where to log)
  transports: [
    // Console transport for logging to the console
    new winston.transports.Console({
      level: 'info', // Minimum level to log to console
      format: winston.format.combine(
        winston.format.colorize(), // Colorize log levels
        winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
      )
    }),
    // File transport for logging to a file
    new winston.transports.File({
      filename: 'logs/error.log', // File to log errors
      level: 'error', // Only log messages of level 'error'
    }),
    new winston.transports.File({
      filename: 'logs/combined.log', // File for combined logs
    })
  ],
  // Do not exit on handled exceptions
  exitOnError: false,
});

// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

module.exports = logger;