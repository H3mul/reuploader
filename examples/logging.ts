import winston from 'winston';

// From:
// https://www.digitalocean.com/community/tutorials/how-to-use-winston-to-log-node-js-applications-on-ubuntu-20-04

const logFormat = winston.format.combine(
    winston.format.errors({ stack: true }),
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.colorize(),
    winston.format.printf(({ timestamp, level, message }) => {
        return `[${timestamp}] ${level}: ${message}`;
    })
 );

let logger = winston.createLogger({
        level: "debug",
        handleExceptions: true,
        format: logFormat,
        transports: [ new winston.transports.Console() ],
        exitOnError: false, // do not exit on handled exceptions
    });

export default logger;
