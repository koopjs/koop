var winston = require('winston');

function Logger( config ){

  var transports;
  if ( config.logfile ){

    // we need a dir to do log rotation so we get the dir from the file
    var logpath = config.logfile.split('/');
    logpath.splice(-1,1);
    logpath = logpath.join('/');

    // define a custom log formatter
    var formatter = function(options) {
      return [
        new Date().toISOString(),
        options.level, 
        (undefined !== options.message ? options.message : ''),
        (options.meta && Object.keys(options.meta).length ? JSON.stringify(options.meta) : '' )
      ].join(' ');
    };

    transports = [
      new (winston.transports.DailyRotateFile)({
        filename: config.logfile,
        name: 'log.all',
        dirname: logpath,
        datePattern: '.yyyy-MM-dd',
        colorize: true,
        json: false,        
        level: 'debug',
        formatter: formatter
      }),
      new (winston.transports.DailyRotateFile)({
        filename: config.logfile + '.error',
        name: 'log.error',
        dirname: logpath,
        datePattern: '.yyyy-MM-dd',
        colorize: true,
        json: false,        
        level: 'error',
        formatter: formatter
      }),
    ];
  } else {
    // no logfile defined, log to console only
    transports = [ new (winston.transports.Console)({ level: 'debug' }) ];
  }
  return new (winston.Logger)({ transports: transports });

}

module.exports = Logger;
