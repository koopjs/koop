var winston = require('winston');

function Logger( config ){

  var transports;
  if ( config.logfile ){
    transports = [
      // keep logging errors to the console (may not be needed)
      //new (winston.transports.Console)({ level: 'error' }),
      new (winston.transports.File)({ filename: config.logfile, level: 'debug' })
    ];
  } else {
    // no logfile defined, log to console only
    transports = [ new (winston.transports.Console)({ level: 'debug' }) ];
  }
  return new (winston.Logger)({ transports: transports });

}

module.exports = Logger;
