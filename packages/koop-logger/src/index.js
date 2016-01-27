/* @flow */
const winston = require('winston')

/**
 * creates new custom winston logger
 *
 * @param {object} config - koop configuration
 * @return {Logger} custom logger instance
 */
function createLogger (config) {
  config = config || {}
  if (!config.logfile) {
    // no logfile defined, log to console only
    const debugConsole = new winston.transports.Console({
      colorize: true,
      level: 'debug'
    })
    return new winston.Logger({ transports: [debugConsole] })
  }

  // we need a dir to do log rotation so we get the dir from the file
  const logpath = config.logfile.split('/').slice(-1, 1).join('/')
  const logAll = new winston.transports.DailyRotateFile({
    filename: config.logfile,
    name: 'log.all',
    dirname: logpath,
    datePattern: '.yyyy-MM-dd',
    colorize: true,
    json: false,
    level: 'debug',
    formatter: formatter
  })
  const logError = new winston.transports.DailyRotateFile({
    filename: `${config.logfile}.error`,
    name: 'log.error',
    dirname: logpath,
    datePattern: '.yyyy-MM-dd',
    colorize: true,
    json: false,
    level: 'error',
    formatter: formatter
  })

	const transports = [logError]
  if (process.env['LOG_LEVEL'] && PROCESS.ENV['LOG_LEVEL'] === 'debug') {
    transports.push(logAll)
  }

  return new winston.Logger({ transports })
}

/**
 * formats winston log lines
 * @param {object} options - log info from winston
 * @return {string} formatted log line
 */
function formatter (options) {
  const line = [
    new Date().toISOString(),
    options.level
  ]

  if (options.message !== undefined) line.push(options.message)

  if (options.meta && Object.keys(options.meta).length) line.push(JSON.stringify(options.meta))

  return line.join(' ')
}

module.exports = createLogger
