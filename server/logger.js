const winston = require('winston');
const kleur = require('kleur');

const colors = {
  error: 'red',
  info: 'green',
  warn: 'yellow',
  debug: 'cyan'
};

const logFormat = winston.format.printf(({ level, message, timestamp }) => {
  const color = colors[level] || 'white';
  return `${timestamp} ${kleur[color](level)}: ${message}`;
});

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss.SSS'
    }),
    logFormat
  ),
  transports: [
    new winston.transports.Console()
  ]
});

module.exports = logger;
