var winston = require('winston');

function Logger( config ){

  var transports;
  if ( config.logfile ){

    // we need a dir to do log rotation so we get the dir from the file
    var logpath = config.logfile.split('/');
    logpath.splice(-1,1);
    logpath = logpath.join('/');

    transports = [
      // keep logging errors to the console (may not be needed)
      new (winston.transports.DailyRotateFile)({
        filename: config.logfile,
        dirname: logpath,
        datePattern: '.yyyy-MM-dd',
        colorize: true,
        level: 'debug'
      })
    ];
  } else {
    // no logfile defined, log to console only
    transports = [ new (winston.transports.Console)({ level: 'debug' }) ];
  }
  return new (winston.Logger)({ transports: transports });

}

module.exports = Logger;
