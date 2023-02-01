/* @flow */
const winston = require('winston');
const { format } = winston;
const path = require('path');

/**
 * creates new custom winston logger
 *
 * @param {object} config - koop configuration
 * @return {Logger} custom logger instance
 */
function createLogger(config) {
  config = config || {};
  const level = setLogLevel(config.logLevel);

  if (config.logfile) {
    const fileTransports = setupFileTransport(config.logfile, level);
    return winston.createLogger({ transports: fileTransports });
  }

  const consoleTransport = new winston.transports.Console({
    colorize: true,
    level,
    stringify: true,
    json: true,
  });

  return winston.createLogger({
    transports: [consoleTransport],
    format: format.combine(
      format.errors({ stack: ['debug', 'silly'].includes(level) }),
      format.timestamp(),
      format.colorize(),
      format.printf(({ level, message, timestamp, stack }) => {
        if (stack) {
          // print log trace
          return `${timestamp} ${level}: ${message} - ${stack}`;
        }
        return `${timestamp} ${level}: ${message}`;
      }),
    ),
  });
}

function setLogLevel(logLevel) {
  if (logLevel) {
    return logLevel;
  }

  if (process.env.KOOP_LOG_LEVEL || process.env.LOG_LEVEL) {
    return process.env.KOOP_LOG_LEVEL || process.env.LOG_LEVEL;
  }

  return 'info';
}

function setupFileTransport(logfile, level) {
  const logpath = path.dirname(logfile);
  const logAll = new winston.transports.File({
    filename: logfile,
    name: 'log.all',
    dirname: logpath,
    colorize: true,
    json: false,
    level,
    formatter: formatter,
  });

  const logError = new winston.transports.File({
    filename: logfile.replace('.log', '.error.log'),
    name: 'log.error',
    dirname: logpath,
    colorize: true,
    json: false,
    level: 'error',
    formatter: formatter,
  });

  const transports = [logError];

  if (level === 'debug') {
    transports.push(logAll);
  }

  return transports;
}

/**
 * formats winston log lines
 * @param {object} options - log info from winston
 * @return {string} formatted log line
 */
function formatter(options) {
  const line = [new Date().toISOString(), options.level];

  if (options.message !== undefined) line.push(options.message);

  if (options.meta && Object.keys(options.meta).length)
    line.push(JSON.stringify(options.meta));

  return line.join(' ');
}

module.exports = createLogger;
