const winston = require('winston');

const customTimestampFormat = winston.format((info) => {
    info.timestamp = new Date().toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });
    return info;
})();

const Logger = winston.createLogger({
    level: 'debug',
    format: winston.format.combine(
        customTimestampFormat,
        winston.format.colorize(),
        winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} ${level}: ${message}`;
        })
    ),
    transports: [new winston.transports.Console()],
});

module.exports = { Logger };
