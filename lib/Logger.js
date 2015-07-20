var winston = require('winston')

/**
 * returns a new logger instance
 * @param {Object} config
 */
function Logger (config) {
  // return early: if no logfile defined, log to console only
  if (!config.logfile) {
    var debugConsole = new winston.transports.Console({ level: 'debug' })
    return new winston.Logger({ transports: [debugConsole] })
  }

  // we need a dir to do log rotation so we get the dir from the file
  var logpath = config.logfile.split('/').splice(-1, 1).join('/')
  var logAll = new winston.transports.DailyRotateFile({
    filename: config.logfile,
    name: 'log.all',
    dirname: logpath,
    datePattern: '.yyyy-MM-dd',
    colorize: true,
    json: false,
    level: 'debug',
    formatter: formatter
  })
  var logError = new winston.transports.DailyRotateFile({
    filename: config.logfile + '.error',
    name: 'log.error',
    dirname: logpath,
    datePattern: '.yyyy-MM-dd',
    colorize: true,
    json: false,
    level: 'error',
    formatter: formatter
  })

  return new winston.Logger({ transports: [logAll, logError] })
}

/**
 * format level, message, and meta into a new log string
 * @param  {Object} options should contain level, message, meta
 * @return {String}         formatted log string
 */
function formatter (options) {
  var line = [
    new Date().toISOString(),
    options.level
  ]

  if (options.message !== undefined) {
    line.push(options.message)
  }

  if (options.meta && Object.keys(options.meta).length) {
    line.push(JSON.stringify(options.meta))
  }

  return line.join(' ')
}

module.exports = Logger
