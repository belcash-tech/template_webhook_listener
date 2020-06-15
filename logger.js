/* eslint-disable camelcase */
const { createLogger, format, transports } = require('winston');
const winston  = require('winston')
const path = require('path')
require('winston-daily-rotate-file')
// https://github.com/winstonjs/winston#logging
// { error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5 }
const level = process.env.LOG_LEVEL || 'debug';

function formatParams(info) {
  const { timestamp, level, message, ...args } = info;
  const ts = timestamp.slice(0, 19).replace('T', ' ');

  return `${ts} ${level}: ${message} ${Object.keys(args).length
    ? JSON.stringify(args, '', '')
    : ''}`;
}

// https://github.com/winstonjs/winston/issues/1135
const developmentFormat = format.combine(
  format.colorize(),
  format.timestamp(),
  format.align(),
  format.printf(formatParams)
);

const productionFormat = format.combine(
  format.colorize(),
  format.timestamp(),
  format.align(),
  format.printf(formatParams)
);

let logger
if (process.env.NODE_ENV !== 'production') {
  logger = createLogger({
    level: level,
    format: developmentFormat,
    transports: [new transports.Console()]
  });

} else {
  
  // let error_log=[(new Date()).toISOString().slice(0,10),'error.log'].join('_')
  // let combined_log = [(new Date()).toISOString().slice(0,10), 'combined.log'].join('_')
  var error_transport = new (winston.transports.DailyRotateFile)({
    filename: path.resolve('logs/error-%DATE%.log'),
    datePattern: 'YYYY-MM-DD-HH',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d'
  })
  // error_transport.on('rotate', function(oldFilename, newFilename) {
  //   // do something fun
  // });
  var combined_transport = new (winston.transports.DailyRotateFile)({
    filename: path.resolve('logs/combined-%DATE%.log'),
    datePattern: 'YYYY-MM-DD-HH',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d'
  })
  logger = createLogger({
    level: level,
    format: productionFormat,
    transports: [
      error_transport,
      combined_transport
      // new transports.File({ filename: path.resolve(`logs/${error_log}`), level: 'error' }),
      // new transports.File({ filename: path.resolve(`logs/${combined_log}`) })
    ]
  });
}

module.exports = logger;
